import { Link } from 'react-router-dom';
import { MapPin, Star, BriefcaseMedical } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  return (
    <div className="card p-5 flex flex-col h-full hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-bold text-lg">
          {doctor.name.replace('Dr. ', '').split(' ').map(s => s[0]).slice(0, 2).join('')}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
          <p className="text-sm text-brand-700">{doctor.specialty}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-slate-400" /> {doctor.city}
            <span className="mx-1 text-slate-300">·</span>
            <BriefcaseMedical size={12} className="text-slate-400" /> {doctor.experience} yrs
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="chip bg-amber-100 text-amber-800 inline-flex items-center gap-1">
          <Star size={12} className="fill-amber-500 text-amber-500" /> {doctor.rating}
        </span>
        <p className="font-semibold text-slate-900">₹{doctor.fee}</p>
      </div>
      <Link to={`/book/${doctor.id}`} className="btn-primary mt-4 w-full">Book appointment</Link>
    </div>
  );
}
