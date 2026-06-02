import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, MapPin, Star, BriefcaseMedical } from 'lucide-react';
import { api } from '../api/client.js';

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate]     = useState(todayISO());
  const [time, setTime]     = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [err, setErr]       = useState('');
  const [busy, setBusy]     = useState(false);

  useEffect(() => {
    api.doctors().then(({ doctors }) => {
      const d = doctors.find(x => x.id === doctorId);
      setDoctor(d || null);
      if (d?.availableSlots?.length) setTime(d.availableSlots[0]);
    });
  }, [doctorId]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const data = await api.bookAppointment({ doctorId, date, time, reason });
      setConfirmed(data.appointment);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!doctor) {
    return <div className="max-w-3xl mx-auto p-8 text-slate-500">Loading doctor…</div>;
  }

  if (confirmed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="card p-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center">
            <CheckCircle2 size={36} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-3">Appointment confirmed</h2>
          <p className="text-slate-600 mt-1">
            with <strong>{doctor.name}</strong> ({doctor.specialty})<br />
            on <strong>{confirmed.date}</strong> at <strong>{confirmed.time}</strong>
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Link to="/appointments" className="btn-primary">View my appointments</Link>
            <button className="btn-ghost" onClick={() => navigate('/doctors')}>Book another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card p-6">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-bold">
            {doctor.name.replace('Dr. ', '').split(' ').map(s => s[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{doctor.name}</h1>
            <p className="text-sm text-brand-700 flex items-center gap-1">
              {doctor.specialty}
              <span className="text-slate-300">·</span>
              <MapPin size={14} className="text-slate-400" /> {doctor.city}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Star size={12} className="fill-amber-500 text-amber-500" /> {doctor.rating}
              <span className="text-slate-300">·</span>
              <BriefcaseMedical size={12} className="text-slate-400" /> {doctor.experience} yrs exp
              <span className="text-slate-300">·</span>
              ₹{doctor.fee} consult fee
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Date</label>
            <input className="input" type="date" min={todayISO()} required
                   value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Time slot</label>
            <select className="input" value={time} onChange={e => setTime(e.target.value)} required>
              {doctor.availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Reason for visit (optional)</label>
            <textarea className="input min-h-[90px]" maxLength={300}
                      placeholder="e.g. high fasting sugar last 3 days"
                      value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          {err && <div className="sm:col-span-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-3 py-2">{err}</div>}
          <div className="sm:col-span-2 flex gap-3 justify-end">
            <Link to="/doctors" className="btn-ghost">Cancel</Link>
            <button className="btn-primary" disabled={busy}>{busy ? 'Booking…' : 'Confirm booking'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
