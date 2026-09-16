"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, Upload, X, Camera, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import styles from "./Reviews.module.css";

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

export function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; author: string } | null>(null);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        if (data.configured === false) {
          setIsConfigured(false);
        } else {
          setIsConfigured(true);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Prevent body scroll and stop Lenis smooth-scroll from scrolling the background
  useEffect(() => {
    if (isModalOpen || lightboxImage) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isModalOpen, lightboxImage]);

  // Cleanup object URLs when previews change
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incomingFiles = Array.from(e.target.files);

    const totalAllowed = 5;
    const remainingSlots = totalAllowed - selectedFiles.length;

    if (remainingSlots <= 0) {
      setFormError("Maximum 5 images allowed per review.");
      return;
    }

    const filesToAdd = incomingFiles.slice(0, remainingSlots);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of filesToAdd) {
      if (file.size > 8 * 1024 * 1024) {
        setFormError(`Image "${file.name}" is larger than 8MB.`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setFormError(null);

    // Reset native input so the same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setRating(5);
    setHoverRating(0);
    setName("");
    setTitle("");
    setComment("");
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setFormError(null);
    setFormSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setFormError("Please provide a review comment (minimum 5 characters).");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("rating", rating.toString());
      if (title.trim()) formData.append("title", title.trim());
      formData.append("comment", comment.trim());

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setFormSuccess(true);
      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
      } else {
        fetchReviews();
      }

      setTimeout(() => {
        setIsModalOpen(false);
        resetForm();
      }, 1600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong while submitting.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <section id="reviews" className={styles.section}>
      <div className={styles.inner}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.kicker}>Customer Impressions</div>
          <h2 className={styles.title}>What Customers Say</h2>
          <p className={styles.sub}>
            Genuine feedback from owners of handcrafted ITMINAAN pieces. Every detail speaks of heritage and devotion.
          </p>

          {/* Aggregate Rating & Action Bar */}
          <div className={styles.statsBar}>
            <div className={styles.ratingSummary}>
              <div className={styles.scoreNumber}>{averageRating}</div>
              <div className={styles.scoreStars}>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={
                        s <= Math.round(Number(averageRating))
                          ? styles.starFilled
                          : styles.starEmpty
                      }
                    />
                  ))}
                </div>
                <span className={styles.reviewCount}>
                  Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className={styles.writeReviewBtn}
              type="button"
            >
              <MessageSquare size={16} />
              Write a Review
            </button>
          </div>
        </motion.div>

        {/* Database Config Note (if unconfigured) */}
        {!isConfigured && (
          <div className={styles.configBanner}>
            <AlertCircle size={18} />
            <span>
              <strong>Note for Admin:</strong> MongoDB is not connected yet. Add <code>MONGODB_URI</code> to <code>.env.local</code> to store and view real-time customer reviews.
            </span>
          </div>
        )}

        {/* Reviews List / Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader2 className={styles.spinner} size={32} />
            <p>Loading customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          /* Empty State */
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.emptyStars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} className={styles.starFilled} />
              ))}
            </div>
            <h3 className={styles.emptyTitle}>Be the first to share your story</h3>
            <p className={styles.emptyText}>
              Every ITMINAAN handbag is crafted with artisan devotion. Share your thoughts, styling photos, and impression with our community.
            </p>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className={styles.orderBtn}
            >
              Write First Review →
            </button>
          </motion.div>
        ) : (
          /* Reviews Grid */
          <div className={styles.reviewsGrid}>
            {reviews.map((review, idx) => (
              <motion.article
                key={review.id || idx}
                className={styles.reviewCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.4) }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.authorBadge}>
                    <span className={styles.authorAvatar}>
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                    <div className={styles.authorMeta}>
                      <div className={styles.authorNameRow}>
                        <span className={styles.authorName}>{review.name}</span>
                        {review.verified && (
                          <span className={styles.verifiedBadge} title="Verified Customer">
                            <CheckCircle size={13} />
                            Verified
                          </span>
                        )}
                      </div>
                      <time className={styles.dateText}>
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  <div className={styles.cardStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        className={s <= review.rating ? styles.starFilled : styles.starEmpty}
                      />
                    ))}
                  </div>
                </div>

                {review.title && <h4 className={styles.reviewHeadline}>{review.title}</h4>}

                <p className={styles.reviewBody}>{review.comment}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className={styles.gallery}>
                    {review.images.map((img, i) => (
                      <button
                        key={img.publicId || i}
                        type="button"
                        className={styles.galleryThumbBtn}
                        onClick={() =>
                          setLightboxImage({
                            url: img.url,
                            author: review.name,
                          })
                        }
                        title="Click to view photo"
                      >
                        <Image
                          src={img.url}
                          alt={`Review photo by ${review.name}`}
                          width={140}
                          height={140}
                          className={styles.galleryThumb}
                        />
                        <span className={styles.zoomOverlay}>
                          <Camera size={16} />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={styles.modalBackdrop}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSubmitting) {
                setIsModalOpen(false);
              }
            }}
          >
            <motion.div
              className={styles.modalContent}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                aria-label="Close dialog"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>

              <div className={styles.modalHeader}>
                <span className={styles.modalKicker}>ITMINAAN Reviews</span>
                <h3 className={styles.modalTitle}>Share Your Experience</h3>
                <p className={styles.modalSub}>
                  Your authentic review helps fellow handbag enthusiasts discover the artisanal quality of our collection.
                </p>
              </div>

              {formSuccess ? (
                <motion.div
                  className={styles.successState}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={48} className={styles.successIcon} />
                  <h4>Thank You!</h4>
                  <p>Your review has been successfully submitted and stored.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  {formError && (
                    <div className={styles.formError}>
                      <AlertCircle size={16} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Rating Picker */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Overall Rating *</label>
                    <div className={styles.starPicker}>
                      {[1, 2, 3, 4, 5].map((s) => {
                        const active = s <= (hoverRating || rating);
                        return (
                          <button
                            key={s}
                            type="button"
                            className={styles.starPickerBtn}
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`${s} Stars`}
                          >
                            <Star
                              size={28}
                              className={active ? styles.starFilled : styles.starEmpty}
                            />
                          </button>
                        );
                      })}
                      <span className={styles.ratingDescriptor}>
                        {hoverRating === 5 || (!hoverRating && rating === 5)
                          ? "Exceptional"
                          : hoverRating === 4 || (!hoverRating && rating === 4)
                          ? "Great"
                          : hoverRating === 3 || (!hoverRating && rating === 3)
                          ? "Average"
                          : hoverRating === 2 || (!hoverRating && rating === 2)
                          ? "Fair"
                          : "Poor"}
                      </span>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="review-name" className={styles.label}>
                      Your Name *
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Ayesha Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={80}
                      required
                    />
                  </div>

                  {/* Headline / Title (Optional) */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="review-title" className={styles.label}>
                      Review Headline (Optional)
                    </label>
                    <input
                      id="review-title"
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Stunning craftsmanship and packaging!"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={120}
                    />
                  </div>

                  {/* Comment Textarea */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="review-comment" className={styles.label}>
                      Your Review *
                    </label>
                    <textarea
                      id="review-comment"
                      className={styles.textarea}
                      placeholder="Tell us what you loved about the handbag, the texture, embroidery, or presentation..."
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={2000}
                      required
                    />
                    <div className={styles.charCount}>{comment.length}/2000</div>
                  </div>

                  {/* Image Upload Zone */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Add Photos <span className={styles.optional}>(Optional — up to 5)</span>
                    </label>

                    <div className={styles.uploadContainer}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id={fileInputId}
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileChange}
                        className={styles.hiddenFileInput}
                      />

                      <label htmlFor={fileInputId} className={styles.uploadDropzone}>
                        <Upload size={22} className={styles.uploadIcon} />
                        <div>
                          <span className={styles.uploadPrompt}>Click to upload photos</span>
                          <span className={styles.uploadHint}>JPG, PNG, WEBP up to 8MB each</span>
                        </div>
                      </label>

                      {/* Image Previews */}
                      {previewUrls.length > 0 && (
                        <div className={styles.previewList}>
                          {previewUrls.map((url, i) => (
                            <div key={url} className={styles.previewItem}>
                              <Image
                                src={url}
                                alt={`Preview ${i + 1}`}
                                width={72}
                                height={72}
                                className={styles.previewImg}
                                unoptimized
                              />
                              <button
                                type="button"
                                className={styles.removeImgBtn}
                                onClick={() => removeFile(i)}
                                title="Remove photo"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className={styles.spinner} />
                          Uploading & Saving...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className={styles.lightboxBackdrop}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <div className={styles.lightboxContainer} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setLightboxImage(null)}
                aria-label="Close image"
              >
                <X size={24} />
              </button>
              <div className={styles.lightboxImageWrapper}>
                <Image
                  src={lightboxImage.url}
                  alt={`Review photo by ${lightboxImage.author}`}
                  width={900}
                  height={900}
                  className={styles.lightboxImage}
                  style={{ objectFit: "contain", maxHeight: "80vh", width: "auto" }}
                />
              </div>
              <div className={styles.lightboxCaption}>
                <span>Photo shared by <strong>{lightboxImage.author}</strong></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
