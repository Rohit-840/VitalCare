import { useEffect } from 'react';
import { AlertOctagon, AlertTriangle, Eye } from 'lucide-react';

const STYLES = {
  critical: { bg: 'bg-rose-600',   ring: 'ring-rose-300',   Icon: AlertOctagon,  title: 'Critical alert'  },
  warn:     { bg: 'bg-orange-500', ring: 'ring-orange-200', Icon: AlertTriangle, title: 'Health warning' },
  watch:    { bg: 'bg-amber-500',  ring: 'ring-amber-200',  Icon: Eye,           title: 'Heads up'       }
};

// Modal "pop-up" — replaces the brittle window.alert() with an in-app dialog.
// (Your brief mentioned windows.pop() — the closest browser API is window.alert(),
// but a modal is far friendlier and accessible.)
export default function HealthAlert({ severity, findings = [], onClose, onFindDoctor }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!severity || severity === 'ok') return null;
  const s = STYLES[severity] || STYLES.watch;
  const Icon = s.Icon;
  const abnormal = findings.filter(f => f.band !== 'ok');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" role="dialog" aria-modal="true">
      <div className={`w-full max-w-md card overflow-hidden ring-4 ${s.ring} alert-enter alert-enter-active`}>
        <div className={`${s.bg} text-white px-5 py-4 flex items-center gap-3`}>
          <span className="grid place-items-center h-10 w-10 rounded-full bg-white/15">
            <Icon size={22} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide opacity-90">{s.title}</p>
            <p className="font-bold text-lg leading-tight">Please review your readings</p>
          </div>
        </div>
        <div className="p-5">
          <ul className="space-y-2 text-sm">
            {abnormal.map(f => (
              <li key={f.key} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-rose-500" />
                <span><strong>{f.label}:</strong> {f.value} {f.unit} — {f.message.replace(/^.*?\. /, '')}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2 justify-end">
            <button className="btn-ghost" onClick={onClose}>Dismiss</button>
            {severity !== 'watch' && (
              <button className="btn-primary" onClick={onFindDoctor}>Find a specialist →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
