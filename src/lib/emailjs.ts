import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_xcux8h9';
const TEMPLATE_ID = 'template_womnvu8';
const PUBLIC_KEY = 'SqTfv2C7RLVLSs4BM';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

interface EmailParams {
  to_email: string;
  to_name: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  treatment: string;
  status?: string;
}

interface TemplateParams extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  treatment: string;
  status: string;
}

export const sendAppointmentEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    // Validate email address
    if (!params.to_email || params.to_email.trim() === '') {
      console.error('❌ Cannot send email: Recipient email address is empty');
      return false;
    }

    const templateParams: TemplateParams = {
      to_email: params.to_email.trim(),
      to_name: params.to_name,
      appointment_date: params.appointment_date,
      appointment_time: params.appointment_time,
      service_type: params.service_type.charAt(0).toUpperCase() + params.service_type.slice(1),
      treatment: params.treatment,
      status: params.status ? params.status.charAt(0).toUpperCase() + params.status.slice(1) : 'Pending',
    };

    console.log('📩 Sending email with params:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      templateParams as Record<string, unknown>,
      PUBLIC_KEY
    );

    console.log('✅ Email sent successfully:', response.status);

    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};