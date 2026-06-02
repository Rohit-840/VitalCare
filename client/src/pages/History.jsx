import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import { api } from '../api/client.js';
import { bandStyles } from '../utils/diagnosis.js';

const TRACKED = [
  { key: 'bloodSugarFasting', label: 'Sugar (fasting)', color: '#2570eb' },
  { key: 'systolic',          label: 'Systolic BP',     color: '#e11d48' },
  { key: 'diastolic',         label: 'Diastolic BP',    color: '#f97316' },
  { key: 'heartRate',         label: 'Heart rate',      color: '#16a34a' },
  { key: 'spo2',              label: 'SpO₂',            color: '#0ea5e9' }
];

export default function History() {
  const [records, setRecords] = useState([]);
  const [busy, setBusy]       = useState(true);

  function load() {
    setBusy(true);
    api.records()
      .then(d => setRecords(d.records || []))
      .finally(() => setBusy(false));
  }
  useEffect(load, []);

  async function remove(id) {
    if (!confirm('Delete this record?')) return;
    await api.deleteRecord(id);
    load();
  }

  const chartData = useMemo(() => {
    return [...records].reverse().map(r => ({
      time: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      bloodSugarFasting: r.vitals.bloodSugarFasting,
      systolic:          r.vitals.systolic,
      diastolic:         r.vitals.diastolic,
      heartRate:         r.vitals.heartRate,
      spo2:              r.vitals.spo2
    }));
  }, [records]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your health history</h1>
      <p className="text-slate-600">Trends across your recorded vitals.</p>

      {busy ? (
        <p className="text-slate-500 mt-6">Loading…</p>
      ) : records.length === 0 ? (
        <div className="card p-10 text-center mt-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand-50 text-brand-600 grid place-items-center">
            <LineChartIcon size={32} strokeWidth={1.8} />
          </div>
          <p className="mt-3 text-slate-600">No records yet. Run a diagnosis from the Dashboard to start tracking.</p>
        </div>
      ) : (
        <>
          <div className="card p-4 mt-6">
            <h2 className="font-semibold text-slate-900 mb-3">Trend</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {TRACKED.map(t => (
                    <Line key={t.key} type="monotone" dataKey={t.key} name={t.label}
                          stroke={t.color} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Recent reports</h2>
          <div className="space-y-3">
            {records.map(r => {
              const sev = bandStyles[r.diagnosis.severity] || bandStyles.ok;
              return (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{new Date(r.createdAt).toLocaleString()}</p>
                      <span className={`chip ${sev.chip} mt-1`}>{sev.label}</span>
                    </div>
                    <button onClick={() => remove(r.id)} className="btn-ghost text-rose-600 hover:bg-rose-50 text-sm">Delete</button>
                  </div>
                  <div className="mt-3 grid sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                    {r.diagnosis.findings?.map(f => {
                      const fs = bandStyles[f.band];
                      return (
                        <div key={f.key} className="rounded-md border border-slate-200 p-2">
                          <p className="text-xs text-slate-500">{f.label}</p>
                          <p className="font-semibold">{f.value} <span className="text-xs text-slate-500">{f.unit}</span></p>
                          <span className={`chip mt-1 ${fs.chip}`}>{fs.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {!!r.diagnosis.recommendedSpecialties?.length && (
                    <p className="text-xs text-slate-600 mt-3">
                      Suggested: <strong>{r.diagnosis.recommendedSpecialties.join(', ')}</strong>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
