import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';

interface FaqSectionProps {
  onOpenContact?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenContact }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs = [
    {
      category: 'onboarding',
      question: 'How quickly can our academy go live on MR. FLUENCY SaaS?',
      answer:
        'Your dedicated multi-tenant partition is provisioned instantly upon completing the registration form. You can immediately import your existing student roster via CSV/Excel, create batch class schedules, and assign teachers within 15 minutes. Pre-seeded CEFR course templates are ready to use out of the box.',
    },
    {
      category: 'security',
      question: 'How does multi-tenant data isolation work? Can other academies see our data?',
      answer:
        'Every academy is assigned a strictly isolated cryptographic tenant identifier. All database operations, student gradebooks, attendance logs, and financial records are partitioned at the database query layer. Under no circumstances can one academy view, query, or leak records from another tenant.',
    },
    {
      category: 'ai',
      question: 'How accurate is the AI Fluency Evaluator for CEFR and IELTS band scores?',
      answer:
        'Our evaluation engine utilizes fine-tuned server-side Gemini 3.8-flash models calibrated against official IELTS Speaking/Writing band descriptors and the Common European Framework (A1 to C2). It evaluates Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation with comprehensive diagnostic feedback.',
    },
    {
      category: 'security',
      question: 'Are student audio recordings and essay submissions used to train public AI models?',
      answer:
        'No. Under our strict educational enterprise agreement, all data submitted through MR. FLUENCY SaaS is processed confidentially in zero-data-retention server pipelines. Student inputs are never used to train public foundational AI models, preserving full FERPA and GDPR compliance.',
    },
    {
      category: 'certificates',
      question: 'How does the Public Certificate Verification Registry work?',
      answer:
        'Whenever an academy issues a certificate of completion, an immutable record is generated with a unique verification code (e.g. MF-OXF-2026-8841) and institutional security seal. Anyone—including prospective employers, universities, and government ministries—can visit the public registry to verify student identity, course hours, and grade in real time.',
    },
    {
      category: 'billing',
      question: 'Can we switch between monthly and annual plans? What payment methods are supported?',
      answer:
        'Yes. You can upgrade, downgrade, or switch between monthly and annual billing (with a 20% discount) anytime via your Academy Settings console. We accept all major corporate credit cards, Mada (Saudi Arabia), Apple Pay, and wire transfer invoicing for Enterprise annual contracts.',
    },
    {
      category: 'pedagogy',
      question: 'What is the CELTA 5-Stage Lesson Planner tool?',
      answer:
        'Our teacher tools include an automated Cambridge CELTA-compliant lesson planner. Teachers simply input the target grammar point or topic, level (e.g. B1 Intermediate), and duration (45/60/90 mins), and the AI structures the lesson through the 5 standard stages: Lead-in, Clarification (MFP: Meaning, Form, Pronunciation), Controlled Practice, Free Practice, and Feedback.',
    },
    {
      category: 'onboarding',
      question: 'Does MR. FLUENCY support parent and guardian communication?',
      answer:
        'Yes. Parents receive dedicated logins or SMS notifications allowing them to monitor attendance in real time, view absence alerts, check homework submission grades, and read teacher feedback in their preferred language (English or Arabic).',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'onboarding', label: 'Onboarding & Setup' },
    { id: 'security', label: 'Security & Isolation' },
    { id: 'ai', label: 'AI & Diagnostics' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'billing', label: 'Pricing & Billing' },
  ];

  const filteredFaqs =
    activeCategory === 'all'
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <section id="faq-section" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Everything you need to know about MR. FLUENCY SaaS operations, data security, and pedagogy.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isOpen
                    ? 'border-indigo-300 bg-indigo-50/20 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-indigo-100/60 pt-3 animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-slate-900 text-sm">Have a custom question or multi-branch inquiry?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Our educational solutions consultants in Riyadh and Dubai are available to help.
            </p>
          </div>
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Educational Advisory</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
