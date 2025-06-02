import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAE5tSx-f6d77zKL6AP8FRyHRaIUP06w3o",
  authDomain: "danielesthetixs.firebaseapp.com",
  databaseURL: "https://danielesthetixs-default-rtdb.firebaseio.com",
  projectId: "danielesthetixs",
  storageBucket: "danielesthetixs.firebasestorage.app",
  messagingSenderId: "790561794731",
  appId: "1:790561794731:web:c9f3bd16c8b7c7789be5ee"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export async function getGalleryImages(treatmentId?: string) {
  const galleryRef = ref(database, treatmentId ? `gallery/${treatmentId}` : 'gallery');
  const snapshot = await get(galleryRef);
  return snapshot.val();
}

// Initialize default time slots for each day
export async function initializeDefaultTimeSlots() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const defaultTimes = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const defaultSlots: { [key: string]: any } = {};
  days.forEach(day => {
    defaultSlots[day] = {};
    defaultTimes.forEach(time => {
      defaultSlots[day][time] = {
        appointmentId: 'none',
        groupId: `${day}-${time}`,
        isAvailable: true,
        maxAppointments: 1,
        currentAppointments: 0
      };
    });
  });

  return defaultSlots;
}