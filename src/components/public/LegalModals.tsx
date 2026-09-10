import React from 'react';
import { X, ShieldCheck, FileText, Lock, Globe, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="legal-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {type === 'privacy' ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {type === 'privacy' ? 'Privacy Policy & Student Data Protection' : 'Terms of Service & SaaS Agreement'}
              </h3>
              <p className="text-xs text-slate-500 font-serif">
                MR. FLUENCY SaaS (أستاذ علي) • Effective Date: January 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-950 font-medium">
                  <strong>Commitment to Educational Sovereignty:</strong> MR. FLUENCY SaaS enforces
                  strict logical tenant data isolation. Neither student profiles, grades, nor AI audio transcripts
                  are ever shared, mixed with other academy tenants, or sold to third parties.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">1. Scope and Multi-Tenant Isolation</h4>
                <p>
                  This Privacy Policy applies to all services, portals, and APIs provided by MR. FLUENCY (أستاذ علي)
                  to educational institutions, including language training centers, schools, and independent educators.
                  Every registered academy operates under its own isolated partition scoped by an immutable organization identifier.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">2. Student & Minor Data Safeguards (FERPA / COPPA / GDPR)</h4>
                <p>
                  For student accounts created by educational organizations, we act strictly as a Data Processor.
                  Parental accounts have explicit visibility into student attendance records, homework submissions, and
                  teacher feedback. Student personal identifiers are encrypted at rest using AES-256 and in transit via TLS 1.3.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">3. Artificial Intelligence & Pedagogical Processing</h4>
                <p>
                  Our server-side AI evaluation engines (powered by enterprise Gemini models) analyze submitted English
                  speaking audio and writing essays strictly to produce CEFR band evaluations, grammar diagnostic logs, and
                  pronunciation feedback. Student input data is never used to train public foundational models.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">4. Digital Certificate Verification Registry</h4>
                <p>
                  Certificates issued by accredited institutions on MR. FLUENCY are published to the public registry with
                  the student&apos;s explicit consent or their institution&apos;s accreditation mandate. Public lookups verify only
                  the student name, course title, issuing academy, date, and grade.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">5. Data Retention & Tenant Export</h4>
                <p>
                  Academy owners maintain full ownership of their institutional data. At any time, owners can request a
                  full encrypted export of courses, attendance history, student rosters, and audit trails.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-950 font-medium">
                  <strong>Commercial SaaS Service Level Agreement:</strong> 99.9% platform availability,
                  automated daily data backups, and dedicated priority support for Pro Academy & Enterprise tiers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">1. Acceptance of Terms</h4>
                <p>
                  By creating an account, registering a training center, or accessing any MR. FLUENCY SaaS portal,
                  you agree to be bound by these Terms of Service between your entity and MR. FLUENCY (أستاذ علي)
                  Education Technology.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">2. Subscription Tiers & Billing</h4>
                <p>
                  Subscription fees are billed monthly or annually as selected during registration. Plans include
                  designated quotas for student accounts, teacher seats, and server-side AI evaluation credits.
                  Upgrades take effect immediately; overage credits can be provisioned via the tenant billing console.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">3. Institutional Responsibility</h4>
                <p>
                  Institutions are responsible for maintaining the confidentiality of their teacher and student credentials.
                  The Super Admin and Tenant Owner retain authority to provision and revoke sub-roles (Staff, Teachers,
                  Students, Parents).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">4. Intellectual Property & Curricula</h4>
                <p>
                  All proprietary learning materials, custom courses, and assignments uploaded by your institution remain
                  your sole intellectual property. MR. FLUENCY grants a non-exclusive license to use the platform software,
                  CELTA lesson planner frameworks, and certificate generators.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">5. Termination & Data Portability</h4>
                <p>
                  Either party may terminate the subscription with 30 days notice. Upon termination, tenant administrators
                  have 60 days to download all student records, gradebooks, and certificate ledgers in standard JSON/CSV formats.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Compliance: GCC, EU-GDPR, FERPA</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <LegalModal type="privacy" onClose={onClose} />;
};

export const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <LegalModal type="terms" onClose={onClose} />;
};

