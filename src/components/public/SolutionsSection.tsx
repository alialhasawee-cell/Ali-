import React from 'react';
import { ActiveTab, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  School,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Users,
  Clock,
  Award,
} from 'lucide-react';

interface SolutionsSectionProps {
  selectedVertical?: 'all' | 'training-centers' | 'schools' | 'teachers';
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (type: 'login' | 'register' | 'demo') => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  selectedVertical = 'all',
  setActiveTab,
  onOpenAuth,
}) => {
  const { switchRole } = useAuth();

  const handleLaunchRole = async (role: UserRole, targetTab: ActiveTab) => {
    await switchRole(role);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const verticals = [
    {
      id: 'training-centers',
      slug: 'for-training-centers',
      title: 'For Training Centers & Language Academies',
      titleAr: 'للمعاهد ومراكز تدريب اللغات',
      subtitle: 'Engineered for commercial language schools, IELTS testing prep hubs, and multi-branch institutes.',
      icon: Building2,
      role: 'ORGANIZATION_OWNER' as UserRole,
      targetTab: 'admin-dashboard' as ActiveTab,
      badge: 'Commercial Academies',
      color: 'border-blue-200 bg-blue-50/50',
      tagColor: 'bg-blue-100 text-blue-800',
      metrics: [
        { label: 'Admin Time Saved', value: '40%' },
        { label: 'Attendance Accuracy', value: '99.8%' },
        { label: 'Student Retention', value: '+28%' },
      ],
      pains: [
        'Chaotic spreadsheets for attendance leading to lost billable tuition hours',
        'Teachers spending 15+ hours weekly creating lesson plans and grading essays manually',
        'Certificates forged or doubted by employers without an instant digital registry',
      ],
      solutions: [
        'Multi-tenant branch management with consolidated or isolated accounting',
        'Automatic batch schedules with morning, evening, and intensive weekend slots',
        'Verifiable digital certificates branded with your center’s institutional seal',
        'Parent communication portal with automatic absence SMS/WhatsApp triggers',
      ],
      cta: 'Launch Academy Director Portal',
    },
    {
      id: 'schools',
      slug: 'for-schools',
      title: 'For K-12 & Bilingual Schools',
      titleAr: 'للمدارس والبرامج الدولية ثنائية اللغة',
      subtitle: 'Empowering English language departments, international schools, and academic coordinators.',
      icon: School,
      role: 'TEACHER' as UserRole,
      targetTab: 'courses-lms' as ActiveTab,
      badge: 'Academic Institutions',
      color: 'border-emerald-200 bg-emerald-50/50',
      tagColor: 'bg-emerald-100 text-emerald-800',
      metrics: [
        { label: 'Curriculum Alignment', value: '100% CEFR' },
        { label: 'Parent Engagement', value: '3.4x' },
        { label: 'Diagnostic Speed', value: 'Instant' },
      ],
      pains: [
        'Disjointed student tracking between morning homeroom and specialized English labs',
        'Lack of standardized CEFR benchmark diagnostics across different grade levels',
        'Difficulties providing parents with concrete evidence of spoken English progress',
      ],
      solutions: [
        'Standardized CEFR A1 to C2 gradebook with benchmark assessment quizzes',
        'Parent portal showing exact session attendance, teacher remarks, and audio logs',
        'CELTA-compliant structured lesson planning tools for department heads',
        'Automated homework grading queues with linguistic error categorizations',
      ],
      cta: 'Explore School Curriculum Engine',
    },
    {
      id: 'teachers',
      slug: 'for-teachers',
      title: 'For Professional English Teachers & Trainers',
      titleAr: 'للمعلمين والمدربين المستقلين',
      subtitle: 'Built for independent IELTS coaches, private language tutors, and freelance educational specialists.',
      icon: GraduationCap,
      role: 'TEACHER' as UserRole,
      targetTab: 'teacher-portal' as ActiveTab,
      badge: 'Educators & Trainers',
      color: 'border-purple-200 bg-purple-50/50',
      tagColor: 'bg-purple-100 text-purple-800',
      metrics: [
        { label: 'Lesson Prep Time', value: '10 Mins' },
        { label: 'Essay Feedback', value: '< 60 Sec' },
        { label: 'Student Satisfaction', value: '98%' },
      ],
      pains: [
        'Spending evening hours grading repetitive IELTS essays instead of teaching',
        'Chasing students over WhatsApp for homework submissions and audio recordings',
        'Looking unprofessional using generic tools like Google Docs and Zoom chats',
      ],
      solutions: [
        'AI Fluency Evaluator providing instant objective IELTS band scores & grammar feedback',
        'CELTA lesson plan generator generating 45/60/90-minute customized plans in seconds',
        'Dedicated student portal where learners submit assignments and review recordings',
        'Personal branded certificate generator to elevate credibility and tutor pricing',
      ],
      cta: 'Open Teacher Productivity Hub',
    },
  ];

  const displayedVerticals =
    selectedVertical === 'all'
      ? verticals
      : verticals.filter((v) => v.id === selectedVertical);

  return (
    <section id="solutions-section" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tailored Industry Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Purpose-Built for Every Educational Organization
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Whether you run a 5-branch language center in Riyadh, an international school English department,
            or an elite independent IELTS coaching studio, MR. FLUENCY SaaS adapts to your workflow.
          </p>
        </div>

        {/* Vertical Cards */}
        <div className="space-y-12">
          {displayedVerticals.map((vert) => {
            const Icon = vert.icon;
            return (
              <div
                key={vert.id}
                id={`solution-${vert.id}`}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${vert.tagColor}`}>
                          {vert.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                          {vert.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-serif">{vert.titleAr}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {vert.subtitle}
                    </p>

                    {/* Problem vs Solution Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                      {/* Pain points */}
                      <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                        <p className="font-bold text-rose-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <span>Without MR. FLUENCY:</span>
                        </p>
                        <ul className="space-y-2 text-rose-800">
                          {vert.pains.map((p, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-rose-500 font-bold">✕</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* With MR. FLUENCY */}
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                        <p className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <span>With MR. FLUENCY SaaS:</span>
                        </p>
                        <ul className="space-y-2 text-emerald-800">
                          {vert.solutions.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleLaunchRole(vert.role, vert.targetTab)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
                      >
                        <span>{vert.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenAuth('register')}
                        className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
                      >
                        Start Free Trial
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Key Operational Metrics */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Measurable Commercial Impact
                    </h4>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      {vert.metrics.map((m, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 block">
                            {m.value}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium leading-tight block mt-1">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Included Out-of-the-Box</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Every tier includes automated server-side backups, localized English/Arabic UI,
                        multi-tenant logical isolation, and full export capabilities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
