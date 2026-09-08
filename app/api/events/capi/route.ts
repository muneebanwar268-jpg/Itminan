import { NextResponse } from 'next/server';
import { sendMetaCapiEvent, MetaEventPayload } from '@/lib/meta-capi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventId, customData, userData = {}, eventSourceUrl } = body;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { error: 'Missing eventName or eventId' },
        { status: 400 }
      );
    }

    // Extract client IP and user-agent from request headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIpAddress = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : request.headers.get('x-real-ip') || undefined;

    const clientUserAgent = request.headers.get('user-agent') || undefined;

    // Extract cookies directly if not forwarded in body
    const cookieHeader = request.headers.get('cookie') || '';
    const fbpMatch = cookieHeader.match(/(^|;\s*)_fbp=([^;]*)/);
    const fbcMatch = cookieHeader.match(/(^|;\s*)_fbc=([^;]*)/);

    const fbp = userData.fbp || (fbpMatch ? decodeURIComponent(fbpMatch[2]) : undefined);
    const fbc = userData.fbc || (fbcMatch ? decodeURIComponent(fbcMatch[2]) : undefined);

    const payload: MetaEventPayload = {
      eventName,
      eventId,
      eventTime: Math.floor(Date.now() / 1000),
      eventSourceUrl: eventSourceUrl || request.headers.get('referer') || 'https://itminaan.pk',
      userData: {
        ...userData,
        clientIpAddress,
        clientUserAgent,
        fbp,
        fbc,
      },
      customData,
    };

    const result = await sendMetaCapiEvent(payload);

    return NextResponse.json({
      success: result.success,
      error: result.error,
    });
  } catch (error: any) {
    console.error('[API CAPI] Dispatch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error dispatching CAPI event' },
      { status: 500 }
    );
  }
}
