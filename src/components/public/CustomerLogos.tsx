import React from 'react';
import { Building2, Award, GraduationCap, Globe, ShieldCheck } from 'lucide-react';

export const CustomerLogos: React.FC = () => {
  const institutions = [
    {
      name: 'Oxford Gulf Institute',
      nameAr: 'معهد أكسفورد الخليج',
      type: 'Language Academy',
      icon: Building2,
    },
    {
      name: 'Cambridge Prep Center',
      nameAr: 'مركز كامبريدج للتحضير',
      type: 'IELTS / CEFR Training',
      icon: Award,
    },
    {
      name: 'Riyadh English College',
      nameAr: 'كلية الرياض للغة الإنجليزية',
      type: 'Higher Education',
      icon: GraduationCap,
    },
    {
      name: 'Emirates Training Hub',
      nameAr: 'مركز الإمارات للتدريب',
      type: 'Corporate Institute',
      icon: Globe,
    },
    {
      name: 'Al-Faisal Bilingual School',
      nameAr: 'مدرسة الفيصل ثنائية اللغة',
      type: 'K-12 Academy',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-12 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          Trusted by Premier Language Academies & Training Institutes Across the GCC
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {institutions.map((inst, idx) => {
            const Icon = inst.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800 transition flex items-center gap-3 text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                    {inst.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-serif truncate">{inst.nameAr}</p>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block mt-0.5">
                    {inst.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
