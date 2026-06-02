// Simple in-memory store. Swap any collection for a Mongoose model later
// without changing the route signatures.
export const store = {
  users: [],          // { id, name, email, passwordHash, age, gender, createdAt }
  healthRecords: [],  // { id, userId, vitals, diagnosis, advice, createdAt }
  doctors: [],        // { id, name, specialty, city, fee, rating, experience, availableSlots }
  appointments: []    // { id, userId, doctorId, date, time, reason, status, createdAt }
};
