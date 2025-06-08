/**
 * EmailParams type for sending appointment status emails via EmailJS.
 * Make sure these fields match your EmailJS template variables.
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
  status_class: string;
  status_text: string;
  email: string;
};