import React, { useState, useEffect } from 'react';
import { ActiveTab, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { PublicNavbar, PublicSubPage } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';
import { AuthModals, AuthModalType } from '../components/public/AuthModals';
import { PrivacyModal, TermsModal } from '../components/public/LegalModals';
import { CookieConsentBanner } from '../components/public/CookieConsentBanner';
import { CustomerLogos } from '../components/public/CustomerLogos';
import { ValuePropositionSection } from '../components/public/ValuePropositionSection';
import { CertificateVerificationSection } from '../components/public/CertificateVerificationSection';
import { FeaturesSection } from '../components/public/FeaturesSection';
import { SolutionsSection } from '../components/public/SolutionsSection';
import { PricingSection } from '../components/public/PricingSection';
import { AboutSection } from '../components/public/AboutSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { FaqSection } from '../components/public/FaqSection';
import { ContactSection } from '../components/public/ContactSection';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Award,
} from 'lucide-react';

interface PublicLandingViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ setActiveTab }) => {
  const { switchRole } = useAuth();
  const [currentSubPage, setCurrentSubPage] = useState<PublicSubPage>('home');
  const [authModal, setAuthModal] = useState<AuthModalType | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Scroll to top when changing subPage
  const handleNavigateSubPage = (page: PublicSubPage) => {
    setCurrentSubPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchRole = async (role: UserRole, targetTab: ActiveTab) => {
    await switchRole(role);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Public Top Navigation Bar */}
      <PublicNavbar
        currentSubPage={currentSubPage}
        onNavigateSubPage={handleNavigateSubPage}
        onOpenAuth={(type) => setAuthModal(type)}
      />

      {/* 2. Main Page Content Based on Selected SubPage */}
      <main className="flex-1">
        {/* SUBPAGE: HOME */}
        {currentSubPage === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.25),rgba(255,255,255,0))]"></div>
              
              <div className="relative max-w-5xl mx-auto text-center space-y-6">
                
                {/* Brand pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>MR. FLUENCY SaaS • أستاذ علي Education Cloud</span>
                </div>

                {/* Primary Value Proposition Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  The All-In-One SaaS for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                    Language Academies & Trainers
                  </span>
                </h1>

                {/* Clear Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
                  Combine <strong>multi-tenant academy operations</strong>, <strong>live attendance tracking</strong>,
                  <strong>CEFR A1-C2 LMS curricula</strong>, <strong>server-side AI fluency diagnostics</strong>, and
                  <strong>verifiable digital certificates</strong> in one unified commercial platform.
                </p>

                {/* High-Contrast Action CTAs */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    id="hero-cta-try-demo"
                    onClick={() => setAuthModal('demo')}
                    className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-400/20 flex items-center gap-2 transition hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>TRY DEMO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="hero-cta-get-started"
                    onClick={() => setAuthModal('register')}
                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
                  >
                    <span>GET STARTED (FREE TRIAL)</span>
                  </button>

                  <button
                    id="hero-cta-view-pricing"
                    onClick={() => handleNavigateSubPage('pricing')}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition"
                  >
                    <span>VIEW PRICING</span>
                  </button>
                </div>

                {/* Instant Live Role Portal Launchers (Direct connections to actual app routes) */}
                <div className="pt-8 border-t border-slate-800/80 max-w-4xl mx-auto">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Instant Interactive Persona Switchers (Test Core Operating Engine):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handleLaunchRole('ORGANIZATION_OWNER', 'admin-dashboard')}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500 text-left transition group"
                    >
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Academy Director</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block group-hover:text-slate-200">
                        Admin & Batches →
                      </span>
                    </button>

                    <button
                      onClick={() => handleLaunchRole('TEACHER', 'teacher-portal')}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 text-left transition group"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>Teacher / Trainer</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block group-hover:text-slate-200">
                        Attendance & AI →
                      </span>
                    </button>

                    <button
                      onClick={() => handleLaunchRole('STUDENT', 'student-portal')}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500 text-left transition group"
                    >
                      <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Enrolled Student</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block group-hover:text-slate-200">
                        LMS & Homework →
                      </span>
                    </button>

                    <button
                      onClick={() => handleLaunchRole('SUPER_ADMIN', 'super-admin')}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500 text-left transition group"
                    >
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Platform Admin</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block group-hover:text-slate-200">
                        Multi-Tenant Hub →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Public Certificate Verification Registry Live Tool */}
            <CertificateVerificationSection />

            {/* Institutional Customer Logos */}
            <CustomerLogos />

            {/* Value Proposition Engine: WHAT, WHO, PROBLEM, HOW, WHY */}
            <ValuePropositionSection
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
              onNavigateSubPage={handleNavigateSubPage}
            />

            {/* Comprehensive Features Section */}
            <FeaturesSection
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />

            {/* Solutions for Academies, Schools, Teachers */}
            <SolutionsSection
              selectedVertical="all"
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />

            {/* Testimonials */}
            <TestimonialsSection />

            {/* Transparent Commercial Pricing Section */}
            <PricingSection
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />

            {/* FAQ */}
            <FaqSection onOpenContact={() => handleNavigateSubPage('contact')} />

            {/* Contact & Demo Booking Section */}
            <ContactSection />
          </div>
        )}

        {/* SUBPAGE: FEATURES */}
        {currentSubPage === 'features' && (
          <div className="pt-10">
            <FeaturesSection
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
            <FaqSection onOpenContact={() => handleNavigateSubPage('contact')} />
          </div>
        )}

        {/* SUBPAGE: SOLUTIONS */}
        {currentSubPage === 'solutions' && (
          <div className="pt-10">
            <SolutionsSection
              selectedVertical="all"
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
            <CustomerLogos />
          </div>
        )}

        {/* SUBPAGE: FOR TRAINING CENTERS */}
        {currentSubPage === 'for-training-centers' && (
          <div className="pt-10">
            <SolutionsSection
              selectedVertical="training-centers"
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
            <PricingSection
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
          </div>
        )}

        {/* SUBPAGE: FOR SCHOOLS */}
        {currentSubPage === 'for-schools' && (
          <div className="pt-10">
            <SolutionsSection
              selectedVertical="schools"
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
            <CustomerLogos />
          </div>
        )}

        {/* SUBPAGE: FOR TEACHERS */}
        {currentSubPage === 'for-teachers' && (
          <div className="pt-10">
            <SolutionsSection
              selectedVertical="teachers"
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
            <PricingSection
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
          </div>
        )}

        {/* SUBPAGE: PRICING */}
        {currentSubPage === 'pricing' && (
          <div className="pt-10">
            <PricingSection
              setActiveTab={setActiveTab}
              onOpenAuth={(t) => setAuthModal(t)}
            />
            <FaqSection onOpenContact={() => handleNavigateSubPage('contact')} />
          </div>
        )}

        {/* SUBPAGE: ABOUT */}
        {currentSubPage === 'about' && (
          <div className="pt-10">
            <AboutSection />
            <CustomerLogos />
            <TestimonialsSection />
          </div>
        )}

        {/* SUBPAGE: FAQ */}
        {currentSubPage === 'faq' && (
          <div className="pt-10">
            <FaqSection onOpenContact={() => handleNavigateSubPage('contact')} />
            <ContactSection />
          </div>
        )}

        {/* SUBPAGE: CONTACT */}
        {currentSubPage === 'contact' && (
          <div className="pt-10">
            <ContactSection />
            <CertificateVerificationSection />
          </div>
        )}
      </main>

      {/* 3. Comprehensive Public Footer */}
      <PublicFooter
        onNavigateSubPage={handleNavigateSubPage}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenAuth={(t) => setAuthModal(t)}
      />

      {/* 4. Global GDPR & Cookie Consent Banner */}
      <CookieConsentBanner onOpenPrivacy={() => setPrivacyModalOpen(true)} />

      {/* 5. Authentication Modals (Login, Register, Demo Personas) */}
      <AuthModals
        modalType={authModal}
        onClose={() => setAuthModal(null)}
        setActiveTab={setActiveTab}
      />

      {/* 6. Legal Modals (Privacy & Terms) */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </div>
  );
};
