import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../lib/firebase';
import { ref, update, get } from 'firebase/database';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { generateTimeSlots, SlotMap } from '../lib/slots';
import { Link } from 'react-router-dom';

export default function AdminTimeManagement() {
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<SlotMap>({});
  const [loading, setLoading] = useState(true);
  const [closedDates, setClosedDates] = useState<string[]>([]);

  useEffect(() => {
    fetchTimeSlots();
    fetchClosedDates();
  }, [selectedDate]);

  const fetchTimeSlots = async () => {
    try {
      const timeSlotsRef = ref(database, 'slots');
      const snapshot = await get(timeSlotsRef);
      
      if (!snapshot.exists()) {
        const defaultSlots = generateTimeSlots();
        await update(ref(database), { slots: defaultSlots });
        setTimeSlots(defaultSlots);
      } else {
        setTimeSlots(snapshot.val());
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load time slots');
      setLoading(false);
    }
  };

  const fetchClosedDates = async () => {
    try {
      const closedDatesRef = ref(database, 'closedDates');
      const snapshot = await get(closedDatesRef);
      if (snapshot.exists()) {
        setClosedDates(snapshot.val());
      }
    } catch (error) {
      console.error('Error fetching closed dates:', error);
    }
  };

  const toggleTimeSlot = async (slotKey: string) => {
    try {
      const slot = timeSlots[slotKey];
      if (!slot) return;

      const updates: { [key: string]: any } = {};

      if (!slot.isAvailable) {
        // Enabling a disabled slot - always clear appointment data
        updates[`slots/${slotKey}/isAvailable`] = true;
        updates[`slots/${slotKey}/appointmentId`] = null;
        
        // If there was an appointment, we should also remove it from appointments table
        if (slot.appointmentId && slot.appointmentId !== 'none') {
          // Find and remove the appointment
          const appointmentsRef = ref(database, 'appointments');
          const appointmentsSnapshot = await get(appointmentsRef);
          
          if (appointmentsSnapshot.exists()) {
            const appointments = appointmentsSnapshot.val();
            // Find appointment with matching slot key or appointment ID
            for (const [appointmentId, appointmentData] of Object.entries(appointments)) {
              const appointment = appointmentData as any;
              if (appointment.slotKey === slotKey || appointmentId === slot.appointmentId) {
                updates[`appointments/${appointmentId}`] = null; // Remove appointment
                break;
              }
            }
          }
        }
        
        toast.success('Time slot enabled and appointment data cleared');
      } else {
        // Disabling an available slot
        updates[`slots/${slotKey}/isAvailable`] = false;
        toast.success('Time slot disabled');
      }

      await update(ref(database), updates);
      
      // Update local state immediately
      setTimeSlots(prev => ({
        ...prev,
        [slotKey]: {
          ...prev[slotKey],
          isAvailable: !prev[slotKey].isAvailable,
          appointmentId: !prev[slotKey].isAvailable ? null : prev[slotKey].appointmentId
        }
      }));

      // Refresh data from database to ensure consistency
      setTimeout(() => {
        fetchTimeSlots();
      }, 500);

    } catch (error) {
      console.error('Error updating time slot:', error);
      toast.error('Failed to update time slot');
    }
  };

  const toggleClosedDate = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const newClosedDates = closedDates.includes(dateStr)
        ? closedDates.filter(d => d !== dateStr)
        : [...closedDates, dateStr];
      
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[selectedDate.getDay()];
      const updates: { [key: string]: any } = {};
      
      Object.entries(timeSlots)
        .filter(([key]) => key.startsWith(dayName))
        .forEach(([key]) => {
          updates[`slots/${key}/isAvailable`] = closedDates.includes(dateStr);
        });
      
      updates['closedDates'] = newClosedDates;
      
      await update(ref(database), updates);
      setClosedDates(newClosedDates);
      await fetchTimeSlots();
      
      toast.success(
        closedDates.includes(dateStr)
          ? 'Date reopened successfully'
          : 'Date marked as closed successfully'
      );
    } catch (error) {
      console.error('Error toggling closed date:', error);
      toast.error('Failed to update date status');
    }
  };

  const getDaySlots = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[selectedDate.getDay()];
    
    return Object.entries(timeSlots)
      .filter(([key]) => key.startsWith(dayName))
      .sort(([, a], [, b]) => a.start.localeCompare(b.start));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/admin"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Time Slot Management</h1>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="flex items-center gap-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={toggleClosedDate}
                className={`px-4 py-2 rounded-md ${
                  closedDates.includes(format(selectedDate, 'yyyy-MM-dd'))
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                {closedDates.includes(format(selectedDate, 'yyyy-MM-dd'))
                  ? 'Reopen Date'
                  : 'Close Date'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getDaySlots().map(([key, slot]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border ${
                  slot.isAvailable
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{`${slot.start} - ${slot.end}`}</span>
                  <button
                    onClick={() => toggleTimeSlot(key)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      slot.isAvailable
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    } transition-colors`}
                  >
                    {slot.isAvailable ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {slot.appointmentId && slot.appointmentId !== 'none' 
                    ? `Booked (ID: ${slot.appointmentId})` 
                    : 'No appointment'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Status: {slot.isAvailable ? 'Available' : 'Disabled'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}