import React, { useState } from 'react';
import { ActiveTab, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  BookOpen,
  CalendarCheck,
  Bot,
  Award,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface FeaturesSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (type: 'login' | 'register' | 'demo') => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  setActiveTab,
  onOpenAuth,
}) => {
  const { switchRole } = useAuth();
  const [activeFeatureKey, setActiveFeatureKey] = useState<string>('lms');

  const handleLaunchFeature = async (role: UserRole, tab: ActiveTab) => {
    await switchRole(role);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featureTabs = [
    {
      id: 'lms',
      name: 'LMS & Curriculum',
      icon: BookOpen,
      role: 'ORGANIZATION_OWNER' as UserRole,
      targetTab: 'courses-lms' as ActiveTab,
      badge: 'Pedagogy Engine',
      title: 'Modular CEFR & IELTS Course Architecture',
      description:
        'Structure learning tracks from Beginner (A1) to Mastery (C2) with weekly syllabi, multimedia resource vaults (PDF/video), student assignments, and linguistic grading rubrics.',
      bullets: [
        'CEFR-aligned weekly module breakdowns with vocabulary and grammar milestones',
        'Direct homework submission vault with teacher grading & AI linguistic commentary',
        'Support for multimedia audio listening exercises and reading comprehension packs',
        'Dynamic course pricing in local currencies (SAR, AED, USD) with enrollment caps',
      ],
      ctaText: 'Launch Live LMS Console',
    },
    {
      id: 'attendance',
      name: 'Attendance Register',
      icon: CalendarCheck,
      role: 'TEACHER' as UserRole,
      targetTab: 'classes-attendance' as ActiveTab,
      badge: 'Operations',
      title: 'Real-Time Batch Attendance & Schedules',
      description:
        'Eliminate messy paper sheets and fragmented spreadsheets. Record attendance in seconds with Present, Late, Absent, and Excused tags synced directly with student profiles.',
      bullets: [
        'One-click multi-student attendance marking with instantaneous state persistence',
        'Calculates real-time attendance percentages for individual students and entire batches',
        'Automatic absence notification triggers dispatched to linked parent & guardian accounts',
        'Schedule management supporting morning, evening, and weekend intensive schedules',
      ],
      ctaText: 'Open Attendance Register',
    },
    {
      id: 'ai-tools',
      name: 'Gemini AI Intelligence',
      icon: Bot,
      role: 'TEACHER' as UserRole,
      targetTab: 'ai-tools' as ActiveTab,
      badge: 'Server-Side AI',
      title: 'AI Fluency Evaluator & CELTA Lesson Planner',
      description:
        'Harness server-side Gemini 3.8-flash for instant, objective CEFR band diagnostics, spoken response evaluations, structured CELTA lesson plans, and grammar quiz authoring.',
      bullets: [
        'Objective CEFR & IELTS band breakdown (Fluency, Lexical Resource, Grammar, Pronunciation)',
        'CELTA-compliant 5-stage lesson planner (Lead-in, Clarification, Controlled, Free Practice)',
        'Instant grammar & vocabulary quiz generator with answer keys and distractor explanations',
        'Protected server-side execution: API keys never exposed to browser; zero data leakage',
      ],
      ctaText: 'Test AI Educational Tools',
    },
    {
      id: 'certificates',
      name: 'Digital Certificates',
      icon: Award,
      role: 'ORGANIZATION_OWNER' as UserRole,
      targetTab: 'certificates' as ActiveTab,
      badge: 'Public Registry',
      title: 'Tamper-Proof Credential Registry',
      description:
        'Generate high-resolution institutional certificates of completion with unique cryptographic verification codes, institutional seals, and global public lookup.',
      bullets: [
        'Automated credential generation with student name, course title, grade, and issuing seal',
        'Unique verification hashes allowing employers & universities to verify authenticity',
        'Instant digital PDF export and printable landscape layout with golden royal trim',
        'Integrated with public registry: anyone can test with code MF-OXF-2026-8841',
      ],
      ctaText: 'Explore Certificate Registry',
    },
    {
      id: 'multi-tenant',
      name: 'Data Isolation',
      icon: Layers,
      role: 'SUPER_ADMIN' as UserRole,
      targetTab: 'tenant-settings' as ActiveTab,
      badge: 'Enterprise Security',
      title: 'Strict Logical Multi-Tenant Data Partitioning',
      description:
        'Run hundreds of independent academies on a unified infrastructure. Every query, mutation, and audit log is partitioned by institutional organization IDs.',
      bullets: [
        'Rigid x-tenant-id enforcement across all database queries and server endpoints',
        'Custom subdomain support (e.g. oxford.mrfluency.com) and custom brand color themes',
        'Isolated student rosters, teacher performance KPIs, and financial earnings',
        'Scales seamlessly from single independent tutors to multi-branch regional franchises',
      ],
      ctaText: 'View Tenant Settings',
    },
    {
      id: 'audit-rbac',
      name: 'RBAC & Audit Trail',
      icon: ShieldCheck,
      role: 'SUPER_ADMIN' as UserRole,
      targetTab: 'audit-logs' as ActiveTab,
      badge: 'Compliance',
      title: 'Role-Based Access Control & Immutable Logs',
      description:
        'Enforce security across 7 defined user roles: Super Admin, Academy Owner, Center Admin, Senior Teacher, Staff, Student, and Parent, backed by immutable audit trails.',
      bullets: [
        'Immutable server-side audit logs capturing user actions, IP addresses, and timestamps',
        'Strict role-based permission gates preventing unauthorized access or data leakage',
        'Parent portal visibility isolated strictly to their enrolled dependents',
        'Comprehensive compliance export for education ministry and accreditation reviews',
      ],
      ctaText: 'Inspect Live Audit Trail',
    },
  ];

  const currentTab = featureTabs.find((f) => f.id === activeFeatureKey) || featureTabs[0];
  const TabIcon = currentTab.icon;

  return (
    <section id="features-section" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Comprehensive Educational OS Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered Specially for Language & Training Academies
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Generic school management systems lack linguistic CEFR grading, speaking diagnostic rubrics,
            and CELTA planning. MR. FLUENCY SaaS combines operations and pedagogy into one cohesive platform.
          </p>
        </div>

        {/* Feature Tab Navigation */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-10 no-scrollbar">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeatureKey === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureKey(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Showcase Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm transition-all animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Feature Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-100/80 text-indigo-800 text-[11px] font-bold uppercase tracking-wider">
                <TabIcon className="w-3.5 h-3.5" />
                <span>{currentTab.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentTab.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {currentTab.description}
              </p>

              <div className="space-y-3 pt-2">
                {currentTab.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{b}</span>
                  </div>
                ))}
              </div>

              {/* Direct Application Connection Link */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleLaunchFeature(currentTab.role, currentTab.targetTab)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20 flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <span>{currentTab.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuth('demo')}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Explore in Demo Persona</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Preview Panel */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-[11px] font-mono text-slate-400">mrfluency.cloud/console</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* Preview Content based on active tab */}
                {activeFeatureKey === 'lms' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                      <p className="font-bold text-indigo-900">IELTS Academic 7.5+ Masterclass</p>
                      <p className="text-[11px] text-indigo-700 mt-0.5">CEFR Level B2 to C1 • 32 Contact Hours</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="font-medium text-slate-700">Week 1: Task 2 Essay Structures</span>
                      <span className="text-emerald-600 font-bold">Completed</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="font-medium text-slate-700">Week 2: Lexical Sophistication</span>
                      <span className="text-blue-600 font-bold">In Progress</span>
                    </div>
                  </div>
                )}

                {activeFeatureKey === 'attendance' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <p className="font-bold text-emerald-900">Batch IELTS-Morning-A</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">Today: 18 Students • 94.4% Rate</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-emerald-100/60 text-emerald-900 font-semibold text-center text-[11px]">
                        17 Present
                      </div>
                      <div className="p-2 rounded-lg bg-amber-100/60 text-amber-900 font-semibold text-center text-[11px]">
                        1 Late
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic text-center">
                      Parent notifications sent automatically via SMS/Email
                    </p>
                  </div>
                )}

                {activeFeatureKey === 'ai-tools' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                      <p className="font-bold text-purple-900">Gemini Fluency Assessment</p>
                      <p className="text-[11px] text-purple-700 mt-0.5">Candidate: Omar Al-Mansoor • IELTS Spoken Part 2</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <span className="text-slate-500 block">Overall Band</span>
                        <strong className="text-base text-indigo-700">7.5</strong>
                      </div>
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <span className="text-slate-500 block">CEFR Level</span>
                        <strong className="text-base text-emerald-700">C1</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureKey === 'certificates' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                      <p className="font-bold text-amber-900">Verified Certificate Registry</p>
                      <p className="text-[11px] text-amber-800 font-mono mt-0.5">ID: MF-OXF-2026-8841</p>
                    </div>
                    <div className="text-slate-600 text-[11px] space-y-1">
                      <p>✓ Digital Tamper-Proof Cryptographic Hash</p>
                      <p>✓ Oxford Gulf Institute Institutional Seal</p>
                      <p>✓ Immediate Worldwide Employer Verification</p>
                    </div>
                  </div>
                )}

                {activeFeatureKey === 'multi-tenant' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                      <p className="font-bold text-blue-900">Tenant Isolation Layer</p>
                      <p className="text-[11px] text-blue-700 font-mono mt-0.5">SELECT * FROM students WHERE tenant_id = :org_id</p>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg text-[11px] text-slate-700 space-y-1">
                      <p>• Oxford Gulf Institute (org_oxford)</p>
                      <p>• Mr. Fluency Elite (org_fluency)</p>
                      <p>• Zero shared student or revenue memory</p>
                    </div>
                  </div>
                )}

                {activeFeatureKey === 'audit-rbac' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                      <p className="font-bold text-rose-900">Immutable Audit Stream</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">All actions timestamped with user ID & IP</p>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg font-mono text-[10px] text-slate-600 space-y-1">
                      <p>[10:14:02] GRADE_ASSIGNMENT by sarah.jenkins</p>
                      <p>[10:18:45] ISSUE_CERTIFICATE by owner@oxford</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer flex items-center justify-center gap-1">
                    <span>Live environment connected to production database</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
