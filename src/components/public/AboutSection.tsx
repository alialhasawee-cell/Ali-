import React from 'react';
import {
  GraduationCap,
  Award,
  Globe,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pedagogical Heritage & Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Story of MR. FLUENCY & أستاذ علي
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Bridging international language pedagogy with modern cloud SaaS engineering to empower
            trainers and academies across the Middle East and worldwide.
          </p>
        </div>

        {/* Founder & Vision Story */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white shadow-xl">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-400 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg mb-4">
                MF
              </div>
              <h3 className="text-xl font-bold text-white">Mr. Ali Al-Hasawee</h3>
              <p className="text-xs text-indigo-300 font-serif text-lg mt-0.5">أستاذ علي</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Founder, Senior English Pedagogist & EdTech Architect
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 w-full space-y-2 text-left text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>15+ Years Language Training & CELTA Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Trained 25,000+ Gulf Students & Teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Pioneer in AI-Assisted CEFR Diagnostics</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-slate-700 text-sm leading-relaxed">
              <h4 className="text-2xl font-bold text-slate-900">
                Why Generic Educational Software Failed Language Centers
              </h4>
              <p>
                For over a decade, language training centers and English academies in Saudi Arabia, the UAE,
                and throughout the Gulf region were forced to run on generic tools: Google Spreadsheets for
                attendance, WhatsApp groups for homework, and unverified PDF templates for certificates.
              </p>
              <p>
                Generic learning management systems (LMS) lacked what language educators needed most:
                objective <strong>CEFR linguistic rubrics</strong>, automated <strong>IELTS band evaluations</strong>,
                structured <strong>CELTA lesson planning frameworks</strong>, and tamper-proof verification registries.
              </p>
              <p>
                <strong className="text-slate-900">MR. FLUENCY SaaS</strong> was created to solve this specific
                disconnect. By uniting multi-tenant operational management with server-side artificial intelligence
                tuned for English language acquisition, we give every academy director and teacher a commercial-grade
                operating system.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Our Mission</strong>
                  <span className="text-slate-600">
                    To elevate the operational efficiency and pedagogical quality of every English academy through accessible, intelligent SaaS.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Our Guarantee</strong>
                  <span className="text-slate-600">
                    Strict data sovereignty, zero student data commercialization, and 99.9% reliable uptime.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Educational Engineering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="font-bold text-slate-900 text-base">CEFR Benchmark Core</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every course module, quiz, and test is architected according to European Common Framework (A1-C2) standards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="font-bold text-slate-900 text-base">Native Regional Design</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bilingual English and Arabic interfaces crafted natively for Gulf institutions, staff, students, and parents.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="font-bold text-slate-900 text-base">Server-Side AI Trust</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI models run behind secure server endpoints with guarded prompts. Student audio & essays are never exposed or reused.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              04
            </div>
            <h4 className="font-bold text-slate-900 text-base">Verifiable Integrity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminate diploma mill fraud with cryptographically verified digital credentials issued directly to the public registry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
