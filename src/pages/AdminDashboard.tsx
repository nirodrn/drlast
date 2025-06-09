import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../lib/firebase';
import { ref, get, update, remove } from 'firebase/database';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Phone, Mail, Check, X, Settings, Trash2, CalendarDays } from 'lucide-react';
// Temporarily disabled email sending
// import { sendAppointmentStatusEmail } from '../lib/emailjs';
// import type { EmailParams } from '../utils/mailParams';

interface Appointment {
  id: string;
  userId: string;
  serviceType: string;
  treatment: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  slotKey?: string;
}

export default function AdminDashboard() {
  useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = ref(database, 'appointments');
      const snapshot = await get(appointmentsRef);
      
      if (snapshot.exists()) {
        const appointmentsData = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...(data as Omit<Appointment, 'id'>)
        }));
        setAppointments(appointmentsData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) return;

      if (action === 'delete') {
        await remove(ref(database, `appointments/${appointmentId}`));
        toast.success('Appointment deleted successfully');
      } else {
        const updates: { [key: string]: any } = {};
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        updates[`appointments/${appointmentId}/status`] = newStatus;
        
        if (action === 'reject' && appointment.slotKey) {
          updates[`slots/${appointment.slotKey}/isAvailable`] = true;
          updates[`slots/${appointment.slotKey}/appointmentId`] = null;
        }

        await update(ref(database), updates);

        // Email sending temporarily disabled
        /*
        try {
          const emailSent = await sendAppointmentStatusEmail({
            to_email: appointment.userDetails.email,
            to_name: appointment.userDetails.name,
            appointment_date: format(parseISO(appointment.date), 'MMMM d, yyyy'),
            appointment_time: appointment.time,
            service_type: appointment.serviceType,
            treatment: appointment.treatment,
            status: newStatus,
            appointment_id: appointmentId,
            status_class: newStatus === 'approved' ? 'confirmed' : 'rejected',
            status_text: newStatus === 'approved' ? 'CONFIRMED' : 'REJECTED',
            email: appointment.userDetails.email,
          });

          if (emailSent) {
            toast.success(`Appointment ${action}d successfully! Status email sent.`);
          } else {
            toast.error(`Appointment ${action}d, but failed to send status email.`);
          }
        } catch (emailError) {
          console.error('Status email sending failed:', emailError);
          toast.error(`Appointment ${action}d, but failed to send status email.`);
        }
        */
        
        toast.success(`Appointment ${action}d successfully!`);
      }
      
      fetchAppointments();
      setDeleteConfirm(null);
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Failed to ${action} appointment`);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not Available';
    
    try {
      const date = parseISO(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return format(new Date(dateString), 'MMMM d, yyyy');
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    activeTab === 'pending' ? apt.status === 'pending' : apt.status === 'approved'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex space-x-4">
                <Link
                  to="/admin/calendar"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Calendar View
                </Link>
                <Link
                  to="/admin/time-management"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Time Slots
                </Link>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'pending'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending Appointments
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'approved'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved Appointments
              </button>
            </div>
          </div>

          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No {activeTab} appointments found.
              </p>
            ) : (
              <div className="space-y-6">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">{appointment.userDetails.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="">{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="">{appointment.time}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span>{appointment.userDetails.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span>{appointment.userDetails.phone}</span>
                        </div>
                        <div>
                          <span className="font-medium">Treatment: </span>
                          <span>{appointment.treatment}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAppointmentAction(appointment.id, 'reject')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                        </>
                      )}
                      {deleteConfirm === appointment.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Are you sure?</span>
                          <button
                            onClick={() => handleAppointmentAction(appointment.id, 'delete')}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(appointment.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}