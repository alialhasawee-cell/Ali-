import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Award,
  Settings,
  ShieldAlert,
  Server,
  FileCheck2,
  Users,
  Globe,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { activeRole, currentTenant } = useAuth();

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const isSuperAdmin = activeRole === 'SUPER_ADMIN';
  const isOwnerOrAdmin = activeRole === 'ORGANIZATION_OWNER' || activeRole === 'ADMIN' || activeRole === 'MANAGER';
  const isTeacher = activeRole === 'TEACHER';
  const isStudent = activeRole === 'STUDENT' || activeRole === 'PARENT';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 pt-16 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Academy Brand Identity in Sidebar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {isSuperAdmin ? 'Platform Management' : 'Academy Partition'}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-white truncate">
            {isSuperAdmin ? 'MR. FLUENCY Global Network' : currentTenant?.name || 'Academy Hub'}
          </span>
        </div>
        {currentTenant?.nameAr && !isSuperAdmin && (
          <p className="text-[11px] text-slate-400 font-serif mt-0.5 truncate">
            {currentTenant.nameAr}
          </p>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Public Website */}
        <button
          onClick={() => handleSelectTab('public-site')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'public-site'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Public Website & Verification</span>
        </button>

        {/* Super Admin Specific Section */}
        {isSuperAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Super Admin
              </span>
            </div>
            <button
              onClick={() => handleSelectTab('super-admin')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'super-admin'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Multi-Tenant Platform Hub</span>
            </button>
          </>
        )}

        {/* Organization / Academy Operations */}
        {(isOwnerOrAdmin || isSuperAdmin) && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Academy Operations
              </span>
            </div>
            <button
              onClick={() => handleSelectTab('admin-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'admin-dashboard'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Executive Dashboard</span>
            </button>

            <button
              onClick={() => handleSelectTab('student-management')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'student-management'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Student Management</span>
            </button>

            <button
              onClick={() => handleSelectTab('teacher-management')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'teacher-management'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Teacher Management</span>
            </button>

            <button
              onClick={() => handleSelectTab('tenant-users')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'tenant-users'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>User & Staff Management</span>
            </button>

            <button
              onClick={() => handleSelectTab('courses-lms')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'courses-lms'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Courses & Curriculum (LMS)</span>
            </button>

            <button
              onClick={() => handleSelectTab('classes-attendance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'classes-attendance'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Batches & Live Attendance</span>
            </button>
          </>
        )}

        {/* Dedicated Teacher Navigation for Faculty */}
        {isTeacher && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Teacher Workspace
              </span>
            </div>
            <button
              onClick={() => handleSelectTab('teacher-portal')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'teacher-portal'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Teacher Dashboard</span>
            </button>
            <button
              onClick={() => handleSelectTab('classes-attendance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'classes-attendance'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>My Classes & Attendance</span>
            </button>
            <button
              onClick={() => handleSelectTab('courses-lms')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'courses-lms'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Assigned Courses</span>
            </button>
            <button
              onClick={() => handleSelectTab('student-management')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'student-management'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Assigned Students</span>
            </button>
          </>
        )}

        {/* Teacher Workflows for Admin / SuperAdmin */}
        {!isTeacher && (isOwnerOrAdmin || isSuperAdmin) && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Instruction & Grading
              </span>
            </div>
            <button
              onClick={() => handleSelectTab('teacher-portal')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'teacher-portal'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Teacher Workspace & Grading</span>
            </button>
          </>
        )}

        {/* Student Workflows */}
        {(isStudent || isOwnerOrAdmin || isSuperAdmin) && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Learner Experience
              </span>
            </div>
            <button
              onClick={() => handleSelectTab('student-portal')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'student-portal'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Student Learning Portal</span>
            </button>
          </>
        )}

        {/* AI Educational Tools Suite */}
        <div className="pt-3 pb-1 px-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            AI Intelligence
          </span>
        </div>
        <button
          onClick={() => handleSelectTab('ai-tools')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'ai-tools'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>AI Educational Studio</span>
        </button>

        {/* Certificates */}
        <button
          onClick={() => handleSelectTab('certificates')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'certificates'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-yellow-400" />
          <span>Certificates & Verification</span>
        </button>

        {/* Administration, Settings, Audit */}
        {(isOwnerOrAdmin || isSuperAdmin) && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Governance & Security
              </span>
            </div>

            <button
              onClick={() => handleSelectTab('tenant-settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'tenant-settings'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Academy Settings & Branding</span>
            </button>

            <button
              onClick={() => handleSelectTab('audit-logs')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'audit-logs'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Security & Audit Trail</span>
            </button>
          </>
        )}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>MR. FLUENCY</span>
          <span className="text-indigo-400 font-bold">Phase 0 Core</span>
        </div>
        <p className="text-[10px] text-slate-600">Enterprise Multi-Tenancy Architecture</p>
      </div>
    </aside>
  );
};
