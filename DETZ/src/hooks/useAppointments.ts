import { useCallback, useState } from 'react';
import { ref, push, update } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';


export interface TimeSlot {
  id: string;
  day: string;
  start: string;
  end: string;
  isAvailable: boolean;
  appointmentId: string | null;
}

export interface SlotMap {
  [key: string]: TimeSlot;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

export interface Appointment {
  userId: string;
  serviceType: string;
  treatment: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  userDetails: UserDetails;
  slotKey?: string;
}

export function useAppointments() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (!currentUser) {
      throw new Error('You must be logged in to book an appointment');
    }

    try {
      setLoading(true);
      const appointmentsRef = ref(database, 'appointments');
      const newAppointmentRef = push(appointmentsRef);
      
      await update(newAppointmentRef, {
        ...appointmentData,
        createdAt: Date.now()
      });

      return true;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    loading,
    createAppointment
  };
}