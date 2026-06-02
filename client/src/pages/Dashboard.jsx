import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import VitalsForm from '../components/VitalsForm.jsx';
import DiagnosisCard from '../components/DiagnosisCard.jsx';
import HealthAlert from '../components/HealthAlert.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vitals, setVitals]       = useState({ symptoms: [] });
  const [diagnosis, setDiagnosis] = useState(null);
  const [popup, setPopup]         = useState(null);
  const [err, setErr]             = useState('');
  const [busy, setBusy]           = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const numeric = {};
      for (const [k, v] of Object.entries(vitals)) {
        if (k === 'symptoms') { numeric.symptoms = v; continue; }
        if (v === '' || v == null) continue;
        numeric[k] = Number(v);
      }
      const { record } = await api.diagnose(numeric);
      setDiagnosis(record.diagnosis);
      if (record.diagnosis.severity !== 'ok') {
        setPopup(record.diagnosis);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  function findDoctor() {
    const sp = popup?.recommendedSpecialties?.[0];
    setPopup(null);
    navigate(sp ? `/doctors?specialty=${encodeURIComponent(sp)}` : '/doctors');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            Hello, {user?.name?.split(' ')[0]}
            <HeartHandshake className="text-rose-500" size={28} strokeWidth={2} />
          </h1>
          <p className="text-slate-600">Log today's vitals and get an instant, friendly diagnosis.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <VitalsForm vitals={vitals} setVitals={setVitals} onSubmit={handleSubmit} busy={busy} />
          {err && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-3 py-2">{err}</div>}
        </div>
        <div className="lg:col-span-2 space-y-6">
          {diagnosis
            ? <DiagnosisCard diagnosis={diagnosis} />
            : <EmptyState />
          }
        </div>
      </div>

      <HealthAlert
        severity={popup?.severity}
        findings={popup?.findings || []}
        onClose={() => setPopup(null)}
        onFindDoctor={findDoctor}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card p-6 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-brand-50 text-brand-600 grid place-items-center">
        <Stethoscope size={32} strokeWidth={1.8} />
      </div>
      <h3 className="font-semibold text-slate-900 mt-3">Awaiting your readings</h3>
      <p className="text-sm text-slate-600 mt-1">
        Fill in the form and hit <em>Run diagnosis</em>. We'll tell you exactly what to do next.
      </p>
    </div>
  );
}
