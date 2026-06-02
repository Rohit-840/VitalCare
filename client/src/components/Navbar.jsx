import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Stethoscope, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const linkBase = 'px-3 py-2 rounded-md text-sm font-medium transition';
const inactive = 'text-slate-600 hover:text-brand-700 hover:bg-brand-50';
const active   = 'text-brand-700 bg-brand-50';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const navLink = (to, label) => (
    <NavLink to={to} onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
      {label}
    </NavLink>
  );

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-brand-700">
          <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand-600 text-white">
            <Stethoscope size={20} strokeWidth={2.25} />
          </span>
          VitalCare
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLink('/', 'Home')}
          {navLink('/doctors', 'Find Doctor')}
          {user && navLink('/dashboard', 'Dashboard')}
          {user && navLink('/history', 'History')}
          {user && navLink('/appointments', 'My Appointments')}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-slate-600">Hi, <strong>{user.name.split(' ')[0]}</strong></span>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>

        <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLink('/', 'Home')}
            {navLink('/doctors', 'Find Doctor')}
            {user && navLink('/dashboard', 'Dashboard')}
            {user && navLink('/history', 'History')}
            {user && navLink('/appointments', 'My Appointments')}
            <div className="pt-2 border-t border-slate-100 mt-2">
              {user ? (
                <button className="btn-ghost w-full" onClick={handleLogout}>Logout</button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn-ghost flex-1">Sign in</Link>
                  <Link to="/register" className="btn-primary flex-1">Get started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
