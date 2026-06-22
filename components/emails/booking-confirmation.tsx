import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface BookingConfirmationEmailProps {
  customerName: string;
  bookingReference: string;
  vehicleBrand: string;
  vehicleModel: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  customerEmail: string;
  customerPhone: string;
  numberOfVehicles: number;
  numberOfPeople: number;
}

export function BookingConfirmationEmail({
  customerName,
  bookingReference,
  vehicleBrand,
  vehicleModel,
  category,
  date,
  time,
  duration,
  price,
  customerEmail,
  customerPhone,
  numberOfVehicles,
  numberOfPeople,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your booking confirmation for {vehicleBrand} {vehicleModel} - Nice Quad Marrakech</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmation</Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            Thank you for booking with Nice Quad Marrakech! We're excited to have you join us for an unforgettable adventure in the beautiful landscapes of Marrakech.
          </Text>

          <Section style={bookingBox}>
            <Heading as="h2" style={h2}>Booking Details</Heading>

            <Text style={bookingDetail}>
              <strong>Booking Reference:</strong> {bookingReference}
            </Text>

            <Hr style={hr} />

            <Text style={bookingDetail}>
              <strong>Vehicle:</strong> {vehicleBrand} {vehicleModel}
            </Text>

            <Text style={bookingDetail}>
              <strong>Category:</strong> {category}
            </Text>

            <Text style={bookingDetail}>
              <strong>Date:</strong> {date}
            </Text>

            <Text style={bookingDetail}>
              <strong>Time:</strong> {time}
            </Text>

            <Text style={bookingDetail}>
              <strong>Duration:</strong> {duration}
            </Text>

            <Text style={bookingDetail}>
              <strong>Number of {category === 'QUAD' ? 'Quads' : category === 'BUGGY' ? 'Buggies' : 'Bikes'}:</strong> {numberOfVehicles}
            </Text>

            {category === 'QUAD' && numberOfPeople > numberOfVehicles && (
              <Text style={bookingDetail}>
                <strong>Total People:</strong> {numberOfPeople} ({numberOfPeople - numberOfVehicles} second passenger{numberOfPeople - numberOfVehicles > 1 ? 's' : ''})
              </Text>
            )}

            <Text style={bookingDetail}>
              <strong>Total Price:</strong> {price}
            </Text>
          </Section>

          <Section style={customerInfoBox}>
            <Heading as="h2" style={h2}>Your Information</Heading>

            <Text style={bookingDetail}>
              <strong>Name:</strong> {customerName}
            </Text>

            <Text style={bookingDetail}>
              <strong>Email:</strong> {customerEmail}
            </Text>

            <Text style={bookingDetail}>
              <strong>Phone:</strong> {customerPhone}
            </Text>
          </Section>

          <Section style={importantInfo}>
            <Heading as="h3" style={h3}>Important Information</Heading>

            <Text style={text}>
              • Please arrive 15 minutes before your scheduled time
            </Text>
            <Text style={text}>
              • Bring your passport or ID with you
            </Text>
            <Text style={text}>
              • Wear comfortable clothes suitable for outdoor activities
            </Text>
            <Text style={text}>
              • All safety equipment will be provided
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              <strong>Nice Quad Marrakech</strong>
            </Text>
            <Text style={footerText}>
              Marrakech, Morocco
            </Text>
            <Text style={footerText}>
              Phone: +212 6 34 32 44 28
            </Text>
            <Text style={footerText}>
              Email: nicequadmarrakech@gmail.com
            </Text>
            <Text style={footerText}>
              For any questions or changes to your booking, please reply to this email or contact us.
            </Text>
          </Section>

          <Text style={disclaimer}>
            This is an automated confirmation email. Please keep it for your records.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '20px auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const h1 = {
  color: '#ea580c',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 12px',
};

const bookingBox = {
  backgroundColor: '#fff7ed',
  border: '2px solid #ea580c',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const customerInfoBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const bookingDetail = {
  color: '#1f2937',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const importantInfo = {
  margin: '24px 0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const footer = {
  marginTop: '32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const disclaimer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '24px',
};

export default BookingConfirmationEmail;
