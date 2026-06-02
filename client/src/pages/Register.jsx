import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: '' });
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="text-slate-500 text-sm mt-1">Just a few details to personalise your diagnosis.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" minLength={6} required value={form.password} onChange={e => set('password', e.target.value)} />
            <p className="text-xs text-slate-500 mt-1">Minimum 6 characters.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Age</label>
              <input className="input" type="number" min="1" max="120" value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          {err && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-3 py-2">{err}</div>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Already have an account? <Link className="text-brand-700 font-semibold hover:underline" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
