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

interface AdminNotificationEmailProps {
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

export function AdminNotificationEmail({
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
}: AdminNotificationEmailProps) {
  return (
    <Html dir="rtl">
      <Head />
      <Preview>طلب حجز جديد: {vehicleBrand} {vehicleModel} - {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎯 طلب حجز جديد</Heading>

          <Text style={alertText}>
            لقد استلمت طلب حجز جديد لـ Nice Quad Marrakech
          </Text>

          <Section style={bookingBox}>
            <Heading as="h2" style={h2}>معلومات الحجز</Heading>

            <Text style={bookingDetail}>
              <strong>رقم المرجع:</strong> {bookingReference}
            </Text>

            <Hr style={hr} />

            <Text style={bookingDetail}>
              <strong>المركبة:</strong> {vehicleBrand} {vehicleModel}
            </Text>

            <Text style={bookingDetail}>
              <strong>الفئة:</strong> {category}
            </Text>

            <Text style={bookingDetail}>
              <strong>التاريخ:</strong> {date}
            </Text>

            <Text style={bookingDetail}>
              <strong>الوقت:</strong> {time}
            </Text>

            <Text style={bookingDetail}>
              <strong>المدة:</strong> {duration}
            </Text>

            <Text style={bookingDetail}>
              <strong>عدد {category === 'QUAD' ? 'الكوادات (QUAD)' : category === 'BUGGY' ? 'الباغيات (BUGGY)' : 'الدراجات (MOTO CROSS)'}:</strong> {numberOfVehicles}
            </Text>

            {category === 'QUAD' && numberOfPeople > numberOfVehicles && (
              <Text style={bookingDetail}>
                <strong>إجمالي عدد الأشخاص:</strong> {numberOfPeople} ({numberOfPeople - numberOfVehicles} راكب {numberOfPeople - numberOfVehicles > 1 ? 'إضافيين' : 'إضافي'})
              </Text>
            )}

            <Text style={bookingDetail}>
              <strong>السعر الإجمالي:</strong> {price}
            </Text>
          </Section>

          <Section style={customerBox}>
            <Heading as="h2" style={h2}>تفاصيل العميل</Heading>

            <Text style={bookingDetail}>
              <strong>الاسم:</strong> {customerName}
            </Text>

            <Text style={bookingDetail}>
              <strong>البريد الإلكتروني:</strong> <a href={`mailto:${customerEmail}`} style={link}>{customerEmail}</a>
            </Text>

            <Text style={bookingDetail}>
              <strong>رقم الهاتف:</strong> <a href={`tel:${customerPhone}`} style={link}>{customerPhone}</a>
            </Text>
          </Section>

          <Section style={actionBox}>
            <Heading as="h3" style={h3}>الخطوات التالية</Heading>

            <Text style={text}>
              ✓ الاتصال بالعميل لتأكيد التوفر
            </Text>
            <Text style={text}>
              ✓ التحقق من تفاصيل الدفع
            </Text>
            <Text style={text}>
              ✓ تجهيز المركبة ومعدات السلامة
            </Text>
            <Text style={text}>
              ✓ إرسال التأكيد النهائي للعميل
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              <strong>Nice Quad Marrakech - لوحة الإدارة</strong>
            </Text>
            <Text style={footerText}>
              هذا إشعار تلقائي. يرجى الرد بسرعة لضمان خدمة عملاء ممتازة.
            </Text>
          </Section>
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
  direction: 'rtl' as const,
};

const container = {
  backgroundColor: '#ffffff',
  margin: '20px auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
  direction: 'rtl' as const,
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
  textAlign: 'right' as const,
};

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
  textAlign: 'right' as const,
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 12px',
  textAlign: 'right' as const,
};

const alertText = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const bookingBox = {
  backgroundColor: '#fff7ed',
  border: '2px solid #ea580c',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const customerBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const actionBox = {
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
  textAlign: 'right' as const,
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
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

export default AdminNotificationEmail;
