 import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../lib/firebase';
import { ref, get, update, remove } from 'firebase/database';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Phone, Mail, Check, X, Settings, Trash2, CalendarDays } from 'lucide-react';
import { sendAppointmentStatusEmail } from '../lib/emailjs';

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
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'past'>('pending');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'treatment' | 'patient'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [batchAction, setBatchAction] = useState<{
    type: 'approve' | 'reject' | 'delete' | null;
    isConfirming: boolean;
  }>({ type: null, isConfirming: false });

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

  const handleBatchAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedAppointments.length === 0) return;
    
    setBatchAction({ type: action, isConfirming: true });
  };

  const confirmBatchAction = async () => {
    const action = batchAction.type;
    if (!action) return;

    try {
      const updates: { [key: string]: any } = {};
      let successCount = 0;

      for (const appointmentId of selectedAppointments) {
        const appointment = appointments.find(apt => apt.id === appointmentId);
        if (!appointment) continue;

        if (action === 'delete') {
          updates[`appointments/${appointmentId}`] = null;
        } else {
          const newStatus = action === 'approve' ? 'approved' : 'rejected';
          updates[`appointments/${appointmentId}/status`] = newStatus;

          if (action === 'reject' && appointment.slotKey) {
            updates[`slots/${appointment.slotKey}/isAvailable`] = true;
            updates[`slots/${appointment.slotKey}/appointmentId`] = null;
          }

          // Send email for each appointment
          try {
            await sendAppointmentStatusEmail({
              to_email: appointment.userDetails.email,
              to_name: appointment.userDetails.name,
              appointment_date: format(parseISO(appointment.date), 'MMMM d, yyyy'),
              appointment_time: appointment.time,
              service_type: appointment.serviceType,
              treatment: appointment.treatment,
              status: newStatus,
              appointment_id: appointmentId,
              email: appointment.userDetails.email,
              action_url: 'https://drdanielesthetix.com/profile',
            });
            successCount++;
          } catch (emailError) {
            console.error('Failed to send status email:', emailError);
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
        toast.success(`Successfully ${action}ed ${successCount} appointments`);
      }

      // Reset states
      setSelectedAppointments([]);
      setBatchAction({ type: null, isConfirming: false });
      fetchAppointments();
    } catch (error) {
      console.error(`Error in batch ${action}:`, error);
      toast.error(`Failed to ${action} appointments`);
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

        // Send status update email using new template and params
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
            email: appointment.userDetails.email, // <-- Required for Reply-To and template
            action_url: 'https://drdanielesthetix.com/profile', // <-- Updated link
          });

          if (emailSent) {
            toast.success(`Appointment ${action}d successfully! Status email sent.`);
          } else {
            toast.success(`Appointment ${action}d successfully!`);
            console.warn('Failed to send status email, but appointment was updated');
          }
        } catch (emailError) {
          console.error('Status email sending failed:', emailError);
          toast.success(`Appointment ${action}d successfully!`);
        }
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

  const getSortValue = (appointment: Appointment, key: 'date' | 'time' | 'treatment' | 'patient') => {
    switch (key) {
      case 'date':
        return appointment.date;
      case 'time':
        return appointment.time;
      case 'treatment':
        return appointment.treatment.toLowerCase();
      case 'patient':
        return appointment.userDetails.name.toLowerCase();
      default:
        return '';
    }
  };

  const isPastDate = (dateStr: string) => {
    const appointmentDate = new Date(dateStr);
    appointmentDate.setHours(23, 59, 59, 999); // End of the day
    return appointmentDate < new Date();
  };

  const filteredAppointments = appointments
    .filter(apt => {
      let matchesTab = false;
      const isPast = isPastDate(apt.date);

      if (activeTab === 'pending') {
        matchesTab = apt.status === 'pending' && !isPast;
      } else if (activeTab === 'approved') {
        matchesTab = apt.status === 'approved';
      } else if (activeTab === 'past') {
        matchesTab = isPast && (apt.status === 'pending' || !apt.status);
      }

      if (!searchQuery) return matchesTab;
      
      const query = searchQuery.toLowerCase();
      return matchesTab && (
        apt.treatment.toLowerCase().includes(query) ||
        apt.userDetails.name.toLowerCase().includes(query) ||
        apt.userDetails.email.toLowerCase().includes(query) ||
        apt.date.includes(query)
      );
    })
    .sort((a, b) => {
      const aValue = getSortValue(a, sortBy);
      const bValue = getSortValue(b, sortBy);
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Batch Action Confirmation Modal */}
        {batchAction.isConfirming && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {batchAction.type === 'delete' ? 'Delete' : batchAction.type === 'reject' && activeTab === 'past' ? 'Mark as No-Show' : batchAction.type === 'approve' ? 'Approve' : 'Reject'} Multiple Appointments
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {batchAction.type === 'reject' && activeTab === 'past' ? 'mark' : batchAction.type} {selectedAppointments.length} appointment{selectedAppointments.length !== 1 ? 's' : ''} 
                {batchAction.type === 'reject' && activeTab === 'past' ? ' as no-show' : ''}?
                {batchAction.type === 'delete' && ' This action cannot be undone.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setBatchAction({ type: null, isConfirming: false })}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBatchAction}
                  className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                    batchAction.type === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : batchAction.type === 'reject'
                      ? activeTab === 'past'
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {batchAction.type === 'delete' ? 'Yes, Delete' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-500">Manage your appointments and schedule</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/calendar"
                  className="inline-flex items-center px-5 py-2.5 border-2 border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Calendar View
                </Link>
                <Link
                  to="/admin/time-management"
                  className="inline-flex items-center px-5 py-2.5 border-2 border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Manage Time Slots
                </Link>
                <a
                  href="https://drdanielesthetixs-admin.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                >
                  Advanced Management
                </a>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === 'pending'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                    }`}
                  >
                    Pending Appointments
                  </button>
                  <button
                    onClick={() => setActiveTab('approved')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === 'approved'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                    }`}
                  >
                    Approved Appointments
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === 'past'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                    }`}
                  >
                    Past Appointments
                  </button>
                </div>

                {selectedAppointments.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">
                      {selectedAppointments.length} appointment{selectedAppointments.length !== 1 ? 's' : ''} selected
                    </span>
                    {(activeTab === 'pending' || activeTab === 'past') && (
                      <>
                        {activeTab === 'pending' && (
                          <button
                            onClick={() => handleBatchAction('approve')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve Selected
                          </button>
                        )}
                        <button
                          onClick={() => handleBatchAction('reject')}
                          className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
                            activeTab === 'past'
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          <X className="h-4 w-4 mr-2" />
                          {activeTab === 'past' ? 'Mark Selected as No-Show' : 'Reject Selected'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleBatchAction('delete')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-[1fr,auto] gap-4 items-center bg-white p-4 rounded-lg border border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by patient name, treatment, or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'time' | 'treatment' | 'patient')}
                    className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all duration-200"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="time">Sort by Time</option>
                    <option value="treatment">Sort by Treatment</option>
                    <option value="patient">Sort by Patient Name</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(current => current === 'asc' ? 'desc' : 'asc')}
                    className="p-3 rounded-lg border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200"
                    title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} appointments</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {activeTab === 'pending' 
                    ? 'There are no pending appointments that require your attention.'
                    : activeTab === 'approved'
                    ? 'There are no approved appointments to display.'
                    : 'There are no past appointments that need attention.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedAppointments.includes(appointment.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAppointments(prev => [...prev, appointment.id]);
                            } else {
                              setSelectedAppointments(prev => prev.filter(id => id !== appointment.id));
                            }
                          }}
                          className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg transition-colors duration-200 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <User className="h-5 w-5 text-primary-600" />
                          <h3 className="font-semibold text-lg text-gray-900">{appointment.userDetails.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(appointment.date)}
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700 break-all">{appointment.userDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">{appointment.userDetails.phone}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-primary-50 rounded-lg">
                        <h4 className="font-medium text-primary-900 mb-2">Treatment Details</h4>
                        <div className="text-primary-800">{appointment.treatment}</div>
                        <div className="text-sm text-primary-600 mt-1">{appointment.serviceType}</div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      {(activeTab === 'pending' || activeTab === 'past') && (
                        <>
                          {activeTab === 'pending' && (
                            <button
                              onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                              className="inline-flex items-center px-5 py-2.5 border-2 border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleAppointmentAction(appointment.id, 'reject')}
                            className={`inline-flex items-center px-5 py-2.5 border-2 border-transparent rounded-lg text-sm font-medium text-white ${
                              activeTab === 'past' 
                                ? 'bg-orange-600 hover:bg-orange-700'
                                : 'bg-red-600 hover:bg-red-700'
                            } transition-colors duration-200`}
                          >
                            <X className="h-4 w-4 mr-2" />
                            {activeTab === 'past' ? 'Mark as No-Show' : 'Reject'}
                          </button>
                        </>
                      )}
                      {deleteConfirm === appointment.id ? (
                        <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                          <span className="text-sm font-medium text-red-700">Confirm deletion?</span>
                          <button
                            onClick={() => handleAppointmentAction(appointment.id, 'delete')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(appointment.id)}
                          className="inline-flex items-center px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
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