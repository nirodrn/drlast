import emailjs from '@emailjs/browser';
import type { EmailParams } from '../utils/mailParams';

// Your EmailJS credentials
const SERVICE_ID = 'default_service';
const TEMPLATE_ID_CONFIRMATION = 'template_womnvu8';
const TEMPLATE_ID_STATUS = 'template_hggp4x5';
const PUBLIC_KEY = 'SqTfv2C7RLVLSs4BM';

// Initialize EmailJS with your public key
emailjs.init(PUBLIC_KEY);

interface TemplateParams extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  treatment: string;
  status: string;
}

interface StatusTemplateParams extends Record<string, unknown> {
  to_name: string;
  service_type: string;
  treatment: string;
  appointment_date: string;
  appointment_time: string;
  status_class: string;
  status_text: string;
  appointment_id: string;
  email: string; // or to_email, depending on your template
}

// Send initial appointment confirmation email
export const sendAppointmentEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    // Validate email address
    if (!params.to_email || params.to_email.trim() === '') {
      console.error('❌ Cannot send email: Recipient email address is empty');
      return false;
    }

    // Format the template parameters to match your EmailJS template
    const templateParams: TemplateParams = {
      to_email: params.to_email.trim(),
      to_name: params.to_name || 'Valued Client',
      appointment_date: params.appointment_date,
      appointment_time: params.appointment_time,
      service_type: params.service_type.charAt(0).toUpperCase() + params.service_type.slice(1),
      treatment: params.treatment,
      status: params.status ? params.status.charAt(0).toUpperCase() + params.status.slice(1) : 'Pending',
      reply_to: params.to_email.trim(), // <-- add this line if your template uses {{reply_to}}
    };

    console.log('📩 Sending appointment confirmation email with params:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID_CONFIRMATION, 
      templateParams as Record<string, unknown>,
      PUBLIC_KEY
    );

    if (response.status === 200) {
      console.log('✅ Confirmation email sent successfully:', response.status, response.text);
      return true;
    } else {
      console.error('❌ Email sending failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return false;
  }
};

// Send appointment status update email (approved/rejected)
export const sendAppointmentStatusEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    if (!params.to_email || params.to_email.trim() === '') {
      console.error('❌ Cannot send email: Recipient email address is empty');
      return false;
    }

    const status = params.status?.toLowerCase() || 'pending';
    const isConfirmed = status === 'approved';
    const isRejected = status === 'rejected';

    const templateParams: StatusTemplateParams = {
      to_name: params.to_name || 'Valued Client',
      service_type: params.service_type.charAt(0).toUpperCase() + params.service_type.slice(1),
      treatment: params.treatment,
      appointment_date: params.appointment_date,
      appointment_time: params.appointment_time,
      status_class: isConfirmed ? 'confirmed' : isRejected ? 'rejected' : 'pending',
      status_text: isConfirmed ? 'CONFIRMED' : isRejected ? 'REJECTED' : 'PENDING',
      appointment_id: params.appointment_id,
      email: params.to_email.trim(), // or to_email, match your template!
    };

    console.log('📩 Sending appointment status email with params:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_STATUS,
      templateParams as Record<string, unknown>,
      PUBLIC_KEY
    );

    if (response.status === 200) {
      console.log('✅ Status email sent successfully:', response.status, response.text);
      return true;
    } else {
      console.error('❌ Status email sending failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to send status email:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
};

// Test function to verify EmailJS setup
export const testEmailJS = async (): Promise<boolean> => {
  try {
    const testParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      appointment_date: '2024-01-15',
      appointment_time: '10:00 AM',
      service_type: 'Cosmetic',
      treatment: 'Test Treatment',
      status: 'Pending',
      appointment_id: 'TEST123',
      status_class: 'pending',
      status_text: 'PENDING',
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

// Test status email function
export const testStatusEmailJS = async (): Promise<boolean> => {
  try {
    const testParams: EmailParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      appointment_date: 'January 15, 2024',
      appointment_time: '10:00 AM',
      service_type: 'Cosmetic',
      treatment: 'Test Treatment',
      status: 'approved',
      appointment_id: 'TEST123',
      status_class: 'confirmed', // Add this
      status_text: 'CONFIRMED',  // Add this
      email: 'test@example.com', // Add this
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