import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardStats, ActiveTab, OrganizationNotification } from '../types';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Plus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Bell,
  RotateCcw,
  Play,
  Layers,
  Check,
  Building2,
  Briefcase,
  FolderOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface AdminDashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

const ATTENDANCE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];
const CEFR_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#6366f1', '#8b5cf6', '#ec4899'];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ setActiveTab }) => {
  const { currentTenant, refreshSession, showToast } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [resettingDemo, setResettingDemo] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [currentTenant?.id]);

  const handleSeedDemo = async () => {
    try {
      setSeedingDemo(true);
      const res = await api.seedDemoData();
      setStats(res.stats);
      await refreshSession();
      showToast('Showcase demonstration dataset loaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to seed demonstration data', 'error');
    } finally {
      setSeedingDemo(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset organization data to clean state? All courses, classes, and demo students will be cleared.')) {
      return;
    }
    try {
      setResettingDemo(true);
      const res = await api.resetOrganizationData();
      setStats(res.stats);
      await refreshSession();
      showToast('Organization reset to clean state.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset organization data', 'error');
    } finally {
      setResettingDemo(false);
    }
  };

  const isEmptyState =
    !loading &&
    stats &&
    stats.totalStudents === 0 &&
    stats.activeCourses === 0 &&
    stats.activeBatches === 0;

  // Pie chart data for attendance breakdown
  const attendancePieData = stats?.attendanceBreakdown
    ? [
        { name: 'Present', value: stats.attendanceBreakdown.present },
        { name: 'Late', value: stats.attendanceBreakdown.late },
        { name: 'Absent', value: stats.attendanceBreakdown.absent },
        { name: 'Excused', value: stats.attendanceBreakdown.excused },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* 1. Tenant Partition & Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
              Tenant Partition: {currentTenant?.slug || 'active'}
            </span>
            <span className="text-xs font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {currentTenant?.plan || 'pro'} tier
            </span>
            <span className="text-xs text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
              Cur: <strong className="text-slate-700">{currentTenant?.currency || 'SAR'}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            {currentTenant?.name || 'Academy Administration'}
          </h1>
          {currentTenant?.nameAr && (
            <p className="text-sm font-serif text-slate-500 mt-0.5" dir="rtl">
              {currentTenant.nameAr}
            </p>
          )}
        </div>

        {/* Action Controls & Demonstration Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSeedDemo}
            disabled={seedingDemo}
            className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
            title="Load realistic demonstration courses, students, attendance, and revenue data for presentations"
          >
            <Play className="w-3.5 h-3.5 fill-indigo-600" />
            <span>{seedingDemo ? 'Loading Demo...' : 'Load Demo Data'}</span>
          </button>

          <button
            onClick={handleResetData}
            disabled={resettingDemo}
            className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
            title="Reset organization back to empty state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resettingDemo ? 'Resetting...' : 'Reset to Empty'}</span>
          </button>

          <button
            onClick={() => setActiveTab('student-management')}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Management</span>
          </button>

          <button
            onClick={() => setActiveTab('tenant-users')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => setActiveTab('classes-attendance')}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Take Attendance</span>
          </button>
        </div>
      </div>

      {/* 2. Multi-Tenancy Data Isolation Notice Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-4 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Tenant Data Isolation Enforced:</strong> Operating under{' '}
            <span className="underline font-bold text-blue-200">{currentTenant?.name}</span>.
            Students, faculty records, tuition volume, and academic submissions are encrypted and isolated per tenant.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tenant-settings')}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap"
          >
            Organization Settings
          </button>
        </div>
      </div>

      {/* 3. Empty State Presentation (If organization is brand new or reset) */}
      {isEmptyState && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-extrabold text-slate-900">
              Welcome to Your New Organization Hub
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your tenant partition is initialized and completely isolated. Start by configuring your academic setup, or immediately load our comprehensive customer demonstration dataset to preview real analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleSeedDemo}
              disabled={seedingDemo}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{seedingDemo ? 'Populating Demonstration Data...' : 'Load Showcase Demonstration Data'}</span>
            </button>
            <button
              onClick={() => setActiveTab('courses-lms')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Course</span>
            </button>
            <button
              onClick={() => setActiveTab('tenant-users')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Users className="w-4 h-4" />
              <span>Enroll First Student</span>
            </button>
          </div>

          {/* Quick Setup Checklist */}
          <div className="max-w-2xl mx-auto pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">1. Institutional Brand</span>
              <p className="text-slate-500 text-[11px]">
                Set official logo, bilingual name, contact info, and grading rules.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">2. Faculty & Courses</span>
              <p className="text-slate-500 text-[11px]">
                Add certified teachers, publish course syllabi, and set CEFR levels.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">3. Classes & Credentials</span>
              <p className="text-slate-500 text-[11px]">
                Create batch schedules, track live attendance, and issue certificates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Complete Metric KPI Cards Grid (10 Core Dimensions Requested) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1: Students */}
        <div
          onClick={() => setActiveTab('student-management')}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Students</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalStudents || 0}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {stats?.activeStudents || 0} active
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
            <div
              className="bg-blue-600 h-1 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  (((stats?.totalStudents || 0) / (currentTenant?.studentLimit || 500)) * 100)
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Teachers */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Teachers / Faculty</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalTeachers || 0}
            </span>
            <span className="text-[10px] text-slate-400">instructors</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Certified ESL / IELTS</p>
        </div>

        {/* Metric 3: Courses */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Active Courses</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.activeCourses || 0}
            </span>
            <span className="text-[10px] text-slate-400">published</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">A1 to C2 Curricula</p>
        </div>

        {/* Metric 4: Batches & Classes */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Active Batches</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.activeBatches || 0}
            </span>
            <span className="text-[10px] text-slate-400">cohorts</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Live class schedules</p>
        </div>

        {/* Metric 5: Attendance Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Attendance Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : `${stats?.attendanceRate || 0}%`}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">overall</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {stats?.totalSessionsHeld || 0} sessions held
          </p>
        </div>

        {/* Metric 6: Homework & Submissions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Homework & Tasks</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalHomework || 0}
            </span>
            <span className="text-[10px] text-amber-600 font-bold">
              {stats?.pendingGradingCount || 0} pending
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {stats?.totalSubmissions || 0} submissions
          </p>
        </div>

        {/* Metric 7: Exams & Quizzes */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Quizzes & Exams</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalExams || 0}
            </span>
            <span className="text-[10px] text-violet-600 font-bold">
              {stats?.averageExamScore ? `${stats.averageExamScore}% avg` : 'N/A'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {stats?.totalExamAttempts || 0} attempts taken
          </p>
        </div>

        {/* Metric 8: Certificates */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Certificates Issued</span>
            <div className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalCertificatesIssued || 0}
            </span>
            <span className="text-[10px] text-slate-400">verified</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">With QR authentication</p>
        </div>

        {/* Metric 9: Revenue Volume */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Tuition Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              {loading ? '...' : (stats?.estimatedRevenue || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {currentTenant?.currency || 'SAR'}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Enrolled contracts</p>
        </div>

        {/* Metric 10: AI Credits */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">AI Evaluation Credits</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              {currentTenant?.aiCreditsUsed || 0}
            </span>
            <span className="text-[10px] text-slate-400">
              / {currentTenant?.aiCreditsLimit || 5000}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Gemini 3.8-Flash engine</p>
        </div>
      </div>

      {/* 5. Real Database Charts (Recharts Integration) */}
      {!isEmptyState && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Monthly Revenue & Enrollment Trend (Area Chart) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Revenue & Enrollment Growth</h3>
                <p className="text-xs text-slate-500">
                  Aggregated tuition revenue ({currentTenant?.currency || 'SAR'}) and registered learners
                </p>
              </div>
              <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                Real Organization Database
              </span>
            </div>

            <div className="h-64 w-full">
              {stats?.monthlyRevenueTrend && stats.monthlyRevenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyRevenueTrend}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: any, name: string) => [
                        name === 'revenue'
                          ? `${Number(val).toLocaleString()} ${currentTenant?.currency || 'SAR'}`
                          : val,
                        name === 'revenue' ? 'Tuition Revenue' : 'Students Enrolled',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="revenue"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="enrollments"
                      name="enrollments"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#enrollGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No revenue history available yet.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Attendance Rate Composition (Donut / Pie) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-2">
              <h3 className="font-bold text-slate-900 text-sm">Attendance Composition</h3>
              <p className="text-xs text-slate-500">Live session participation breakdown</p>
            </div>

            <div className="h-52 w-full">
              {attendancePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendancePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {attendancePieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: any) => [`${val} record(s)`, 'Count']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No attendance records logged yet.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Average Rate</span>
                <span className="font-bold text-emerald-600 text-sm">{stats?.attendanceRate || 0}%</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Total Recorded</span>
                <span className="font-bold text-slate-800 text-sm">
                  {(stats?.attendanceBreakdown?.present || 0) +
                    (stats?.attendanceBreakdown?.late || 0) +
                    (stats?.attendanceBreakdown?.absent || 0) +
                    (stats?.attendanceBreakdown?.excused || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Secondary Chart & Analytics Row */}
      {!isEmptyState && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: CEFR Proficiency Level Distribution (Bar Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">CEFR Student Distribution</h3>
                <p className="text-xs text-slate-500">Student proficiency levels mapped from A1 to C2</p>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                CEFR Standard
              </span>
            </div>

            <div className="h-56 w-full">
              {stats?.cefrDistribution && stats.cefrDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.cefrDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: any) => [`${val} students`, 'Count']}
                    />
                    <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                      {stats.cefrDistribution.map((_, index) => (
                        <Cell key={`bar-${index}`} fill={CEFR_COLORS[index % CEFR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No student CEFR assessments recorded.
                </div>
              )}
            </div>
          </div>

          {/* Chart 4: Course Enrollment & Revenue Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Top Courses by Enrollment</h3>
                <p className="text-xs text-slate-500">Learners registered across active programs</p>
              </div>
              <button
                onClick={() => setActiveTab('courses-lms')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Curriculum</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-56 w-full">
              {stats?.courseEnrollmentBreakdown && stats.courseEnrollmentBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.courseEnrollmentBreakdown}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      tick={{ fontSize: 10, fill: '#334155' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: any, name: string) => [
                        name === 'students' ? `${val} students` : `${val} ${currentTenant?.currency || 'SAR'}`,
                        name === 'students' ? 'Enrollments' : 'Revenue',
                      ]}
                    />
                    <Bar dataKey="students" name="students" fill="#6366f1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No courses published yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Operations & Schedules Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Classes Schedule & Notifications Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications Alert Center */}
          {stats?.notifications && stats.notifications.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-sm">Actionable Notifications</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  {stats.notifications.length} Unresolved
                </span>
              </div>

              <div className="space-y-2.5">
                {stats.notifications.map((notif: OrganizationNotification) => {
                  const severityStyles =
                    notif.severity === 'urgent'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : notif.severity === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : notif.severity === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800';

                  return (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${severityStyles}`}
                    >
                      <div>
                        <span className="font-bold block">{notif.title}</span>
                        <p className="text-[11px] opacity-90 mt-0.5">{notif.message}</p>
                      </div>
                      {notif.actionTab && (
                        <button
                          onClick={() => setActiveTab(notif.actionTab!)}
                          className="text-[11px] font-bold underline whitespace-nowrap hover:opacity-75"
                        >
                          Take Action →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Classes & Live Batches */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Upcoming Classes & Cohort Batches</h3>
                <p className="text-xs text-slate-500">Live lecture schedules and teacher assignments</p>
              </div>
              <button
                onClick={() => setActiveTab('classes-attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {stats?.upcomingClasses && stats.upcomingClasses.length > 0 ? (
                stats.upcomingClasses.map((cls) => (
                  <div key={cls.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{cls.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="text-indigo-600 font-medium">{cls.courseTitle}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {cls.scheduleDay} ({cls.scheduleTime})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-slate-700 block">
                        {cls.teacherName}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        {cls.roomOrMeetingLink}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No active batches recorded. Click "Batches & Live Attendance" to create cohorts.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Audit Feed & Quick Tools */}
        <div className="space-y-6">
          {/* Real Recent Activity Audit Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Live Activity Feed</h3>
                <p className="text-xs text-slate-500">Immutable audit logs for this tenant</p>
              </div>
              <button
                onClick={() => setActiveTab('audit-logs')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                All Logs
              </button>
            </div>

            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 6).map((act) => (
                  <div key={act.id} className="text-xs border-l-2 border-indigo-400 pl-3 py-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700">{act.action}</span>
                      <span>
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{act.details}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      by {act.userEmail}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No activity events recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Digital Certificate Fast Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-indigo-900">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-amber-300 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Digital Certificate Engine</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Issue tamper-proof certificates with QR/verification code for graduation candidates.
            </p>
            <button
              onClick={() => setActiveTab('certificates')}
              className="mt-4 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
            >
              Issue Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
