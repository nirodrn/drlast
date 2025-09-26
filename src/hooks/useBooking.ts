import { useCallback } from 'react'
import { ref, push, serverTimestamp } from 'firebase/database'
import { database } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface BookingData {
  serviceType: string
  treatment: string
  date: string
  time: string
}

export function useBooking() {
  const { currentUser } = useAuth()

  const createBooking = useCallback(async (bookingData: BookingData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to book an appointment')
    }

    const appointment = {
      userId: currentUser.uid,
      ...bookingData,
      status: 'pending',
      createdAt: serverTimestamp(),
    }

    try {
      const appointmentsRef = ref(database, 'appointments')
      await push(appointmentsRef, appointment)
      toast.success('Appointment booked successfully!')
      return true
    } catch (error) {
      toast.error('Failed to book appointment')
      throw error
    }
  }, [currentUser])

  return { createBooking }
}