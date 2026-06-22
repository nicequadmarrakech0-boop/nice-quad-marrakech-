import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BookingConfirmationEmail } from '@/components/emails/booking-confirmation';
import { AdminNotificationEmail } from '@/components/emails/admin-notification';

// Lazy initialization to avoid build-time errors
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Generate unique booking reference
function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NQM-${timestamp}-${randomStr}`;
}

// Format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time for display
function formatTime(time: Date): string {
  return time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      vehicleBrand,
      vehicleModel,
      category,
      date,
      time,
      duration,
      price,
      numberOfVehicles = 1,
      numberOfPeople = 1,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !vehicleBrand || !vehicleModel || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Format dates for email
    // Parse date as YYYY-MM-DD and create local date to avoid timezone shift
    const [year, month, day] = date.split('-').map(Number);
    const bookingDate = new Date(year, month - 1, day);
    const bookingTime = new Date(time);
    const formattedDate = formatDate(bookingDate);
    const formattedTime = formatTime(bookingTime);

    // Format duration
    const durationText = duration === '1hour' ? '1 Hour' : '2 Hours';

    // Email props
    const emailProps = {
      customerName,
      bookingReference,
      vehicleBrand,
      vehicleModel,
      category,
      date: formattedDate,
      time: formattedTime,
      duration: durationText,
      price,
      customerEmail,
      customerPhone,
      numberOfVehicles,
      numberOfPeople,
    };

    // Send confirmation email to customer
    const resend = getResend();
    const customerEmailResult = await resend.emails.send({
      from: 'Nice Quad Marrakech <contact@nicequadmarrakech.com>',
      to: [customerEmail],
      subject: `Booking Confirmation - ${vehicleBrand} ${vehicleModel} - ${bookingReference}`,
      react: BookingConfirmationEmail(emailProps),
    });

    if (customerEmailResult.error) {
      console.error('Error sending customer email:', customerEmailResult.error);
      return NextResponse.json(
        { error: 'Failed to send confirmation email to customer', details: customerEmailResult.error },
        { status: 500 }
      );
    }

    // Send notification email to admin
    const adminEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || 'mohamedelberkaoui200@gmail.com';
    const adminEmailResult = await resend.emails.send({
      from: 'Nice Quad Marrakech <contact@nicequadmarrakech.com>',
      to: [adminEmail],
      replyTo: customerEmail,
      subject: `New Booking Request - ${vehicleBrand} ${vehicleModel} - ${customerName}`,
      react: AdminNotificationEmail(emailProps),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
      },
    });

    if (adminEmailResult.error) {
      console.error('Error sending admin email:', adminEmailResult.error);
      // Don't fail the request if admin email fails, customer email is more important
    }

    return NextResponse.json({
      success: true,
      bookingReference,
      message: 'Booking confirmation sent successfully',
      customerEmailId: customerEmailResult.data?.id,
      adminEmailId: adminEmailResult.data?.id,
    });

  } catch (error: any) {
    console.error('Booking email API error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking', message: error.message },
      { status: 500 }
    );
  }
}
