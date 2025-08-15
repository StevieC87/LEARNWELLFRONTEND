export default function PlumbingIntro() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center">
        <div className="mb-6">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto text-blue-600">
            <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v2h2V3a1 1 0 1 1 2 0v2h1a3 3 0 0 1 3 3v2a1 1 0 1 1-2 0V8a1 1 0 0 0-1-1h-1v2a1 1 0 1 1-2 0V7h-2v2a1 1 0 1 1-2 0V7H9v2a1 1 0 1 1-2 0V7H6a1 1 0 0 0-1 1v2a1 1 0 1 1-2 0V8a3 3 0 0 1 3-3h1V3a1 1 0 1 1 2 0v2h2V3a1 1 0 0 1 1-1zm-6 13a6 6 0 1 1 12 0c0 2.21-1.79 4-4 4s-4-1.79-4-4zm6-4a4 4 0 0 0-4 4c0 1.1.9 2 2 2s2-.9 2-2a4 4 0 0 0-4-4z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2 text-center">BlueWave Plumbing Services</h1>
        <p className="text-lg text-blue-700 mb-6 text-center">
          Reliable, fast, and professional plumbing solutions for your home or business. 24/7 emergency service available.
        </p>
        <ul className="mb-8 w-full max-w-md space-y-2">
          <li className="flex items-center">
            <span className="text-blue-600 mr-2">✔</span>
            Leak detection & repair
          </li>
          <li className="flex items-center">
            <span className="text-blue-600 mr-2">✔</span>
            Drain cleaning & unclogging
          </li>
          <li className="flex items-center">
            <span className="text-blue-600 mr-2">✔</span>
            Water heater installation
          </li>
          <li className="flex items-center">
            <span className="text-blue-600 mr-2">✔</span>
            Emergency plumbing
          </li>
        </ul>
        <a
          href="tel:1234567890"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition"
        >
          Call Now: (123) 456-7890
        </a>
      </div>
      <div className="mt-10 text-blue-900/70 text-sm">
        Serving your community with pride & expertise since 1998.
      </div>
    </div>
  );
}
