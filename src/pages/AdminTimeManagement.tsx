import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../lib/firebase';
import { ref, update, get, remove } from 'firebase/database';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Save, Calendar,  Settings, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimeSlot {
  id: string;
  day: string;
  start: string;
  end: string;
  isAvailable: boolean;
  appointmentId: string | null;
}

interface WeeklySchedule {
  [day: string]: {
    isOpen: boolean;
    slots: Array<{ start: string; end: string }>;
  };
}

export default function AdminTimeManagement() {
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<{ [key: string]: TimeSlot }>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  
  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    monday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
    thursday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
    friday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
    saturday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
    sunday: { isOpen: false, slots: [] },
  });

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTimeSlots(),
        fetchClosedDates(),
        fetchWeeklySchedule()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const timeSlotsRef = ref(database, 'slots');
      const snapshot = await get(timeSlotsRef);
      
      if (snapshot.exists()) {
        setTimeSlots(snapshot.val());
      } else {
        // Initialize with default slots
        await generateDefaultSlots();
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  };

  const fetchClosedDates = async () => {
    try {
      const closedDatesRef = ref(database, 'closedDates');
      const snapshot = await get(closedDatesRef);
      if (snapshot.exists()) {
        setClosedDates(snapshot.val() || []);
      }
    } catch (error) {
      console.error('Error fetching closed dates:', error);
    }
  };

  const fetchWeeklySchedule = async () => {
    try {
      const weeklyRef = ref(database, 'weeklySchedule');
      const snapshot = await get(weeklyRef);
      if (snapshot.exists()) {
        setWeeklySchedule(snapshot.val());
      }
    } catch (error) {
      console.error('Error fetching weekly schedule:', error);
    }
  };

  const generateDefaultSlots = async () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const slots: { [key: string]: TimeSlot } = {};
    
    days.forEach(day => {
      for (let hour = 9; hour < 17; hour++) {
        const start = `${hour.toString().padStart(2, '0')}:00`;
        const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
        const slotKey = `${day}_${start.replace(':', '')}`;
        
        slots[slotKey] = {
          id: slotKey,
          day,
          start,
          end,
          isAvailable: true,
          appointmentId: null
        };
      }
    });

    await update(ref(database, 'slots'), slots);
    setTimeSlots(slots);
  };

  const toggleTimeSlot = async (slotKey: string) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      const slot = timeSlots[slotKey];
      if (!slot) return;

      const newAvailability = !slot.isAvailable;
      const updates: { [key: string]: any } = {};

      // Update slot availability
      updates[`slots/${slotKey}/isAvailable`] = newAvailability;
      
      if (newAvailability) {
        // Enabling slot - clear appointment data
        updates[`slots/${slotKey}/appointmentId`] = null;
        
        // Remove associated appointment if exists
        if (slot.appointmentId && slot.appointmentId !== 'none') {
          await clearAppointment(slot.appointmentId);
        }
      } else {
        // Disabling slot - also clear appointment data
        updates[`slots/${slotKey}/appointmentId`] = null;
        
        if (slot.appointmentId && slot.appointmentId !== 'none') {
          await clearAppointment(slot.appointmentId);
        }
      }

      // Update Firebase
      await update(ref(database), updates);
      
      // Update local state immediately
      setTimeSlots(prev => ({
        ...prev,
        [slotKey]: {
          ...prev[slotKey],
          isAvailable: newAvailability,
          appointmentId: null
        }
      }));

      toast.success(newAvailability ? 'Slot enabled' : 'Slot disabled');
    } catch (error) {
      console.error('Error updating time slot:', error);
      toast.error('Failed to update slot');
    } finally {
      setUpdating(false);
    }
  };

  const clearAppointment = async (appointmentId: string) => {
    try {
      const appointmentsRef = ref(database, 'appointments');
      const snapshot = await get(appointmentsRef);
      
      if (snapshot.exists()) {
        const appointments = snapshot.val();
        for (const [id, appointmentData] of Object.entries(appointments)) {
          const appointment = appointmentData as any;
          if (id === appointmentId || appointment.slotKey?.includes(appointmentId)) {
            await remove(ref(database, `appointments/${id}`));
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error clearing appointment:', error);
    }
  };

  const toggleDateStatus = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const isCurrentlyClosed = closedDates.includes(dateStr);
      
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[selectedDate.getDay()];
      
      const updates: { [key: string]: any } = {};
      
      // Get all slots for this day
      const daySlots = Object.entries(timeSlots).filter(([key]) => key.startsWith(dayName));
      
      if (isCurrentlyClosed) {
        // Reopening date
        const newClosedDates = closedDates.filter(d => d !== dateStr);
        updates['closedDates'] = newClosedDates;
        
        // Enable all slots for this day and clear appointments
        daySlots.forEach(([key]) => {
          updates[`slots/${key}/isAvailable`] = true;
          updates[`slots/${key}/appointmentId`] = null;
        });
        
        setClosedDates(newClosedDates);
      } else {
        // Closing date
        const newClosedDates = [...closedDates, dateStr];
        updates['closedDates'] = newClosedDates;
        
        // Disable all slots for this day and clear appointments
        daySlots.forEach(([key]) => {
          updates[`slots/${key}/isAvailable`] = false;
          updates[`slots/${key}/appointmentId`] = null;
        });
        
        setClosedDates(newClosedDates);
      }
      
      // Clear all appointments for this date
      await clearAppointmentsForDate(dateStr);
      
      // Update Firebase
      await update(ref(database), updates);
      
      // Update local state
      const updatedSlots = { ...timeSlots };
      daySlots.forEach(([key]) => {
        updatedSlots[key] = {
          ...updatedSlots[key],
          isAvailable: isCurrentlyClosed,
          appointmentId: null
        };
      });
      setTimeSlots(updatedSlots);
      
      toast.success(isCurrentlyClosed ? 'Date reopened' : 'Date closed');
    } catch (error) {
      console.error('Error toggling date status:', error);
      toast.error('Failed to update date status');
    } finally {
      setUpdating(false);
    }
  };

  const clearAppointmentsForDate = async (dateStr: string) => {
    try {
      const appointmentsRef = ref(database, 'appointments');
      const snapshot = await get(appointmentsRef);
      
      if (snapshot.exists()) {
        const appointments = snapshot.val();
        const updates: { [key: string]: any } = {};
        
        for (const [id, appointmentData] of Object.entries(appointments)) {
          const appointment = appointmentData as any;
          if (appointment.date === dateStr) {
            updates[`appointments/${id}`] = null;
          }
        }
        
        if (Object.keys(updates).length > 0) {
          await update(ref(database), updates);
        }
      }
    } catch (error) {
      console.error('Error clearing appointments for date:', error);
    }
  };

  const saveWeeklySchedule = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await update(ref(database, 'weeklySchedule'), weeklySchedule);
      toast.success('Weekly schedule saved');
    } catch (error) {
      console.error('Error saving weekly schedule:', error);
      toast.error('Failed to save weekly schedule');
    } finally {
      setUpdating(false);
    }
  };

  const applyWeeklySchedule = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      // Clear existing slots
      await remove(ref(database, 'slots'));
      
      const newSlots: { [key: string]: TimeSlot } = {};
      
      // Generate slots based on weekly schedule
      Object.entries(weeklySchedule).forEach(([day, schedule]) => {
        if (schedule.isOpen && schedule.slots.length > 0) {
          schedule.slots.forEach(({ start, end }) => {
            const startHour = parseInt(start.split(':')[0]);
            const endHour = parseInt(end.split(':')[0]);
            
            for (let hour = startHour; hour < endHour; hour++) {
              const slotStart = `${hour.toString().padStart(2, '0')}:00`;
              const slotEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
              const slotKey = `${day}_${slotStart.replace(':', '')}`;
              
              newSlots[slotKey] = {
                id: slotKey,
                day,
                start: slotStart,
                end: slotEnd,
                isAvailable: true,
                appointmentId: null
              };
            }
          });
        }
      });
      
      await update(ref(database, 'slots'), newSlots);
      setTimeSlots(newSlots);
      
      toast.success('Weekly schedule applied to all slots');
    } catch (error) {
      console.error('Error applying weekly schedule:', error);
      toast.error('Failed to apply weekly schedule');
    } finally {
      setUpdating(false);
    }
  };

  const refreshData = async () => {
    await loadData();
    toast.success('Data refreshed');
  };

  const getDaySlots = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[selectedDate.getDay()];
    
    return Object.entries(timeSlots)
      .filter(([key]) => key.startsWith(dayName))
      .sort(([, a], [, b]) => a.start.localeCompare(b.start));
  };

  const updateWeeklySchedule = (day: string, field: 'isOpen', value: boolean) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const updateSlotTime = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const addSlot = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }));
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
            <div className="flex items-center gap-4">
              <button
                onClick={refreshData}
                disabled={updating}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Time Slot Management</h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('daily')}
              className={`pb-2 px-1 ${
                activeTab === 'daily'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Daily Management
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`pb-2 px-1 ${
                activeTab === 'weekly'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Weekly Schedule
            </button>
          </div>

          {/* Daily Management Tab */}
          {activeTab === 'daily' && (
            <div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="flex items-center gap-4">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setSelectedDate(date);
                      }
                    }}
                    dateFormat="MMMM d, yyyy"
                    className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  />
                  <button
                    onClick={toggleDateStatus}
                    disabled={updating}
                    className={`px-4 py-2 rounded-md font-medium ${
                      closedDates.includes(format(selectedDate, 'yyyy-MM-dd'))
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    } transition-colors disabled:opacity-50`}
                  >
                    {updating ? 'Updating...' : 
                     closedDates.includes(format(selectedDate, 'yyyy-MM-dd'))
                      ? 'Open Date'
                      : 'Close Date'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getDaySlots().map(([key, slot]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      slot.isAvailable
                        ? 'border-green-300 bg-green-50 hover:bg-green-100'
                        : 'border-red-300 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">{`${slot.start} - ${slot.end}`}</span>
                      <button
                        onClick={() => toggleTimeSlot(key)}
                        disabled={updating}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          slot.isAvailable
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        } disabled:opacity-50`}
                      >
                        {updating ? '...' : slot.isAvailable ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className={`font-medium ${slot.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                        {slot.isAvailable ? 'Available' : 'Disabled'}
                      </div>
                      {slot.appointmentId && slot.appointmentId !== 'none' && (
                        <div className="text-orange-600">
                          Has Appointment
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {getDaySlots().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No time slots available for this day
                </div>
              )}
            </div>
          )}

          {/* Weekly Schedule Tab */}
          {activeTab === 'weekly' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Weekly Schedule Configuration</h3>
                <div className="space-x-2">
                  <button
                    onClick={saveWeeklySchedule}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    {updating ? 'Saving...' : 'Save Schedule'}
                  </button>
                  <button
                    onClick={applyWeeklySchedule}
                    disabled={updating}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating ? 'Applying...' : 'Apply to All Slots'}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(weeklySchedule).map(([day, schedule]) => (
                  <div key={day} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium capitalize">{day}</h4>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={schedule.isOpen}
                          onChange={(e) => updateWeeklySchedule(day, 'isOpen', e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm font-medium">Open</span>
                      </label>
                    </div>

                    {schedule.isOpen && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Operating Hours</span>
                          <button
                            onClick={() => addSlot(day)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            <Plus className="w-3 h-3 inline mr-1" />
                            Add Hours
                          </button>
                        </div>
                        <div className="space-y-2">
                          {schedule.slots.map((slot, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white p-2 rounded">
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateSlotTime(day, index, 'start', e.target.value)}
                                className="text-sm border rounded px-2 py-1"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateSlotTime(day, index, 'end', e.target.value)}
                                className="text-sm border rounded px-2 py-1"
                              />
                              {schedule.slots.length > 1 && (
                                <button
                                  onClick={() => removeSlot(day, index)}
                                  className="p-1 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}