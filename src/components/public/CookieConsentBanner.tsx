import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacy }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mr_fluency_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('mr_fluency_cookie_consent', 'all');
    setShow(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('mr_fluency_cookie_consent', 'essential');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-slate-950/95 text-white border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Privacy & Educational Data Security
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            MR. FLUENCY uses strictly necessary cookies and analytics to ensure tenant data isolation,
            secure LMS sessions, and FERPA/GDPR compliance.{' '}
            <button
              onClick={onOpenPrivacy}
              className="text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Read our Privacy Policy
            </button>
            .
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              id="cookie-accept-all-btn"
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              Accept All
            </button>
            <button
              id="cookie-essential-btn"
              onClick={handleEssentialOnly}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Essential Only
            </button>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
