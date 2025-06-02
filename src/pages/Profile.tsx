import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../lib/firebase';
import { ref, get, set } from 'firebase/database';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Calendar, MapPin, Clock } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  treatment: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const appointmentsRef = ref(database, 'appointments');
        
        const [userSnapshot, appointmentsSnapshot] = await Promise.all([
          get(userRef),
          get(appointmentsRef),
        ]);

        if (userSnapshot.exists()) {
          setProfile(userSnapshot.val());
        }

        if (appointmentsSnapshot.exists()) {
          const allAppointments = Object.entries(appointmentsSnapshot.val())
            .map(([id, data]: [string, any]) => ({
              id,
              ...data,
            }))
            .filter((apt) => apt.userId === currentUser.uid)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setAppointments(allAppointments);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await set(ref(database, `users/${currentUser?.uid}`), profile);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profile.dateOfBirth}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">{profile.name || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{profile.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900">{profile.dateOfBirth || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:col-span-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{profile.address || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Book New Appointment
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by booking a new appointment.</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <li key={appointment.id} className="py-5">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {appointment.treatment}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                  ${appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}