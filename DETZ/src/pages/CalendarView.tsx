import { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { database } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import toast from 'react-hot-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  treatment: string;
}

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentDetails = ({ appointment, onClose }: AppointmentDetailsProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Appointment Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="font-medium">Client Name:</label>
          <p>{appointment.userDetails.name}</p>
        </div>
        <div>
          <label className="font-medium">Treatment:</label>
          <p>{appointment.treatment}</p>
        </div>
        <div>
          <label className="font-medium">Time:</label>
          <p>{format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}</p>
        </div>
        <div>
          <label className="font-medium">Status:</label>
          <p className={`capitalize ${
            appointment.status === 'approved' ? 'text-green-600' :
            appointment.status === 'pending' ? 'text-yellow-600' :
            appointment.status === 'rejected' ? 'text-red-600' :
            'text-blue-600'
          }`}>{appointment.status}</p>
        </div>
        <div>
          <label className="font-medium">Contact:</label>
          <p>{appointment.userDetails.email}</p>
          <p>{appointment.userDetails.phone}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function CalendarView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = ref(database, 'appointments');
      const snapshot = await get(appointmentsRef);
      
      if (snapshot.exists()) {
        const appointmentsData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          title: data.treatment,
          start: new Date(`${data.date}T${data.time}`),
          end: new Date(`${data.date}T${data.time}`),
          status: data.status,
          userDetails: data.userDetails,
          treatment: data.treatment,
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => 
      filter === 'all' || appointment.status === filter
    );
  }, [appointments, filter]);

  const eventStyleGetter = (event: Appointment) => {
    let backgroundColor = '';
    switch (event.status) {
      case 'approved':
        backgroundColor = '#22c55e';
        break;
      case 'pending':
        backgroundColor = '#eab308';
        break;
      case 'rejected':
        backgroundColor = '#ef4444';
        break;
      case 'completed':
        backgroundColor = '#3b82f6';
        break;
      default:
        backgroundColor = '#6b7280';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <Calendar
            localizer={localizer}
            events={filteredAppointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 200px)' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => setSelectedAppointment(event as Appointment)}
            view={view}
            onView={setView as any}
            date={date}
            onNavigate={setDate}
            popup
            tooltipAccessor={(event) => `${event.title} - ${event.status.toUpperCase()}`}
          />
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}