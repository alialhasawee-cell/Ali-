import React from 'react';
import { Star, Award, Building2, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Tariq Al-Ghamdi',
      nameAr: 'د. طارق الغامدي',
      role: 'Managing Director',
      institution: 'Oxford Gulf Language Institute (Riyadh)',
      quote:
        'Switching to MR. FLUENCY SaaS eliminated 3 separate subscriptions. Our attendance tracking is now 100% auditable, our parents receive instant notifications, and issuing verifiable certificates with institutional seals increased our course re-enrollment by 34%.',
      metric: '34% Increase in Re-enrollments',
      rating: 5,
    },
    {
      name: 'Sarah Jenkins, CELTA',
      nameAr: 'سارة جنكينز (مدربة معتمدة)',
      role: 'Head of IELTS & CEFR Pedagogy',
      institution: 'Cambridge Prep Center (Dubai)',
      quote:
        'The server-side Gemini AI Fluency Evaluator is a pedagogical revelation. My students get instant, objective CEFR band breakdowns for speaking and writing tasks, freeing me up to coach higher-level rhetorical fluency. The CELTA lesson planner cuts my preparation time by 60%.',
      metric: '60% Faster Lesson Planning',
      rating: 5,
    },
    {
      name: 'Omar Al-Mansoor',
      nameAr: 'عمر المنصور',
      role: 'Graduate Student (Achieved 7.5 Band)',
      institution: 'Enrolled IELTS Candidate',
      quote:
        'The student hub is incredibly smooth. I submitted all my essays and speaking audios directly through the portal. When applying for my UK university visa, the admissions office verified my MR. FLUENCY digital certificate in seconds using the public registry code.',
      metric: 'Instant University Visa Verification',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-semibold mb-3">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Proven Institutional Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Academy Leaders, Teachers & Students
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            See how educational centers across the Middle East use MR. FLUENCY SaaS (أستاذ علي)
            to elevate teaching standards and streamline administrative operations.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/80 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.metric}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 font-serif">{t.nameAr}</p>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">{t.role}</p>
                  <p className="text-[11px] text-slate-500">{t.institution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
