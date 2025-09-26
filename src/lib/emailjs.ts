import emailjs from '@emailjs/browser';
import type { EmailParams, EmailTemplateParams } from '../utils/mailParams';

const SERVICE_ID = 'service_29ip80n';
const TEMPLATE_ID = 'template_3a39nbe';
const PUBLIC_KEY = 'JtXIp1pxKVNmFLBe2';

// Initialize EmailJS with your public key
emailjs.init(PUBLIC_KEY);

// Convert status to standardized format for template
const normalizeStatus = (status: string): 'CONFIRMED' | 'PENDING' | 'Unfortunately No Available slots as per your preference' => {
  const s = status?.toLowerCase();
  if (s === 'approved' || s === 'confirmed') return 'CONFIRMED';
  if (s === 'pending') return 'PENDING';
  if (s === 'rejected') return 'Unfortunately No Available slots as per your preference';
  return 'PENDING';
};

// Get color code for the status
const getStatusColor = (status_text: string) => {
  if (status_text === 'CONFIRMED') return '#007B82';
  if (status_text === 'PENDING') return '#FFA500';
  if (status_text === 'Unfortunately No Available slots as per your preference') return '#DC3545';
  return '#333333';
};

// Generate a message body for the appointment email
const generateMessageBody = (
  status: string,
  appointmentDate: string,
  appointmentTime: string
): string => {
  const normalized = normalizeStatus(status);
  if (normalized === 'CONFIRMED')
    return `Your appointment is confirmed for ${appointmentDate} at ${appointmentTime}. Please arrive 5 minutes early.`;
  if (status.toLowerCase() === 'rejected')
    return `We regret to inform you that, unfortunately, there are no available slots that align with your preferred schedule. However, we would be more than happy to assist you in finding a suitable time. Please feel free to select another day that works best for you, and we’ll ensure your appointment is confirmed. Thank you for your understanding.`;
  return `Your appointment request has been received and is pending confirmation. We will notify you once it is approved.`;
};

// Main function to send appointment email
export const sendAppointmentEmail = async (params: EmailParams): Promise<boolean> => {
  // Validate all required fields
  const requiredFields = [
    'to_email', 'to_name', 'appointment_id', 'appointment_date', 'appointment_time',
    'service_type', 'treatment', 'status', 'email'
  ];
  for (const field of requiredFields) {
    if (!params[field as keyof EmailParams]) {
      console.error(`Missing required email param: ${field}`);
      return false;
    }
  }

  const status_text = normalizeStatus(params.status);
  const status_color = getStatusColor(status_text);
  const messageBody = generateMessageBody(
    params.status,
    params.appointment_date,
    params.appointment_time
  );

  const templateParams: EmailTemplateParams = {
    to_email: params.to_email,
    to_name: params.to_name,
    appointment_id: params.appointment_id,
    appointment_date: params.appointment_date,
    appointment_time: params.appointment_time,
    service_type: params.service_type,
    treatment: params.treatment,
    status_text,
    status_color,
    message_body: messageBody,
    action_url: params.action_url || 'https://drdanielesthetix.com/profile',
    email: params.email, // For Reply-To
  };

  // Optional: check for undefined/null/empty in templateParams
  for (const [key, value] of Object.entries(templateParams)) {
    if (typeof value === 'undefined' || value === null || value === '') {
      if (key !== 'action_url') { // action_url is optional
        console.error(`EmailJS param "${key}" is missing or empty`);
        return false;
      }
    }
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    return true;
  } catch (err) {
    console.error('EmailJS send error:', err);
    return false;
  }
};

export const sendAppointmentStatusEmail = sendAppointmentEmail;

// Test function to verify EmailJS setup
export const testEmailJS = async (): Promise<boolean> => {
  try {
    const testParams: EmailParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      appointment_date: 'January 15, 2025',
      appointment_time: '10:00 AM',
      service_type: 'Cosmetic',
      treatment: 'Test Treatment',
      status: 'pending',
      appointment_id: 'TEST123',
      email: 'test@example.com',
    };

    console.log('🧪 Testing EmailJS configuration...');
    const result = await sendAppointmentEmail(testParams);
    
    if (result) {
      console.log('✅ EmailJS test successful');
    } else {
      console.log('❌ EmailJS test failed');
    }
    
    return result;
  } catch (error) {
    console.error('❌ EmailJS test error:', error);
    return false;
  }
};

// Test status email function (now uses the same template)
export const testStatusEmailJS = async (): Promise<boolean> => {
  try {
    const testParams: EmailParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      appointment_date: 'January 15, 2025',
      appointment_time: '10:00 AM',
      service_type: 'Cosmetic',
      treatment: 'Test Treatment',
      status: 'approved',
      appointment_id: 'TEST123',
      email: 'test@example.com',
    };

    console.log('🧪 Testing Status EmailJS configuration...');
    const result = await sendAppointmentStatusEmail(testParams);
    
    if (result) {
      console.log('✅ Status EmailJS test successful');
    } else {
      console.log('❌ Status EmailJS test failed');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Status EmailJS test error:', error);
    return false;
  }
};