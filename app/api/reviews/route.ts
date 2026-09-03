import { NextRequest } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { uploadImageToCloudinary, isCloudinaryConfigured, CloudinaryUploadResult } from "@/lib/cloudinary";

export interface ReviewImage {
  url: string;
  publicId: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  title?: string;
  comment: string;
  images: ReviewImage[];
  verified: boolean;
  createdAt: string;
}

// Maximum allowed image size: 8 MB
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
// Maximum images per review
const MAX_IMAGES_COUNT = 5;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic", "image/heif"];

export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return Response.json({
        reviews: [],
        configured: false,
        message: "MongoDB is not yet configured. Please set MONGODB_URI in your .env.local file.",
      });
    }

    const db = await getDb();
    const rawReviews = await db
      .collection("reviews")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const reviews: ReviewItem[] = rawReviews.map((r) => ({
      id: r._id.toString(),
      name: r.name || "Anonymous",
      rating: typeof r.rating === "number" ? r.rating : 5,
      title: r.title || "",
      comment: r.comment || "",
      images: Array.isArray(r.images) ? r.images : [],
      verified: Boolean(r.verified),
      createdAt: r.createdAt
        ? new Date(r.createdAt).toISOString()
        : new Date().toISOString(),
    }));

    return Response.json({
      reviews,
      configured: true,
      total: reviews.length,
    });
  } catch (error: unknown) {
    console.error("Failed to fetch reviews:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      {
        error: "Failed to fetch reviews",
        details: errMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") as string | null) || "";
    const ratingRaw = formData.get("rating");
    const comment = (formData.get("comment") as string | null) || "";
    const title = (formData.get("title") as string | null) || "";

    // Validation
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return Response.json(
        { error: "Name must be at least 2 characters long." },
        { status: 400 }
      );
    }
    if (trimmedName.length > 80) {
      return Response.json(
        { error: "Name must not exceed 80 characters." },
        { status: 400 }
      );
    }

    const rating = Number(ratingRaw);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return Response.json(
        { error: "Rating must be a whole number between 1 and 5." },
        { status: 400 }
      );
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment || trimmedComment.length < 5) {
      return Response.json(
        { error: "Review comment must be at least 5 characters long." },
        { status: 400 }
      );
    }
    if (trimmedComment.length > 2000) {
      return Response.json(
        { error: "Review comment must not exceed 2000 characters." },
        { status: 400 }
      );
    }

    // Process image uploads
    const files = formData.getAll("images") as File[];
    const validImageFiles = files.filter(
      (f) => f && typeof f.size === "number" && f.size > 0 && f.name
    );

    if (validImageFiles.length > MAX_IMAGES_COUNT) {
      return Response.json(
        { error: `You can upload a maximum of ${MAX_IMAGES_COUNT} images.` },
        { status: 400 }
      );
    }

    for (const file of validImageFiles) {
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return Response.json(
          { error: `Unsupported image format (${file.type}). Please upload JPG, PNG, WEBP, or HEIC.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return Response.json(
          { error: `Image "${file.name}" exceeds the 8MB limit.` },
          { status: 400 }
        );
      }
    }

    if (validImageFiles.length > 0 && !isCloudinaryConfigured()) {
      return Response.json(
        {
          error:
            "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local to upload images.",
        },
        { status: 503 }
      );
    }

    if (!isMongoConfigured()) {
      return Response.json(
        {
          error:
            "MongoDB is not configured. Please set MONGODB_URI in .env.local to store reviews.",
        },
        { status: 503 }
      );
    }

    // Upload images to Cloudinary
    const uploadedImages: ReviewImage[] = [];
    for (const file of validImageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result: CloudinaryUploadResult = await uploadImageToCloudinary(
        buffer,
        "itminan/reviews"
      );
      uploadedImages.push({
        url: result.url,
        publicId: result.publicId,
      });
    }

    // Save review to MongoDB
    const db = await getDb();
    const newReview = {
      name: trimmedName,
      rating,
      title: title.trim(),
      comment: trimmedComment,
      images: uploadedImages,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    const insertResult = await db.collection("reviews").insertOne(newReview);

    return Response.json(
      {
        success: true,
        review: {
          id: insertResult.insertedId.toString(),
          ...newReview,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating review:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      {
        error: "Failed to submit review",
        details: errMessage,
      },
      { status: 500 }
    );
  }
}
