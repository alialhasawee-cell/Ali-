import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab, UserRole } from '../../types';
import { api } from '../../services/api';
import {
  X,
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  Heart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  User,
  Globe,
} from 'lucide-react';

export type AuthModalType = 'login' | 'register' | 'demo';

interface AuthModalsProps {
  modalType: AuthModalType | null;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  modalType,
  onClose,
  setActiveTab,
}) => {
  const { switchRole, switchTenant, showToast, refreshSession } = useAuth();

  // Login state
  const [emailInput, setEmailInput] = useState('owner@oxfordgulf.edu');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register state
  const [regData, setRegData] = useState({
    academyName: '',
    academyNameAr: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    country: 'Saudi Arabia',
    plan: 'pro',
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  if (!modalType) return null;

  // Handle Real Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await api.loginWithEmail(emailInput.trim());
      if (res.user) {
        api.setUserId(res.user.id);
        if (res.user.organizationId) {
          api.setTenantId(res.user.organizationId);
        }
        await refreshSession();
        showToast(`Welcome back, ${res.user.fullName}!`, 'success');
        onClose();

        // Direct to appropriate portal
        if (res.user.role === 'SUPER_ADMIN') {
          setActiveTab('super-admin');
        } else if (res.user.role === 'TEACHER') {
          setActiveTab('teacher-portal');
        } else if (res.user.role === 'STUDENT' || res.user.role === 'PARENT') {
          setActiveTab('student-portal');
        } else {
          setActiveTab('admin-dashboard');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle 1-Click Persona Launch (for fast commercial evaluation)
  const handleLaunchPersona = async (role: UserRole, targetTab: ActiveTab, tenantId?: string) => {
    try {
      await switchRole(role, tenantId);
      onClose();
      setActiveTab(targetTab);
    } catch (err: any) {
      showToast(err.message || 'Failed to switch role', 'error');
    }
  };

  // Handle Real Tenant Academy Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.academyName.trim() || !regData.adminEmail.trim() || !regData.adminName.trim()) {
      setRegError('Please fill in Academy Name, Director Name, and Email.');
      return;
    }

    setRegLoading(true);
    setRegError(null);

    try {
      const res = await api.registerTenant(regData);
      if (res.success && res.organization && res.owner) {
        api.setTenantId(res.organization.id);
        api.setUserId(res.owner.id);
        await switchTenant(res.organization.id);
        await switchRole('ORGANIZATION_OWNER', res.organization.id);
        showToast(`Academy "${res.organization.name}" registered successfully!`, 'success');
        onClose();
        setActiveTab('admin-dashboard');
      }
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const demoPersonas = [
    {
      role: 'ORGANIZATION_OWNER' as UserRole,
      tab: 'admin-dashboard' as ActiveTab,
      label: 'Academy Owner / Director',
      badge: 'Director Console',
      email: 'owner@oxfordgulf.edu',
      desc: 'Full operational control: student enrollments, teacher KPI tracking, billing, attendance averages, and revenue analytics.',
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      role: 'TEACHER' as UserRole,
      tab: 'teacher-portal' as ActiveTab,
      label: 'Senior CELTA Teacher',
      badge: 'Instructor Hub',
      email: 'sarah.jenkins@oxfordgulf.edu',
      desc: 'Syllabus delivery, live session attendance marking, homework grading with AI audio feedback, and lesson planning.',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      role: 'STUDENT' as UserRole,
      tab: 'student-portal' as ActiveTab,
      label: 'Enrolled Student',
      badge: 'Student Portal',
      email: 'omar.mansoor@gmail.com',
      desc: 'Active courses, homework submissions, CEFR fluency diagnostics, digital certificates, and attendance record.',
      icon: GraduationCap,
      color: 'from-purple-600 to-indigo-600',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      role: 'SUPER_ADMIN' as UserRole,
      tab: 'super-admin' as ActiveTab,
      label: 'Platform Super Admin',
      badge: 'MR. FLUENCY Global',
      email: 'ali.alhasawee@gmail.com',
      desc: 'Global supervision across all tenant academies, tenant provisioning, system audit logs, and AI credit quotas.',
      icon: ShieldCheck,
      color: 'from-amber-600 to-orange-600',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      role: 'PARENT' as UserRole,
      tab: 'student-portal' as ActiveTab,
      label: 'Parent / Guardian',
      badge: 'Guardian View',
      email: 'parent.mansoor@gmail.com',
      desc: 'Child attendance alerts, CEFR progression milestones, teacher notes, and exam score tracking.',
      icon: Heart,
      color: 'from-rose-600 to-pink-600',
      iconBg: 'bg-rose-100 text-rose-700',
    },
  ];

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
      >
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              MF
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {modalType === 'login' && 'Sign In to MR. FLUENCY SaaS'}
                {modalType === 'register' && 'Register Your Academy / Free Trial'}
                {modalType === 'demo' && 'Try Interactive Commercial Demo'}
              </h3>
              <p className="text-xs text-slate-500 font-serif">
                MR. FLUENCY • أستاذ علي Education Technology Network
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

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* 1. LOGIN MODAL */}
          {modalType === 'login' && (
            <div className="space-y-6">
              {/* Quick Persona Launchers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Instant 1-Click Role Login (Demo Ready)
                  </span>
                  <span className="text-[11px] text-slate-400">Pre-seeded with real data</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {demoPersonas.slice(0, 4).map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.role}
                        onClick={() => handleLaunchPersona(p.role, p.tab)}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-indigo-50/70 hover:border-indigo-300 text-left transition flex items-start gap-3 group"
                      >
                        <div className={`w-8 h-8 rounded-lg ${p.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 truncate">
                              {p.label}
                            </p>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono truncate">{p.email}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium">
                  Or sign in with email credentials
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Standard Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. owner@oxfordgulf.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      defaultValue="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Demo security bypass active: any password accepted for registered emails.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In to Console'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* 2. REGISTER / FREE TRIAL MODAL */}
          {modalType === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <strong>14-Day Free Academy Trial:</strong> Includes 25 student seats, 2 teacher accounts,
                automated attendance, CEFR syllabus templates, and 1,000 server-side AI evaluation credits.
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academy / School Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.academyName}
                    onChange={(e) => setRegData({ ...regData, academyName: e.target.value })}
                    placeholder="e.g. Cambridge Language Institute"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academy Name (Arabic)
                  </label>
                  <input
                    type="text"
                    value={regData.academyNameAr}
                    onChange={(e) => setRegData({ ...regData, academyNameAr: e.target.value })}
                    placeholder="معهد كامبريدج للغات"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-serif text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Director / Admin Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.adminName}
                    onChange={(e) => setRegData({ ...regData, adminName: e.target.value })}
                    placeholder="e.g. Dr. Ahmed Al-Otaibi"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Director Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regData.adminEmail}
                    onChange={(e) => setRegData({ ...regData, adminEmail: e.target.value })}
                    placeholder="director@academy.edu"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+966 50 123 4567"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Target Plan
                  </label>
                  <select
                    value={regData.plan}
                    onChange={(e) => setRegData({ ...regData, plan: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="starter">Starter Trainer ($49/mo)</option>
                    <option value="growth">Growth Center ($149/mo)</option>
                    <option value="pro">Pro Academy ($299/mo) - Recommended</option>
                    <option value="enterprise">Enterprise Network ($799/mo)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {regLoading ? 'Provisioning Isolated Tenant...' : 'Create Academy & Start Free Trial'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  No credit card required for trial. Tenant partition provisioned instantly.
                </p>
              </div>
            </form>
          )}

          {/* 3. TRY DEMO MODAL */}
          {modalType === 'demo' && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-5">
                <h4 className="text-base font-bold text-slate-900">
                  Select a Live Demonstration Persona
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Test the real application with populated courses, students, grading queues, and AI tools.
                </p>
              </div>

              <div className="space-y-3">
                {demoPersonas.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.role}
                      className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-white transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${p.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{p.label}</span>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLaunchPersona(p.role, p.tab)}
                        className="w-full sm:w-auto flex-shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <span>Launch Portal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
