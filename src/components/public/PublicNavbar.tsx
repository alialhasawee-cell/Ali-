import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  LogIn,
  ArrowRight,
  Building2,
  School,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

export type PublicSubPage =
  | 'home'
  | 'features'
  | 'solutions'
  | 'for-training-centers'
  | 'for-schools'
  | 'for-teachers'
  | 'pricing'
  | 'about'
  | 'faq'
  | 'contact';

interface PublicNavbarProps {
  currentSubPage: PublicSubPage;
  onNavigateSubPage: (page: PublicSubPage) => void;
  onOpenAuth: (type: 'login' | 'register' | 'demo') => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentSubPage,
  onNavigateSubPage,
  onOpenAuth,
  setActiveTab,
}) => {
  const { currentUser, currentTenant } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const handleNav = (page: PublicSubPage) => {
    onNavigateSubPage(page);
    setMobileOpen(false);
    setSolutionsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-400 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                MF
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-indigo-300 transition-colors">
                    MR. FLUENCY
                  </span>
                  <span className="bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 uppercase tracking-wider">
                    SaaS OS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium font-serif tracking-wide">
                  أستاذ علي / Education Cloud
                </span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-link-home"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentSubPage === 'home'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Home
            </button>

            <button
              id="nav-link-features"
              onClick={() => handleNav('features')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentSubPage === 'features'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Features
            </button>

            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                id="nav-dropdown-solutions"
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  ['solutions', 'for-training-centers', 'for-schools', 'for-teachers'].includes(
                    currentSubPage
                  )
                    ? 'text-white bg-slate-800/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {solutionsOpen && (
                <div
                  onMouseLeave={() => setSolutionsOpen(false)}
                  className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <button
                    id="nav-sol-overview"
                    onClick={() => handleNav('solutions')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">All Solutions Overview</p>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Explore institutional archetypes</p>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-800/60" />

                  <button
                    id="nav-sol-training-centers"
                    onClick={() => handleNav('for-training-centers')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">For Training Centers</p>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Language academies & institutes</p>
                    </div>
                  </button>

                  <button
                    id="nav-sol-schools"
                    onClick={() => handleNav('for-schools')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">For Schools</p>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">K-12 & bilingual departments</p>
                    </div>
                  </button>

                  <button
                    id="nav-sol-teachers"
                    onClick={() => handleNav('for-teachers')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">For Teachers</p>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Independent trainers & test coaches</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              id="nav-link-pricing"
              onClick={() => handleNav('pricing')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentSubPage === 'pricing'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Pricing
            </button>

            <button
              id="nav-link-about"
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentSubPage === 'about'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              About
            </button>

            <button
              id="nav-link-faq"
              onClick={() => handleNav('faq')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentSubPage === 'faq'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              FAQ
            </button>

            <button
              id="nav-link-contact"
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentSubPage === 'contact'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right: Strong Commercial CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Try Demo CTA */}
            <button
              id="navbar-cta-try-demo"
              onClick={() => onOpenAuth('demo')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>TRY DEMO</span>
            </button>

            {/* Login */}
            <button
              id="navbar-cta-login"
              onClick={() => onOpenAuth('login')}
              className="px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>Login</span>
            </button>

            {/* Get Started CTA */}
            <button
              id="navbar-cta-get-started"
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Active session link directly to dashboard */}
            {currentUser && (
              <button
                id="navbar-open-console-btn"
                onClick={() => setActiveTab('admin-dashboard')}
                title={`Open Active Console (${currentTenant?.name || 'Academy'})`}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
              >
                <span>Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNav('home')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'home' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('features')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'features' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              Features
            </button>
            <button
              onClick={() => handleNav('for-training-centers')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'for-training-centers' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              For Training Centers
            </button>
            <button
              onClick={() => handleNav('for-schools')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'for-schools' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              For Schools
            </button>
            <button
              onClick={() => handleNav('for-teachers')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'for-teachers' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              For Teachers
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'pricing' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              Pricing
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'about' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              About
            </button>
            <button
              onClick={() => handleNav('faq')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'faq' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              FAQ
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`p-2.5 rounded-xl text-left ${currentSubPage === 'contact' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >
              Contact
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenAuth('demo');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TRY DEMO PERSONAS</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAuth('login');
                }}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold text-center border border-slate-700"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAuth('register');
                }}
                className="py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center shadow-md"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
