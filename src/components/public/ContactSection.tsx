import React, { useState } from 'react';
import { api } from '../../services/api';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institutionName: '',
    institutionType: 'Language Academy / Training Center',
    interestedIn: 'Request Live Guided Demo',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    ticketId: string;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMsg('Please provide your name and email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.submitContactInquiry(formData);
      if (res.success) {
        setSuccessResult({
          ticketId: res.ticketId,
          message: res.message,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>Educational Advisory & Institutional Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Schedule a Consultation or Request a Demo
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Our educational SaaS architects in Riyadh and Dubai are on standby to discuss your academy’s
            curricula, batch schedules, AI capacity needs, and data migration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            {successResult ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Inquiry Received!</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs text-slate-600 font-mono">
                  Ticket Reference ID: <strong className="text-indigo-600 font-bold">{successResult.ticketId}</strong>
                </div>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {successResult.message}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSuccessResult(null);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        institutionName: '',
                        institutionType: 'Language Academy / Training Center',
                        interestedIn: 'Request Live Guided Demo',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Dr. Sultan Al-Harbi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sultan@academy.edu.sa"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 55 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Academy / School Name
                    </label>
                    <input
                      type="text"
                      value={formData.institutionName}
                      onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                      placeholder="e.g. Riyadh Language Institute"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institution Type
                    </label>
                    <select
                      value={formData.institutionType}
                      onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option>Language Academy / Training Center</option>
                      <option>IELTS / TOEFL Prep Hub</option>
                      <option>K-12 Bilingual / Private School</option>
                      <option>University / Higher Education</option>
                      <option>Independent English Teacher / Coach</option>
                      <option>Multi-Branch Corporate Franchise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Interested In
                    </label>
                    <select
                      value={formData.interestedIn}
                      onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option>Request Live Guided Demo</option>
                      <option>Enterprise Multi-Branch Pricing</option>
                      <option>Data Migration from Existing LMS</option>
                      <option>Custom AI Model Calibration</option>
                      <option>General Product Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message / Current Operational Challenges
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your student volume, current tools, and key requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Submitting Inquiry...' : 'Submit Inquiry to Educational Advisory'}</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Guaranteed response within 4 business hours. Confidential NDA protection.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Institutional Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block mb-1">
                  Global Headquarters & Hubs
                </span>
                <h3 className="text-xl font-bold">MR. FLUENCY Technology Centers</h3>
                <p className="text-xs text-slate-400 font-serif mt-0.5">شبكة أستاذ علي العالمية</p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-800 space-y-1">
                  <p className="font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Riyadh, Saudi Arabia (MENA HQ)</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">King Fahd Road, Al-Olaya District, Riyadh</p>
                  <p className="text-slate-400 text-[11px]">Direct Support: +966 50 123 4567</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-800 space-y-1">
                  <p className="font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Dubai, United Arab Emirates</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">Dubai Knowledge Park, Block 2B, Dubai</p>
                  <p className="text-slate-400 text-[11px]">Direct Support: +971 4 234 5678</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-800 space-y-1">
                  <p className="font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>London, United Kingdom</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">Holborn Academic Quarter, London WC1V</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Support Hours: Sunday – Thursday (8:00 AM – 8:00 PM AST)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Business hotline available 24/7 for Pro and Enterprise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
