import React from 'react';
import { PublicSubPage } from './PublicNavbar';
import {
  ShieldCheck,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Heart,
  ExternalLink,
} from 'lucide-react';

interface PublicFooterProps {
  onNavigateSubPage: (page: PublicSubPage) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAuth: (type: 'login' | 'register' | 'demo') => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onNavigateSubPage,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAuth,
}) => {
  const handleLink = (page: PublicSubPage) => {
    onNavigateSubPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="public-site-footer" className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                MF
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight">MR. FLUENCY SaaS</span>
                <p className="text-[11px] text-slate-400 font-serif">أستاذ علي / Educational Cloud Operating System</p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              The premier all-in-one education and training management SaaS engineered for language academies,
              bilingual schools, and professional English educators across the GCC and internationally.
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Riyadh (KSA) • Dubai (UAE) • London (UK)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@mrfluency.com • enterprise@mrfluency.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+966 50 123 4567 (Dedicated Regional Hotline)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ISO 27001 & FERPA Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                CEFR & IELTS Aligned
              </span>
            </div>
          </div>

          {/* Col 2: Core Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Features</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-white transition"
                >
                  Multi-Tenant Isolation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-white transition"
                >
                  LMS & CEFR Syllabus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-white transition"
                >
                  Live Attendance Register
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-white transition"
                >
                  AI Fluency Diagnostics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-white transition"
                >
                  CELTA Lesson Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-white transition"
                >
                  Verifiable Certificate Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-white transition"
                >
                  Immutable Audit Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Industry Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleLink('for-training-centers')}
                  className="hover:text-white transition"
                >
                  For Training Centers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('for-schools')}
                  className="hover:text-white transition"
                >
                  For K-12 & Bilingual Schools
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('for-teachers')}
                  className="hover:text-white transition"
                >
                  For Independent Teachers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('solutions')}
                  className="hover:text-white transition"
                >
                  For IELTS & TOEFL Prep
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('pricing')}
                  className="hover:text-white transition"
                >
                  Commercial Pricing Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('demo')}
                  className="text-amber-400 hover:text-amber-300 font-medium transition flex items-center gap-1"
                >
                  <span>Interactive Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Legal & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Trust</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-white transition"
                >
                  About MR. FLUENCY & أستاذ علي
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('faq')}
                  className="hover:text-white transition"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact')}
                  className="hover:text-white transition"
                >
                  Contact & Demo Booking
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition text-left"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white transition text-left"
                >
                  Terms of Service & SLA
                </button>
              </li>
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <span>System Health API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Divider & Credits */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span>© 2026 MR. FLUENCY SaaS. All rights reserved.</span>
            <span>•</span>
            <span className="font-serif text-slate-400">شبكة أستاذ علي لتكنولوجيا التعليم</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-slate-300 transition"
            >
              Privacy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-slate-300 transition"
            >
              Terms
            </button>
            <button
              onClick={() => handleLink('contact')}
              className="hover:text-slate-300 transition"
            >
              Support
            </button>
            <div className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span>English / العربية</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
