import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActiveTab } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { PublicLandingView } from './views/PublicLandingView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { CoursesLmsView } from './views/CoursesLmsView';
import { ClassesAttendanceView } from './views/ClassesAttendanceView';
import { TeacherPortalView } from './views/TeacherPortalView';
import { StudentPortalView } from './views/StudentPortalView';
import { AiEducationalToolsView } from './views/AiEducationalToolsView';
import { CertificatesView } from './views/CertificatesView';
import { SuperAdminView } from './views/SuperAdminView';
import { TenantSettingsView } from './views/TenantSettingsView';
import { TenantUsersView } from './views/TenantUsersView';
import { StudentManagementView } from './views/StudentManagementView';
import { TeacherManagementView } from './views/TeacherManagementView';
import { AuditLogsView } from './views/AuditLogsView';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('public-site');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-emerald-500 flex items-center justify-center font-extrabold text-xl shadow-xl animate-pulse">
          MF
        </div>
        <div className="text-center">
          <h2 className="text-base font-bold">MR. FLUENCY SaaS</h2>
          <p className="text-xs text-slate-400 font-serif">أستاذ علي • Initializing Tenant Partitions...</p>
        </div>
      </div>
    );
  }

  // If in public landing mode, display the commercial landing page directly
  if (activeTab === 'public-site') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex-1">
          <PublicLandingView setActiveTab={setActiveTab} />
        </main>
      </div>
    );
  }

  // Authenticated Console Layout
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'admin-dashboard' && (
            <AdminDashboardView setActiveTab={setActiveTab} />
          )}
          {activeTab === 'student-management' && <StudentManagementView />}
          {activeTab === 'teacher-management' && <TeacherManagementView />}
          {activeTab === 'tenant-users' && <TenantUsersView />}
          {activeTab === 'courses-lms' && <CoursesLmsView />}
          {activeTab === 'classes-attendance' && <ClassesAttendanceView />}
          {activeTab === 'teacher-portal' && (
            <TeacherPortalView setActiveTab={setActiveTab} />
          )}
          {activeTab === 'student-portal' && (
            <StudentPortalView setActiveTab={setActiveTab} />
          )}
          {activeTab === 'ai-tools' && <AiEducationalToolsView />}
          {activeTab === 'certificates' && <CertificatesView />}
          {activeTab === 'super-admin' && (
            <SuperAdminView setActiveTab={setActiveTab} />
          )}
          {activeTab === 'tenant-settings' && <TenantSettingsView />}
          {activeTab === 'audit-logs' && <AuditLogsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
