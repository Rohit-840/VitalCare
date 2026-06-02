import { useMemo } from 'react';
import { RANGES, bandFor, bandStyles } from '../utils/diagnosis.js';

const FIELDS = [
  { key: 'bloodSugarFasting', label: 'Blood sugar — fasting', placeholder: '70 – 99',  step: '1'   },
  { key: 'bloodSugarRandom',  label: 'Blood sugar — random',  placeholder: '70 – 139', step: '1'   },
  { key: 'systolic',          label: 'Systolic BP',           placeholder: '90 – 120', step: '1'   },
  { key: 'diastolic',         label: 'Diastolic BP',          placeholder: '60 – 80',  step: '1'   },
  { key: 'heartRate',         label: 'Heart rate',            placeholder: '60 – 100', step: '1'   },
  { key: 'temperature',       label: 'Temperature',           placeholder: '97 – 99.5',step: '0.1' },
  { key: 'spo2',              label: 'Oxygen (SpO₂)',         placeholder: '95 – 100', step: '1'   }
];

const SYMPTOMS = [
  ['chest_pain',     'Chest pain'],
  ['breathlessness', 'Breathlessness'],
  ['headache',       'Headache'],
  ['fatigue',        'Fatigue'],
  ['nausea',         'Nausea'],
  ['dizziness',      'Dizziness'],
  ['anxiety',        'Anxiety'],
  ['joint_pain',     'Joint pain']
];

export default function VitalsForm({ vitals, setVitals, onSubmit, busy }) {
  const liveBands = useMemo(() => {
    const out = {};
    for (const f of FIELDS) out[f.key] = bandFor(f.key, vitals[f.key]);
    return out;
  }, [vitals]);

  function setField(key, value) {
    setVitals(v => ({ ...v, [key]: value }));
  }

  function toggleSymptom(s) {
    setVitals(v => {
      const set = new Set(v.symptoms || []);
      set.has(s) ? set.delete(s) : set.add(s);
      return { ...v, symptoms: [...set] };
    });
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h2 className="text-xl font-bold text-slate-900">Today's vitals</h2>
      <p className="text-slate-500 text-sm">Fill in what you have — empty fields are simply skipped.</p>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIELDS.map(f => {
          const band = liveBands[f.key];
          const style = band ? bandStyles[band] : null;
          return (
            <div key={f.key}>
              <label className="label">{f.label} <span className="text-slate-400 font-normal">({RANGES[f.key].unit})</span></label>
              <div className="relative">
                <input
                  className="input pr-20"
                  type="number"
                  step={f.step}
                  min="0"
                  placeholder={f.placeholder}
                  value={vitals[f.key] ?? ''}
                  onChange={e => setField(f.key, e.target.value)}
                />
                {style && (
                  <span className={`absolute right-2 top-1/2 -translate-y-1/2 chip ${style.chip}`}>
                    <span className={`h-1.5 w-1.5 rounded-full mr-1 ${style.dot}`} />
                    {style.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="label">Any symptoms today?</p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map(([key, label]) => {
            const on = (vitals.symptoms || []).includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSymptom(key)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  on
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <button className="btn-primary" disabled={busy}>
          {busy ? 'Analysing…' : 'Run diagnosis'}
        </button>
        <button type="button" className="btn-ghost"
                onClick={() => setVitals({ symptoms: [] })}>
          Clear
        </button>
        <p className="text-xs text-slate-500 ml-auto">Tip: try a sugar value of 220 or BP 165/105 to see a pop-up alert.</p>
      </div>
    </form>
  );
}
