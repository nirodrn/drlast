import { ref, get, update } from 'firebase/database';
import { database } from './firebase';
import { v4 as uuidv4 } from 'uuid';

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

export const generateTimeSlots = () => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const startHour = 9;
  const endHour = 17;
  const slots: SlotMap = {};

  days.forEach(day => {
    for (let hour = startHour; hour < endHour; hour++) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const slotKey = `${day}_${start.replace(':', '')}`;
      
      slots[slotKey] = {
        id: uuidv4(),
        day,
        start,
        end,
        isAvailable: true,
        appointmentId: null
      };
    }
  });

  return slots;
};

export const getAvailableSlots = async () => {
  try {
    const slotsRef = ref(database, 'slots');
    const snapshot = await get(slotsRef);
    
    if (!snapshot.exists()) {
      const defaultSlots = generateTimeSlots();
      await update(ref(database), { slots: defaultSlots });
      return defaultSlots;
    }
    
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return {};
  }
};

export const bookSlot = async (slotKey: string, appointmentId: string) => {
  try {
    const updates: { [key: string]: any } = {};
    updates[`slots/${slotKey}/isAvailable`] = false;
    updates[`slots/${slotKey}/appointmentId`] = appointmentId;
    
    await update(ref(database), updates);
    return true;
  } catch (error) {
    console.error('Error booking slot:', error);
    throw new Error('Failed to book time slot');
  }
};

export const isDateFullyBooked = async (date: Date): Promise<boolean> => {
  try {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[date.getDay()];
    
    const slotsRef = ref(database, 'slots');
    const snapshot = await get(slotsRef);
    
    if (!snapshot.exists()) return false;
    
    const slots = snapshot.val();

    if (typeof slots !== 'object' || slots === null) return false;

    const daySlots = Object.entries(slots).filter(([key]) => key.startsWith(dayName));
    
    return (
      daySlots.length > 0 &&
      daySlots.every(([, slot]) => {
        if (typeof slot !== 'object' || slot === null) {
          return false;
        }
        const typedSlot = slot as TimeSlot;
        return !typedSlot.isAvailable;
      })
    );
  } catch (error) {
    console.error('Error checking if date is fully booked:', error);
    return true;
  }
};