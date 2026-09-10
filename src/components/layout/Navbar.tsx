import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, ActiveTab } from '../../types';
import {
  Building2,
  UserCheck,
  Globe,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const {
    currentUser,
    currentTenant,
    availableTenants,
    activeRole,
    switchRole,
    switchTenant,
  } = useAuth();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Platform Super Admin', desc: 'Global platform supervision' },
    { role: 'ORGANIZATION_OWNER', label: 'Academy Owner / Director', desc: 'Academy KPIs & management' },
    { role: 'TEACHER', label: 'Senior Teacher', desc: 'Classes, attendance & grading' },
    { role: 'STUDENT', label: 'Enrolled Student', desc: 'LMS courses, homework & quizzes' },
    { role: 'PARENT', label: 'Parent / Guardian', desc: 'Student progress & attendance' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setActiveTab('public-site')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                MF
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                    MR. FLUENCY
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded font-semibold border border-indigo-200/60 hidden sm:inline-block">
                    SaaS
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium font-serif tracking-wide">
                  أستاذ علي / Education Cloud
                </span>
              </div>
            </div>
          </div>

          {/* Center: Tenant Data Isolation Switcher */}
          <div className="hidden md:flex items-center gap-2">
            {activeRole !== 'SUPER_ADMIN' && (
              <div className="relative">
                <button
                  onClick={() => {
                    setTenantDropdownOpen(!tenantDropdownOpen);
                    setRoleDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition"
                  title="Switch tenant to test isolated database partitions"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium max-w-[150px] truncate">
                    {currentTenant?.name || 'Loading Tenant...'}
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">
                    Tenant
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {tenantDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Active Tenant (Data Isolation)
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Each organization has strictly separated students, courses & revenue.
                      </p>
                    </div>

                    <div className="mt-1">
                      {availableTenants.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            if (t.id) switchTenant(t.id);
                            setTenantDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex flex-col hover:bg-slate-50 transition ${
                            currentTenant?.id === t.id ? 'bg-blue-50/70' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{t.name}</span>
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {t.plan}
                            </span>
                          </div>
                          {t.nameAr && (
                            <span className="text-[11px] text-slate-500 font-serif">{t.nameAr}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Public Website Shortcut */}
            <button
              onClick={() => setActiveTab('public-site')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'public-site'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Landing</span>
            </button>
          </div>

          {/* Right: Interactive Role Persona Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setTenantDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-xs text-indigo-900 transition shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold leading-tight">
                    {activeRole.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-indigo-600/80 leading-none truncate max-w-[120px]">
                    {currentUser?.fullName || 'User'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-indigo-500 ml-1" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Interactive Demo Personas
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Experience MR. FLUENCY SaaS from any role perspective:
                    </p>
                  </div>

                  <div className="py-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-indigo-50/70 transition ${
                          activeRole === r.role ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <ShieldCheck
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            activeRole === r.role ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-medium">{r.label}</p>
                          <p className="text-[10px] text-slate-400">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
