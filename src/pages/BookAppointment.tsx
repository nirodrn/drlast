import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, isBefore, startOfToday, addHours, isAfter } from 'date-fns';
import { database } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import toast from 'react-hot-toast';
import { getAvailableSlots, bookSlot } from '../lib/slots';
import { v4 as uuidv4 } from 'uuid';
import { Loader, AlertCircle, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
// Temporarily disabled email sending
// import { sendAppointmentEmail } from '../lib/emailjs';
import type { TimeSlot } from '../lib/slots';

interface Treatment {
  name: string;
  pageName: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

export default function BookAppointment() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Record<string, TimeSlot>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      toast.error('Please log in to book an appointment');
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

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
        setLoadingProfile(true);
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const profile: UserProfile = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            dateOfBirth: data.dateOfBirth || '',
          };
          
          setUserDetails(profile);
          
          // Check if profile is complete
          const isComplete = profile.name && 
                           profile.email && 
                           profile.phone && 
                           profile.address && 
                           profile.dateOfBirth;
          
          setProfileComplete(!!isComplete);
        } else {
          setProfileComplete(false);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to load user details');
        setProfileComplete(false);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserDetails();
  }, [currentUser]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;
      
      setLoadingSlots(true);
      try {
        const slots = await getAvailableSlots() as Record<string, TimeSlot>;
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        toast.error('Failed to load available time slots');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !availableSlots) return [];

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = days[selectedDate.getDay()];
    
    const now = new Date();
    const oneHourFromNow = addHours(now, 1);
    
    return Object.entries(availableSlots)
      .filter(([key, slot]) => {
        if (!key.startsWith(day) || !slot.isAvailable || slot.appointmentId) {
          return false;
        }
        
        // Create a date object for this time slot
        const [hours, minutes] = slot.start.split(':').map(Number);
        const slotDateTime = new Date(selectedDate);
        slotDateTime.setHours(hours, minutes, 0, 0);
        
        // Only show slots that are at least 1 hour from now
        return isAfter(slotDateTime, oneHourFromNow);
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

    if (!profileComplete || !userDetails) {
      toast.error('Please complete your profile before booking an appointment');
      navigate('/profile');
      return;
    }

    if (!selectedTreatment || !selectedDate || !selectedTime) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate appointment time is at least 1 hour from now
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    const oneHourFromNow = addHours(new Date(), 1);

    if (!isAfter(appointmentDateTime, oneHourFromNow)) {
      toast.error('Appointments must be booked at least 1 hour in advance');
      return;
    }

    setProcessing(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const appointmentId = uuidv4();
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[selectedDate.getDay()];
      const slotKey = `${dayName}_${selectedTime.replace(':', '')}`;
      
      // Book the slot first
      await bookSlot(slotKey, appointmentId);
      
      // Create the appointment
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
        // Email sending temporarily disabled
        /*
        try {
          const emailSent = await sendAppointmentEmail({
            to_email: userDetails.email,
            to_name: userDetails.name,
            appointment_date: format(selectedDate, 'MMMM d, yyyy'),
            appointment_time: selectedTime,
            service_type: 'Cosmetic',
            treatment: selectedTreatment,
            status: 'Pending',
            appointment_id: appointmentId,
            status_class: 'pending',
            status_text: 'PENDING',
            email: userDetails.email,
          });

          if (emailSent) {
            toast.success('Appointment booked successfully! Confirmation email sent.');
          } else {
            toast.error('Appointment booked, but failed to send confirmation email.');
          }
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          toast.error('Appointment booked, but failed to send confirmation email.');
        }
        */
        
        toast.success('Appointment booked successfully!');
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

  // Show loading while checking profile
  if (loadingProfile) {
    return (
      <div className="bg-white min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center items-center py-8">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
              <span className="text-lg text-gray-600">Loading your profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show profile completion warning if profile is incomplete
  if (!profileComplete) {
    return (
      <div className="bg-white min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
              <p className="text-lg text-gray-600 mb-8">
                Please complete your profile information before booking an appointment.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Required Information:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-amber-600 mr-3" />
                    <span className={`${userDetails?.name ? 'text-green-600' : 'text-amber-600'}`}>
                      Full Name {userDetails?.name ? '✓' : '(Required)'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-amber-600 mr-3" />
                    <span className={`${userDetails?.email ? 'text-green-600' : 'text-amber-600'}`}>
                      Email {userDetails?.email ? '✓' : '(Required)'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-amber-600 mr-3" />
                    <span className={`${userDetails?.phone ? 'text-green-600' : 'text-amber-600'}`}>
                      Phone Number {userDetails?.phone ? '✓' : '(Required)'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-amber-600 mr-3" />
                    <span className={`${userDetails?.address ? 'text-green-600' : 'text-amber-600'}`}>
                      Address {userDetails?.address ? '✓' : '(Required)'}
                    </span>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <Calendar className="w-5 h-5 text-amber-600 mr-3" />
                    <span className={`${userDetails?.dateOfBirth ? 'text-green-600' : 'text-amber-600'}`}>
                      Date of Birth {userDetails?.dateOfBirth ? '✓' : '(Required)'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Complete Profile
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <p className="text-yellow-800">No available time slots for this date.</p>
                    <p className="text-sm text-yellow-600 mt-1">
                      Please select a different date or note that appointments must be booked at least 1 hour in advance.
                    </p>
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Important Note:</h3>
              <p className="text-sm text-blue-700">
                Appointments must be booked at least 1 hour in advance. Only available time slots are shown.
              </p>
            </div>

            <button
              type="submit"
              disabled={processing || loadingSlots || availableTimeSlots.length === 0}
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
}