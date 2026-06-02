export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} VitalCare. Built with the MERN stack.</p>
        <p className="text-xs">Educational use only — not a substitute for professional medical advice.</p>
      </div>
    </footer>
  );
}
