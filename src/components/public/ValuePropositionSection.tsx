import React from 'react';
import { ActiveTab, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Award,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Globe,
  Clock,
  Layers,
} from 'lucide-react';

interface ValuePropositionSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (type: 'login' | 'register' | 'demo') => void;
  onNavigateSubPage: (page: any) => void;
}

export const ValuePropositionSection: React.FC<ValuePropositionSectionProps> = ({
  setActiveTab,
  onOpenAuth,
  onNavigateSubPage,
}) => {
  const { switchRole } = useAuth();

  const handleLaunchRole = async (role: UserRole, targetTab: ActiveTab) => {
    await switchRole(role);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24">
      {/* 1. WHAT IT IS & WHO IT IS FOR */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.15),transparent)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* WHAT IT IS */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>WHAT IT IS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                The Complete Operating System for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Language & Training Academies
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                MR. FLUENCY SaaS (أستاذ علي) is not a generic school database or simple video repository.
                It is a unified, commercial multi-tenant cloud platform architected specifically for English language
                learning institutes, combining <strong>attendance operations</strong>, <strong>modular CEFR curricula</strong>,
                <strong>server-side AI fluency diagnostics</strong>, and <strong>verifiable cryptographic certificates</strong>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-lg font-bold text-white block">Multi-Tenant</span>
                  <span className="text-xs text-slate-400">Strict Data Isolation</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-lg font-bold text-white block">CEFR & IELTS</span>
                  <span className="text-xs text-slate-400">Native Linguistic Rubrics</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-lg font-bold text-white block">Zero Leakage</span>
                  <span className="text-xs text-slate-400">Private Server-Side AI</span>
                </div>
              </div>

              {/* Strong CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  id="vp-cta-try-demo"
                  onClick={() => onOpenAuth('demo')}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>TRY DEMO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="vp-cta-get-started"
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <span>GET STARTED</span>
                </button>

                <button
                  id="vp-cta-view-pricing"
                  onClick={() => onNavigateSubPage('pricing')}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition"
                >
                  <span>VIEW PRICING</span>
                </button>
              </div>
            </div>

            {/* WHO IT IS FOR */}
            <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>WHO IT IS FOR</span>
              </div>

              <h3 className="text-xl font-bold text-white">Built Specifically For:</h3>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Training Centers & Language Academies</h4>
                    <p className="text-slate-400 mt-0.5">Institutes teaching General English, IELTS, TOEFL, Business English & medical terminology.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">K-12 & Bilingual Schools</h4>
                    <p className="text-slate-400 mt-0.5">Language departments seeking standardized CEFR benchmarking, grading rubrics & parent oversight.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Independent Professional Teachers</h4>
                    <p className="text-slate-400 mt-0.5">Freelance IELTS coaches and private tutors wanting professional branding and AI grading assistance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT PROBLEM IT SOLVES (Old Chaotic Way vs. MR. FLUENCY SaaS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-rose-600" />
            <span>WHAT PROBLEM IT SOLVES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Nightmare of Fragmented Educational Tools
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Most language academies waste over 20 hours every week stitching together incompatible tools.
            Here is how MR. FLUENCY consolidates your entire operational stack:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Problem Card (Without MR. FLUENCY) */}
          <div className="bg-rose-50/40 border border-rose-200 rounded-3xl p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-950 text-lg sm:text-xl">
                    The Fragmented Chaos (Old Way)
                  </h3>
                  <p className="text-xs text-rose-700">Wasted hours, lost revenue, frustrated parents</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-3">
                  <span className="text-rose-600 font-bold">✕</span>
                  <div>
                    <strong className="text-rose-950 block">Paper Sheets & Excel for Attendance:</strong>
                    <span className="text-slate-600 text-xs">
                      Attendance records get lost, tutors forget to log hours, and parents have zero visibility until students fail exams.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-3">
                  <span className="text-rose-600 font-bold">✕</span>
                  <div>
                    <strong className="text-rose-950 block">Chasing Homework Over WhatsApp:</strong>
                    <span className="text-slate-600 text-xs">
                      Audio files and essays scattered across phone chats with no organized submission timestamp or grading rubrics.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-3">
                  <span className="text-rose-600 font-bold">✕</span>
                  <div>
                    <strong className="text-rose-950 block">Unverified PDF Certificates:</strong>
                    <span className="text-slate-600 text-xs">
                      Generic Canva certificate templates that are easily forged and rejected by employers and international universities.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-3">
                  <span className="text-rose-600 font-bold">✕</span>
                  <div>
                    <strong className="text-rose-950 block">Subjective, Inconsistent Grading:</strong>
                    <span className="text-slate-600 text-xs">
                      Different teachers assess fluency differently without calibrated CEFR descriptors or IELTS band criteria.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-rose-800/80 font-medium italic border-t border-rose-200/60 pt-4">
              Result: High operational friction, poor student retention, and teacher burnout.
            </p>
          </div>

          {/* Solution Card (With MR. FLUENCY SaaS) */}
          <div className="bg-indigo-50/40 border-2 border-indigo-500 rounded-3xl p-6 sm:p-10 space-y-6 shadow-lg shadow-indigo-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-950 text-lg sm:text-xl">
                    The MR. FLUENCY Operating System
                  </h3>
                  <p className="text-xs text-indigo-700">Seamless, unified, AI-calibrated, verified</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 flex items-start gap-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">1-Click Attendance with Real-Time Parent Sync:</strong>
                    <span className="text-slate-600 text-xs">
                      Mark Present/Late/Absent in seconds. Automated absence alerts sent to parents; live attendance analytics stored forever.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 flex items-start gap-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Centralized Homework & Speaking Vault:</strong>
                    <span className="text-slate-600 text-xs">
                      Students upload spoken audio and written essays directly into structured batch assignments with clear deadlines.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 flex items-start gap-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Public Cryptographic Verification Registry:</strong>
                    <span className="text-slate-600 text-xs">
                      Every certificate carries a tamper-proof verification ID and institutional seal verifiable globally in seconds.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 flex items-start gap-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Server-Side Gemini AI Fluency Diagnostics:</strong>
                    <span className="text-slate-600 text-xs">
                      Instant, objective CEFR (A1-C2) and IELTS 1-9 band assessments highlighting vocabulary, grammar, and pronunciation.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-indigo-200/60 pt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">
                40% Average Reduction in Administrative Workload
              </span>
              <button
                onClick={() => handleLaunchRole('ORGANIZATION_OWNER', 'admin-dashboard')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Test Live Operations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Progressive 4-Step Flow) */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get Your Academy Operational in 4 Simple Steps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              From initial tenant provisioning to live batch classes and verifiable digital credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">Provision Isolated Tenant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register your academy. A dedicated multi-tenant database partition is created instantly with your
                subdomain, Arabic/English branding, and institutional logo.
              </p>
              <div className="pt-2 text-[11px] font-mono text-indigo-600 font-semibold">
                Time to complete: &lt; 2 Minutes
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-600/20">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Setup Courses & Batches</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select from ready-to-teach CEFR (A1-C2) course syllabi or build custom courses. Create batch
                schedules (Morning, Evening, Weekend) and invite teachers.
              </p>
              <div className="pt-2 text-[11px] font-mono text-blue-600 font-semibold">
                Time to complete: 10 Minutes
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-emerald-600/20">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">Teach & Mark Attendance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teachers take attendance in one click. Students access weekly assignments, upload speaking audio,
                and receive automated parent notifications.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-600 font-semibold">
                Instant Daily Sync
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-amber-500/20">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base">AI Diagnostics & Certify</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Run AI fluency diagnostics, generate gradebooks, and issue verified tamper-proof certificates
                accessible globally on the public verification registry.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-600 font-semibold">
                Global Credential Trust
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2"
            >
              <span>GET STARTED WITH STEP 1 (FREE 14-DAY TRIAL)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHY CUSTOMERS SHOULD USE IT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>WHY CUSTOMERS SHOULD USE IT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Decisive Advantage for Commercial Education
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Why leading academies, colleges, and trainers choose MR. FLUENCY SaaS over generic LMS software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Save 15+ Admin Hours / Week</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automate batch attendance roll-calls, grading queues, lesson plan structuring, and parent absence alerts.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Higher Course Completion Rates</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students stay accountable with instant AI audio feedback, gamified CEFR level milestones, and parent visibility.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Eliminate Certificate Fraud</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every digital certificate is sealed with a unique verification code backed by the public institutional registry.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Bilingual English / Arabic Support</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered natively for GCC institutions with right-to-left typography and dual-language portals.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Data Sovereignty & Isolation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your institutional students, finances, and courses are strictly separated in dedicated tenant partitions.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Private Server-Side Gemini AI</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero browser API key exposure. Student essays & speaking audio are never sold or used to train public AI models.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
