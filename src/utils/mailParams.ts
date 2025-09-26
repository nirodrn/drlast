/**
 * EmailParams type for sending appointment emails via EmailJS.
 * Updated to work with the new unified template.
 */
export type EmailParams = {
  to_email: string;
  to_name: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  treatment: string;
  status: string;
  appointment_id: string;
  email: string;
  action_url?: string;
};

/**
 * Extended template params that match the EmailJS template exactly
 */
export type EmailTemplateParams = {
  to_email: string;
  to_name: string;
  appointment_id: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  treatment: string;
  status_text: 'CONFIRMED' | 'PENDING' | 'Unfortunately No Available slots as per your preference';
  status_color: string;
  message_body: string;
  action_url?: string;
  email: string;
};