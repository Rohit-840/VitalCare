// Mirror of server thresholds for instant client-side feedback while typing.
// Authoritative diagnosis still comes from the server when you Submit.
export const RANGES = {
  bloodSugarFasting: { ok: [70, 99],  watch: [100, 125], warn: [126, 180], critical: [181, 1000], unit: 'mg/dL' },
  bloodSugarRandom:  { ok: [70, 139], watch: [140, 199], warn: [200, 250], critical: [251, 1000], unit: 'mg/dL' },
  systolic:          { ok: [90, 120], watch: [121, 139], warn: [140, 159], critical: [160, 300],  unit: 'mmHg'  },
  diastolic:         { ok: [60, 80],  watch: [81, 89],   warn: [90, 99],   critical: [100, 200],  unit: 'mmHg'  },
  heartRate:         { ok: [60, 100], watch: [101, 110], warn: [111, 130], critical: [131, 250],  unit: 'bpm'   },
  temperature:       { ok: [97, 99.5],watch: [99.6, 100.4], warn: [100.5, 102.9], critical: [103, 110], unit: '°F' },
  spo2:              { ok: [95, 100], watch: [92, 94],   warn: [89, 91],   critical: [0, 88],     unit: '%'    }
};

export function bandFor(key, value) {
  const r = RANGES[key];
  if (!r || value === '' || value == null) return null;
  const v = Number(value);
  if (Number.isNaN(v)) return null;
  const inB = (b) => v >= b[0] && v <= b[1];
  if (inB(r.critical)) return 'critical';
  if (inB(r.warn))     return 'warn';
  if (inB(r.watch))    return 'watch';
  if (inB(r.ok))       return 'ok';
  return v < r.ok[0] ? 'watch' : 'critical';
}

export const bandStyles = {
  ok:       { chip: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Normal'   },
  watch:    { chip: 'bg-amber-100 text-amber-800',     dot: 'bg-amber-500',   label: 'Watch'    },
  warn:     { chip: 'bg-orange-100 text-orange-800',   dot: 'bg-orange-500',  label: 'High'     },
  critical: { chip: 'bg-rose-100 text-rose-800',       dot: 'bg-rose-600',    label: 'Critical' }
};
