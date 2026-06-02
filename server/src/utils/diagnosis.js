// Threshold-based diagnosis. Kept simple, transparent, and easy to extend.
// severity: 'ok' | 'watch' | 'warn' | 'critical'

const RANGES = {
  bloodSugarFasting: { ok: [70, 99],  watch: [100, 125], warn: [126, 180], critical: [181, 1000], unit: 'mg/dL', label: 'Fasting blood sugar' },
  bloodSugarRandom:  { ok: [70, 139], watch: [140, 199], warn: [200, 250], critical: [251, 1000], unit: 'mg/dL', label: 'Random blood sugar' },
  systolic:          { ok: [90, 120], watch: [121, 139], warn: [140, 159], critical: [160, 300],  unit: 'mmHg',  label: 'Systolic BP' },
  diastolic:         { ok: [60, 80],  watch: [81, 89],   warn: [90, 99],   critical: [100, 200],  unit: 'mmHg',  label: 'Diastolic BP' },
  heartRate:         { ok: [60, 100], watch: [101, 110], warn: [111, 130], critical: [131, 250],  unit: 'bpm',   label: 'Heart rate' },
  temperature:       { ok: [97, 99.5],watch: [99.6, 100.4], warn: [100.5, 102.9], critical: [103, 110], unit: '°F', label: 'Temperature' },
  spo2:              { ok: [95, 100], watch: [92, 94],   warn: [89, 91],   critical: [0, 88],     unit: '%',     label: 'Oxygen (SpO2)', inverted: true }
};

const ADVICE = {
  bloodSugarFasting: {
    watch: 'Pre-diabetic range. Cut refined sugar, add a 20-minute walk after meals.',
    warn:  'Diabetic range. Hydrate, avoid sweets/white rice, consult a diabetologist this week.',
    critical: 'Very high sugar. Drink water, avoid carbs, seek medical attention urgently.'
  },
  bloodSugarRandom: {
    watch: 'Slightly elevated. Watch carb portions and check fasting sugar tomorrow.',
    warn:  'Elevated random sugar. Book a HbA1c test and see a diabetologist.',
    critical: 'Dangerously high. Seek emergency care if you feel dizzy, thirsty or drowsy.'
  },
  systolic: {
    watch: 'Pre-hypertension. Reduce salt and caffeine, manage stress.',
    warn:  'Stage 1 hypertension. Monitor daily, see a doctor within a week.',
    critical: 'Hypertensive crisis. Sit calmly, breathe, and seek emergency care.'
  },
  diastolic: {
    watch: 'Mildly elevated. Reduce sodium and processed foods.',
    warn:  'High diastolic. Schedule a cardiology consult.',
    critical: 'Severe diastolic pressure. Seek urgent medical help.'
  },
  heartRate: {
    watch: 'Slightly fast. Rest 10 minutes and recheck.',
    warn:  'Tachycardia. Avoid caffeine; if persistent, consult a physician.',
    critical: 'Very high heart rate. If you feel chest pain or breathlessness, call emergency services.'
  },
  temperature: {
    watch: 'Low-grade fever. Hydrate and rest.',
    warn:  'Fever. Paracetamol per label, monitor every 4 hours.',
    critical: 'High fever. See a doctor today; sponge with lukewarm water.'
  },
  spo2: {
    watch: 'Slightly low oxygen. Deep breathing exercises, sit upright.',
    warn:  'Low oxygen. Consult a pulmonologist; avoid exertion.',
    critical: 'Critically low SpO2. Seek emergency care immediately.'
  }
};

const SPECIALTY = {
  bloodSugarFasting: 'Diabetologist',
  bloodSugarRandom:  'Diabetologist',
  systolic: 'Cardiologist',
  diastolic: 'Cardiologist',
  heartRate: 'Cardiologist',
  temperature: 'General Physician',
  spo2: 'Pulmonologist'
};

function bandFor(key, value) {
  const r = RANGES[key];
  if (!r || value == null || value === '') return null;
  const v = Number(value);
  if (Number.isNaN(v)) return null;
  const inBand = (band) => v >= band[0] && v <= band[1];
  if (inBand(r.critical)) return 'critical';
  if (inBand(r.warn))     return 'warn';
  if (inBand(r.watch))    return 'watch';
  if (inBand(r.ok))       return 'ok';
  // Out of all bands → treat as critical edge
  return v < r.ok[0] ? (r.inverted ? 'critical' : 'watch') : 'critical';
}

export function diagnose(vitals = {}) {
  const findings = [];
  let worst = 'ok';
  const rank = { ok: 0, watch: 1, warn: 2, critical: 3 };
  const recommendedSpecialties = new Set();

  for (const key of Object.keys(RANGES)) {
    const value = vitals[key];
    const band = bandFor(key, value);
    if (!band) continue;
    const meta = RANGES[key];
    const message = band === 'ok'
      ? `${meta.label} is normal (${value} ${meta.unit}).`
      : `${meta.label} is ${band} at ${value} ${meta.unit}. ${ADVICE[key]?.[band] || ''}`;
    findings.push({ key, label: meta.label, value, unit: meta.unit, band, message });
    if (rank[band] > rank[worst]) worst = band;
    if (band !== 'ok' && SPECIALTY[key]) recommendedSpecialties.add(SPECIALTY[key]);
  }

  // Symptom-based suggestions
  const symptoms = Array.isArray(vitals.symptoms) ? vitals.symptoms : [];
  if (symptoms.includes('chest_pain'))    { recommendedSpecialties.add('Cardiologist'); worst = rank[worst] < 3 ? 'critical' : worst; }
  if (symptoms.includes('breathlessness')){ recommendedSpecialties.add('Pulmonologist'); worst = rank[worst] < 2 ? 'warn' : worst; }
  if (symptoms.includes('anxiety'))        recommendedSpecialties.add('Psychiatrist');
  if (symptoms.includes('joint_pain'))     recommendedSpecialties.add('Orthopedic');

  const lifestyle = [];
  if (worst !== 'ok') {
    lifestyle.push('Drink 2–3 litres of water through the day.');
    lifestyle.push('30 minutes of moderate activity, 5 days a week.');
    lifestyle.push('Sleep 7–8 hours; avoid screens 1 hour before bed.');
    lifestyle.push('Cut down on refined sugar, deep-fried food and excess salt.');
  }

  return {
    severity: worst,
    findings,
    lifestyle,
    consultDoctor: worst === 'warn' || worst === 'critical',
    recommendedSpecialties: [...recommendedSpecialties]
  };
}
