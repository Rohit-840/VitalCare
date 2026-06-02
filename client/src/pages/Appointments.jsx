import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Plus } from 'lucide-react';
import { api } from '../api/client.js';

export default function Appointments() {
  const [items, setItems]   = useState([]);
  const [busy, setBusy]     = useState(true);
  const [err, setErr]       = useState('');

  function load() {
    setBusy(true);
    api.myAppointments()
      .then(d => setItems(d.appointments || []))
      .catch(e => setErr(e.message))
      .finally(() => setBusy(false));
  }
  useEffect(load, []);

  async function cancel(id) {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.cancelAppointment(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My appointments</h1>
          <p className="text-slate-600">All your bookings in one place.</p>
        </div>
        <Link to="/doctors" className="btn-primary"><Plus size={16} /> Book new</Link>
      </div>

      {err && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-3 py-2 mb-4">{err}</div>}

      {busy ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand-50 text-brand-600 grid place-items-center">
            <CalendarDays size={32} strokeWidth={1.8} />
          </div>
          <p className="mt-3 text-slate-600">No appointments yet. Browse doctors to book your first one.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map(a => (
            <div key={a.id} className="card p-4 flex flex-wrap items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-bold">
                {a.doctor?.name?.replace('Dr. ', '').split(' ').map(s => s[0]).slice(0, 2).join('') || '?'}
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold text-slate-900">{a.doctor?.name || 'Doctor'}</p>
                <p className="text-sm text-brand-700">{a.doctor?.specialty} · {a.doctor?.city}</p>
                {a.reason && <p className="text-xs text-slate-500 mt-1 italic">"{a.reason}"</p>}
              </div>
              <div className="text-sm text-right">
                <p className="font-semibold text-slate-900">{a.date}</p>
                <p className="text-slate-600">{a.time}</p>
              </div>
              <span className={`chip ${a.status === 'cancelled' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                {a.status}
              </span>
              {a.status !== 'cancelled' && (
                <button onClick={() => cancel(a.id)} className="btn-ghost text-rose-600 hover:bg-rose-50">Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
