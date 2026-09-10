import React, { useState } from 'react';
import { api } from '../../services/api';
import {
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  GraduationCap,
} from 'lucide-react';

export const CertificateVerificationSection: React.FC = () => {
  const [certCode, setCertCode] = useState('MF-OXF-2026-8841');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;
    setVerifying(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.verifyCertificate(certCode.trim());
      if (res.valid) {
        setResult(res);
      } else {
        setError(res.message || 'Certificate verification failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid certificate code. Please check and try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <section id="cert-registry-tool" className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 -mt-8 mb-16">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Public Digital Certificate Verification Registry
              </h3>
              <p className="text-xs text-slate-500 font-serif">
                سجل التحقق من الشهادات الرقمية • Institutional Credential Lookup
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Global Registry
          </span>
        </div>

        <form onSubmit={handleVerify} className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={certCode}
              onChange={(e) => setCertCode(e.target.value)}
              placeholder="Enter Certificate Code (e.g. MF-OXF-2026-8841)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800"
            />
          </div>
          <button
            type="submit"
            disabled={verifying}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verifying ? 'Verifying...' : 'Verify Credential'}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-2">
          Try pre-seeded credential: <code className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer" onClick={() => setCertCode('MF-OXF-2026-8841')}>MF-OXF-2026-8841</code> (Omar Al-Mansoor)
        </p>

        {/* Verified Result Card */}
        {result && (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-900 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Authentic Certificate Verified (MR. FLUENCY Certified)</span>
              </div>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Seal: {result.securitySeal}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Student
                </span>
                <strong className="text-slate-900 text-sm mt-0.5 block">
                  {result.certificate.studentName}
                </strong>
                {result.certificate.studentNameAr && (
                  <span className="text-[11px] text-slate-500 font-serif block mt-0.5">
                    {result.certificate.studentNameAr}
                  </span>
                )}
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Course & CEFR Level
                </span>
                <strong className="text-slate-900 text-sm mt-0.5 block">
                  {result.certificate.courseTitle}
                </strong>
                <span className="text-[11px] text-indigo-600 font-bold block mt-0.5">
                  CEFR: {result.certificate.cefrLevel || 'B2-C1'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" /> Issuing Academy
                </span>
                <strong className="text-slate-900 text-sm mt-0.5 block">
                  {result.certificate.organizationName}
                </strong>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  Verified Accredited Partner
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Grade & Issue Date
                </span>
                <strong className="text-emerald-700 text-sm mt-0.5 block">
                  Grade {result.certificate.grade}
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Issued: {result.certificate.issueDate}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Card */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </section>
  );
};
