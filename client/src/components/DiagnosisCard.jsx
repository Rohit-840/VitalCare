import { Link } from 'react-router-dom';
import { bandStyles } from '../utils/diagnosis.js';

const SEV_HEADER = {
  ok:       { bg: 'bg-emerald-50 border-emerald-200', title: 'You look healthy', sub: 'All entered values are in the normal range. Keep it up!' },
  watch:    { bg: 'bg-amber-50 border-amber-200',     title: 'Worth keeping an eye on', sub: 'A couple of readings are borderline — small changes today help.' },
  warn:     { bg: 'bg-orange-50 border-orange-200',   title: 'Take action this week', sub: 'Some readings are high. Please consider a consult.' },
  critical: { bg: 'bg-rose-50 border-rose-200',       title: 'See a doctor as soon as possible', sub: 'One or more readings are in the danger zone.' }
};

export default function DiagnosisCard({ diagnosis }) {
  if (!diagnosis) return null;
  const head = SEV_HEADER[diagnosis.severity] || SEV_HEADER.ok;
  return (
    <div className={`card p-6 border ${head.bg}`}>
      <h2 className="text-xl font-bold text-slate-900">{head.title}</h2>
      <p className="text-slate-600 text-sm mt-1">{head.sub}</p>

      {!!diagnosis.findings?.length && (
        <ul className="mt-4 space-y-2">
          {diagnosis.findings.map(f => {
            const s = bandStyles[f.band];
            return (
              <li key={f.key} className="flex items-start gap-3 text-sm">
                <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${s.dot}`} />
                <span className="text-slate-700">
                  <strong>{f.label}:</strong> {f.value} {f.unit} —{' '}
                  <span className={`chip ${s.chip}`}>{s.label}</span>
                  <span className="block text-slate-600 mt-0.5">{f.message.replace(/^[^.]*\. ?/, '')}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {!!diagnosis.lifestyle?.length && (
        <div className="mt-5">
          <h3 className="font-semibold text-slate-900">Lifestyle advice</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
            {diagnosis.lifestyle.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      )}

      {diagnosis.consultDoctor && diagnosis.recommendedSpecialties?.length > 0 && (
        <div className="mt-5 p-4 rounded-lg bg-white border border-slate-200">
          <p className="text-sm text-slate-700">
            We recommend consulting:
            <span className="font-semibold text-slate-900"> {diagnosis.recommendedSpecialties.join(', ')}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {diagnosis.recommendedSpecialties.map(sp => (
              <Link key={sp} to={`/doctors?specialty=${encodeURIComponent(sp)}`} className="btn-primary text-sm">
                Find {sp} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
