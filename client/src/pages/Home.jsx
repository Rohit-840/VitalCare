import { Link } from 'react-router-dom';
import {
  Activity, BellRing, Salad, Stethoscope, LineChart, ShieldCheck, BellDot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { Icon: Activity,     title: 'Real-time diagnosis', body: 'Enter vitals and get instant analysis with clear, color-coded severity.', tone: 'bg-brand-100 text-brand-700' },
  { Icon: BellRing,     title: 'Smart pop-up alerts', body: 'Warns you the moment a reading crosses safe limits.',                     tone: 'bg-rose-100 text-rose-700' },
  { Icon: Salad,        title: 'Lifestyle advice',    body: 'Personalised diet, sleep and exercise tips at no cost.',                  tone: 'bg-emerald-100 text-emerald-700' },
  { Icon: Stethoscope,  title: 'Find a specialist',   body: 'Filter doctors by specialty and city, book in a couple of clicks.',      tone: 'bg-violet-100 text-violet-700' },
  { Icon: LineChart,    title: 'Track your history',  body: 'Trends for sugar, BP, heart-rate and more — beautifully charted.',       tone: 'bg-amber-100 text-amber-800' },
  { Icon: ShieldCheck,  title: 'Secure & private',    body: 'JWT-protected; your records are yours alone.',                            tone: 'bg-sky-100 text-sky-700' }
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="bg-gradient-to-br from-brand-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="chip bg-brand-100 text-brand-700">Your health, in one place</span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Know how your body is doing — <span className="text-brand-600">right now</span>.
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl">
              VitalCare turns your everyday readings — sugar, blood pressure, heart rate, oxygen — into clear advice.
              If something looks off, we tell you. If you need a doctor, we help you find one.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-base px-5 py-3">Open Dashboard →</Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-base px-5 py-3">Get started — free</Link>
                  <Link to="/login" className="btn-ghost text-base px-5 py-3">I already have an account</Link>
                </>
              )}
              <Link to="/doctors" className="btn-ghost text-base px-5 py-3">Browse doctors</Link>
            </div>
          </div>
          <div className="relative">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Today's snapshot</h3>
                <span className="chip bg-emerald-100 text-emerald-700">Healthy</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  ['Sugar (fasting)', '92 mg/dL', 'bg-emerald-100 text-emerald-700'],
                  ['Blood pressure',  '118/78',    'bg-emerald-100 text-emerald-700'],
                  ['Heart rate',      '74 bpm',    'bg-emerald-100 text-emerald-700'],
                  ['SpO₂',            '98%',       'bg-emerald-100 text-emerald-700']
                ].map(([k, v, c]) => (
                  <div key={k} className="rounded-lg border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">{k}</p>
                    <p className="text-xl font-bold mt-1">{v}</p>
                    <span className={`chip mt-1 ${c}`}>Normal</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">Sample preview · your real numbers go on the Dashboard.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-2 rotate-3 bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs shadow">
              <BellDot size={16} /> We pop up an alert when something's off
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything you need to stay on top of your health</h2>
        <p className="text-slate-600 mt-2">Six tools, one friendly interface.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ Icon, title, body, tone }) => (
            <div key={title} className="card p-5 hover:shadow-md transition">
              <div className={`grid place-items-center h-11 w-11 rounded-xl ${tone}`}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-slate-900 mt-3">{title}</h3>
              <p className="text-sm text-slate-600 mt-1">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Ready to take charge?</h3>
            <p className="text-brand-100 mt-1">Create a free account and run your first diagnosis in 60 seconds.</p>
          </div>
          {user ? (
            <Link to="/dashboard" className="btn bg-white text-brand-700 hover:bg-brand-50 font-semibold px-5 py-3">Go to Dashboard</Link>
          ) : (
            <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50 font-semibold px-5 py-3">Sign up free</Link>
          )}
        </div>
      </section>
    </>
  );
}
