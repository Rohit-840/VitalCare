import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import DoctorCard from '../components/DoctorCard.jsx';

export default function Doctors() {
  const [params, setParams] = useSearchParams();
  const [doctors, setDoctors]     = useState([]);
  const [specialties, setSpecs]   = useState([]);
  const [cities, setCities]       = useState([]);
  const [loading, setLoading]     = useState(false);

  const specialty = params.get('specialty') || '';
  const city      = params.get('city')      || '';
  const q         = params.get('q')         || '';

  useEffect(() => {
    api.specialties().then(d => setSpecs(d.specialties || []));
    api.cities().then(d => setCities(d.cities || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.doctors({ specialty, city, q })
      .then(d => setDoctors(d.doctors || []))
      .finally(() => setLoading(false));
  }, [specialty, city, q]);

  function update(k, v) {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  }

  function reset() {
    setParams(new URLSearchParams(), { replace: true });
  }

  const anyFilter = specialty || city || q;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Find a specialist</h1>
      <p className="text-slate-600">Filter by specialty or city, and book an appointment in a couple of clicks.</p>

      <div className="card p-4 mt-6 grid sm:grid-cols-4 gap-3">
        <div>
          <label className="label">Search</label>
          <input className="input" placeholder="Name, specialty, city" value={q}
                 onChange={e => update('q', e.target.value)} />
        </div>
        <div>
          <label className="label">Specialty</label>
          <select className="input" value={specialty} onChange={e => update('specialty', e.target.value)}>
            <option value="">All specialties</option>
            {specialties.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">City</label>
          <select className="input" value={city} onChange={e => update('city', e.target.value)}>
            <option value="">All cities</option>
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button className="btn-ghost w-full" onClick={reset} disabled={!anyFilter}>Clear filters</button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-slate-500">Loading doctors…</p>
        ) : doctors.length === 0 ? (
          <div className="card p-8 text-center text-slate-600">
            No doctors match these filters. Try clearing them.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}
