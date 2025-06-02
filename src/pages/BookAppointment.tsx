import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { database } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import toast from 'react-hot-toast';
import { getAvailableSlots, bookSlot } from '../lib/slots';
import { v4 as uuidv4 } from 'uuid';
import { Loader } from 'lucide-react';
import type { TimeSlot } from '../lib/slots';

interface Treatment {
  name: string;
  pageName: string;
}

export default function BookAppointment() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Record<string, TimeSlot>>({});
  // const [closedDates, setClosedDates] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const treatmentsRef = ref(database, 'treatmentscato');
        const snapshot = await get(treatmentsRef);
        if (snapshot.exists()) {
          const treatmentsData = Object.values(snapshot.val()) as Treatment[];
          setTreatments(treatmentsData.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error('Error fetching treatments:', error);
        toast.error('Failed to load treatments');
      }
    };

    fetchTreatments();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!currentUser) return;

      try {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserDetails(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to load user details');
      }
    };

    fetchUserDetails();
  }, [currentUser]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;
      
      setLoadingSlots(true);
      try {
        await getAvailableSlots() as Promise<Record<string, TimeSlot>>;
        const slots = await getAvailableSlots() as Record<string, TimeSlot>;
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        toast.error('Failed to load available time slots');
      } finally {
        setLoadingSlots(false);
      }
    };

    // Removed fetchClosedDates and its usage since closedDates is not used

    fetchAvailableSlots();
  }, [selectedDate]);

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !availableSlots) return [];

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = days[selectedDate.getDay()];
    
    return Object.entries(availableSlots)
      .filter(([key, slot]) => {
        return key.startsWith(day) && slot.isAvailable && !slot.appointmentId;
      })
      .map(([_, slot]) => slot.start)
      .sort();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please log in to book an appointment');
      navigate('/login');
      return;
    }

    if (!selectedTreatment || !selectedDate || !selectedTime || !userDetails) {
      toast.error('Please fill in all fields');
      return;
    }

    setProcessing(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const appointmentId = uuidv4();
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[selectedDate.getDay()];
      const slotKey = `${dayName}_${selectedTime.replace(':', '')}`;
      
      await bookSlot(slotKey, appointmentId);
      
      const success = await createAppointment({
        userId: currentUser.uid,
        serviceType: 'cosmetic',
        treatment: selectedTreatment,
        date: formattedDate,
        time: selectedTime,
        status: 'pending',
        userDetails,
        slotKey
      });

      if (success) {
        toast.success('Appointment booked successfully');
        navigate('/profile');
      } else {
        toast.error('Failed to create appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error during booking process:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to book appointment. Please try again.');
      }
      setSelectedTime('');
    } finally {
      setProcessing(false);
    }
  };

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Treatment
              </label>
              <select
                value={selectedTreatment}
                onChange={(e) => setSelectedTreatment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Choose a treatment</option>
                {treatments.map((treatment) => (
                  <option key={treatment.pageName} value={treatment.name}>
                    {treatment.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                maxDate={addDays(new Date(), 30)}
                dateFormat="MMMM d, yyyy"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholderText="Select a date"
                required
                filterDate={(date) => {
                  const dayIndex = date.getDay();
                  return dayIndex !== 0 && !isBefore(date, startOfToday());
                }}
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader className="w-6 h-6 text-primary-600 animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading available times...</span>
                  </div>
                ) : availableTimeSlots.length === 0 ? (
                  <div className="text-center py-4 bg-yellow-50 rounded-md">
                    <p className="text-yellow-800">All time slots are already booked for this date.</p>
                    <p className="text-sm text-yellow-600 mt-1">Please select a different date.</p>
                  </div>
                ) : (
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">Choose a time</option>
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {!userDetails && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Profile Information Required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Please complete your profile information before booking an appointment.
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="ml-2 font-medium text-yellow-800 underline"
                        >
                          Update Profile
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={processing || !userDetails || loadingSlots || availableTimeSlots.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};;