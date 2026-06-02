import { v4 as uuid } from 'uuid';

const SAMPLE = [
  { name: 'Dr. Aarti Mehta',     specialty: 'Cardiologist',   city: 'Mumbai',    fee: 800, rating: 4.8, experience: 14 },
  { name: 'Dr. Ravi Iyer',       specialty: 'Diabetologist',  city: 'Bengaluru', fee: 600, rating: 4.7, experience: 11 },
  { name: 'Dr. Neha Sharma',     specialty: 'General Physician', city: 'Delhi',  fee: 400, rating: 4.6, experience: 8  },
  { name: 'Dr. Sameer Khan',     specialty: 'Endocrinologist',city: 'Hyderabad', fee: 900, rating: 4.9, experience: 16 },
  { name: 'Dr. Priya Nair',      specialty: 'Nutritionist',   city: 'Pune',      fee: 500, rating: 4.5, experience: 7  },
  { name: 'Dr. Vikram Singh',    specialty: 'Pulmonologist',  city: 'Delhi',     fee: 750, rating: 4.7, experience: 12 },
  { name: 'Dr. Anjali Rao',      specialty: 'General Physician', city: 'Chennai',fee: 350, rating: 4.4, experience: 6  },
  { name: 'Dr. Karan Patel',     specialty: 'Cardiologist',   city: 'Ahmedabad', fee: 850, rating: 4.8, experience: 15 },
  { name: 'Dr. Sunita Bose',     specialty: 'Psychiatrist',   city: 'Kolkata',   fee: 700, rating: 4.6, experience: 10 },
  { name: 'Dr. Manish Verma',    specialty: 'Orthopedic',     city: 'Mumbai',    fee: 650, rating: 4.5, experience: 9  }
];

const SLOTS = ['09:00', '10:30', '12:00', '15:00', '16:30', '18:00'];

export function seedDoctors(store) {
  if (store.doctors.length) return;
  store.doctors = SAMPLE.map(d => ({
    id: uuid(),
    ...d,
    availableSlots: SLOTS
  }));
}
