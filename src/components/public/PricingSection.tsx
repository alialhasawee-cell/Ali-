import React, { useState } from 'react';
import { ActiveTab } from '../../types';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface PricingSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (type: 'login' | 'register' | 'demo') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  setActiveTab,
  onOpenAuth,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [currency, setCurrency] = useState<'USD' | 'SAR'>('USD');

  // Currency multiplier: 1 USD ~ 3.75 SAR
  const rate = currency === 'SAR' ? 3.75 : 1;
  const currencySymbol = currency === 'SAR' ? 'SAR ' : '$';

  const formatPrice = (baseMonthlyUsd: number) => {
    let price = baseMonthlyUsd;
    if (billingCycle === 'annual') {
      price = Math.round(price * 0.8); // 20% discount on annual
    }
    const converted = Math.round(price * rate);
    return `${currencySymbol}${converted}`;
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Trainer',
      nameAr: 'مدرب مبتدئ',
      desc: 'Ideal for independent tutors, IELTS coaches, and private tutoring studios.',
      baseUsd: 49,
      popular: false,
      badge: 'Independent Educator',
      features: [
        'Up to 50 active students',
        '1 teacher / coach seat',
        'CEFR Course Builder & Syllabus',
        'Digital Attendance Register',
        'Student Homework Submission Hub',
        '500 Gemini AI Evaluation Credits / mo',
        'Basic Certificate Generation',
        'Email Support (24h turnaround)',
      ],
      buttonText: 'Start Starter Trial',
      buttonStyle: 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300',
    },
    {
      id: 'growth',
      name: 'Growth Center',
      nameAr: 'مركز واعد',
      desc: 'For growing language institutes, exam prep centers, and medium academies.',
      baseUsd: 149,
      popular: false,
      badge: 'Emerging Center',
      features: [
        'Up to 250 active students',
        '5 teacher & staff seats',
        'Batch Class Scheduler & QR Attendance',
        'Automated Parent Absence Alerts',
        '2,500 Gemini AI Evaluation Credits / mo',
        'Verifiable Digital Certificate Registry',
        'Teacher Grading & Diagnostic Queues',
        'Audit Logs & Attendance Analytics',
        'Priority Regional Support',
      ],
      buttonText: 'Start Growth Trial',
      buttonStyle: 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300',
    },
    {
      id: 'pro',
      name: 'Pro Academy',
      nameAr: 'أكاديمية احترافية',
      desc: 'Our flagship plan for established language schools and training centers.',
      baseUsd: 299,
      popular: true,
      badge: 'Most Popular',
      features: [
        'Up to 1,000 active students',
        '25 teacher & administrator seats',
        'Custom Academy Subdomain (e.g. oxford.mrfluency.com)',
        'Custom Branding, Seal & Color Theme',
        '10,000 Gemini AI Evaluation Credits / mo',
        'CELTA 5-Stage Automated Lesson Planner',
        'CEFR Speaking & Essay Diagnostic Rubric',
        'Bilingual English & Arabic Student Portal',
        'Dedicated Tenant Database Partition',
        'Priority Phone & WhatsApp Support',
      ],
      buttonText: 'Start 14-Day Pro Trial',
      buttonStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Network',
      nameAr: 'شبكة مؤسسية',
      desc: 'For multi-branch academy networks, bilingual schools, and government institutes.',
      baseUsd: 799,
      popular: false,
      badge: 'Multi-Branch',
      features: [
        'Unlimited student accounts & batches',
        '100+ teacher & department head seats',
        'Multi-Branch Centralized Management Console',
        'Consolidated Super Admin Analytics',
        '50,000+ Gemini AI Evaluation Credits / mo',
        'Custom API Access & Webhook Integrations',
        'Custom Certificate Templates & Signatures',
        'Dedicated Enterprise Success Manager',
        '99.9% Uptime SLA & Custom Data Sovereignty',
      ],
      buttonText: 'Contact Enterprise Sales',
      buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
  ];

  return (
    <section id="pricing-section" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Transparent Commercial Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Invest in Pedagogical & Operational Excellence
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Predictable subscriptions with zero hidden student charges. Includes full multi-tenant isolation,
            AI fluency diagnostics, and verified certificates.
          </p>

          {/* Controls: Billing Cycle & Currency Switchers */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full ${
                  billingCycle === 'annual' ? 'bg-indigo-700 text-amber-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Save 20%
                </span>
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currency === 'USD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('SAR')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currency === 'SAR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                SAR (ر.س)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'border-2 border-indigo-600 bg-white shadow-xl shadow-indigo-100 lg:-translate-y-2'
                  : 'border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular for Academies
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                  {plan.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{plan.name}</h3>
                <p className="text-[11px] text-slate-500 font-serif">{plan.nameAr}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[36px]">
                  {plan.desc}
                </p>

                {/* Price Display */}
                <div className="mt-6 border-t border-slate-200/80 pt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {formatPrice(plan.baseUsd)}
                    </span>
                    <span className="text-xs text-slate-500 font-normal">/ month</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {billingCycle === 'annual' ? 'Billed annually with 20% discount' : 'Billed month-to-month'}
                  </p>
                </div>

                {/* Feature Checklist */}
                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => onOpenAuth('register')}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${plan.buttonStyle}`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Guarantee Note */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900">All subscriptions include 14-day free trial</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                No credit card required. Cancel or upgrade anytime with immediate data export.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('demo')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap"
          >
            Want to test all features first? Launch Demo →
          </button>
        </div>
      </div>
    </section>
  );
};
