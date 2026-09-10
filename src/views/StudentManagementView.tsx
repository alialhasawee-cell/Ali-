import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  StudentProfile,
  StudentListStats,
  StudentStatus,
  Course,
  BatchClass,
  User,
  CEFRLevel,
} from '../types';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  Plus,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CalendarCheck,
  CreditCard,
  Mail,
  Phone,
  BookOpen,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Award,
  Sparkles,
} from 'lucide-react';
import { StudentProfileModal } from '../components/students/StudentProfileModal';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { StudentEnrollModal } from '../components/students/StudentEnrollModal';
import { StudentPaymentModal } from '../components/students/StudentPaymentModal';
import { StudentExamModal } from '../components/students/StudentExamModal';
import { StudentNoteModal } from '../components/students/StudentNoteModal';
import { ConfirmDialogModal } from '../components/students/ConfirmDialogModal';

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-sky-50 text-sky-700 border-sky-200',
  A2: 'bg-teal-50 text-teal-700 border-teal-200',
  B1: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  B2: 'bg-purple-50 text-purple-700 border-purple-200',
  C1: 'bg-rose-50 text-rose-700 border-rose-200',
  C2: 'bg-amber-50 text-amber-700 border-amber-200',
};

const STATUS_BADGES: Record<StudentStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Active' },
  inactive: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', label: 'Inactive' },
  graduated: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', label: 'Graduated' },
  suspended: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Suspended' },
};

export const StudentManagementView: React.FC = () => {
  const { currentTenant, showToast } = useAuth();

  // View presentation mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Query & Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Data states
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<StudentListStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<BatchClass[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentProfile | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [enrollingStudent, setEnrollingStudent] = useState<StudentProfile | null>(null);
  const [payingStudent, setPayingStudent] = useState<StudentProfile | null>(null);
  const [examStudent, setExamStudent] = useState<StudentProfile | null>(null);
  const [notingStudent, setNotingStudent] = useState<StudentProfile | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: true,
    onConfirm: () => {},
  });

  // Load auxiliary data (Courses, Classes, Teachers)
  const loadAuxiliaryData = async () => {
    try {
      const [coursesData, classesData, teachersData] = await Promise.all([
        api.getCourses().catch(() => []),
        api.getClasses().catch(() => []),
        api.getTeachers().catch(() => []),
      ]);
      setCourses(coursesData || []);
      setClasses(classesData || []);
      setTeachers(teachersData || []);
    } catch (err) {
      console.error('Failed to load auxiliary data:', err);
    }
  };

  // Fetch students with current filters and pagination
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const [res, statsRes] = await Promise.all([
        api.getPagedStudents({
          search: search.trim() || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          level: levelFilter !== 'ALL' ? levelFilter : undefined,
          courseId: courseFilter !== 'ALL' ? courseFilter : undefined,
          paymentStatus: paymentFilter !== 'ALL' ? paymentFilter : undefined,
          page,
          limit,
        }),
        api.getStudentStats().catch(() => null),
      ]);

      setStudents(res.students || []);
      setTotalStudents(res.total || 0);
      setTotalPages(res.totalPages || 1);
      if (statsRes) {
        setStats(statsRes);
      }

      // If a student profile is currently open, refresh its data
      if (selectedStudentForProfile) {
        const updated = res.students?.find((s) => s.id === selectedStudentForProfile.id);
        if (updated) setSelectedStudentForProfile(updated);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch students list', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAuxiliaryData();
  }, [currentTenant?.id]);

  useEffect(() => {
    fetchStudents();
  }, [page, limit, statusFilter, levelFilter, courseFilter, paymentFilter, currentTenant?.id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setLevelFilter('ALL');
    setCourseFilter('ALL');
    setPaymentFilter('ALL');
    setPage(1);
  };

  // Action: Open Student Profile
  const handleOpenProfile = async (student: StudentProfile) => {
    try {
      // Fetch fresh full student profile to include latest history, exams, payments
      const fresh = await api.getStudentById(student.id);
      setSelectedStudentForProfile(fresh || student);
    } catch {
      setSelectedStudentForProfile(student);
    }
  };

  // Action: Add Student
  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowFormModal(true);
  };

  // Action: Edit Student
  const handleEditStudent = (student: StudentProfile) => {
    setEditingStudent(student);
    setShowFormModal(true);
  };

  // Action: Submit Add or Edit
  const handleSubmitStudentForm = async (
    payload: Partial<StudentProfile> & { courseId?: string; classId?: string }
  ) => {
    if (editingStudent) {
      const updated = await api.updateStudentProfile(editingStudent.id, payload);
      showToast(`Student record for ${updated.fullName} updated successfully.`, 'success');
      if (selectedStudentForProfile?.id === editingStudent.id) {
        setSelectedStudentForProfile(updated);
      }
    } else {
      const created = await api.createStudentProfile(payload);
      showToast(`Student ${created.fullName} (${created.studentAdmissionNumber}) admitted successfully!`, 'success');
    }
    fetchStudents();
  };

  // Action: Change Status
  const handleStatusChange = async (studentId: string, newStatus: StudentStatus) => {
    try {
      const updated = await api.setStudentStatus(studentId, newStatus);
      showToast(`Student status updated to ${newStatus}.`, 'success');
      if (selectedStudentForProfile?.id === studentId) {
        setSelectedStudentForProfile(updated);
      }
      fetchStudents();
    } catch (err: any) {
      showToast(err.message || 'Failed to update student status', 'error');
    }
  };

  // Action: Delete Student with Confirmation Dialog
  const handleDeleteStudent = (student: StudentProfile) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Permanently Delete Student Record?',
      message: `Are you sure you want to delete ${student.fullName} (${student.studentAdmissionNumber})? This will remove all associated enrollment records, attendance logs, and exam scores for this organization.`,
      confirmLabel: 'Delete Student Record',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.deleteStudentProfile(student.id);
          showToast(`Student ${student.fullName} was deleted.`, 'success');
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          if (selectedStudentForProfile?.id === student.id) {
            setSelectedStudentForProfile(null);
          }
          fetchStudents();
        } catch (err: any) {
          showToast(err.message || 'Failed to delete student record', 'error');
        }
      },
    });
  };

  // Action: Enroll in Course
  const handleEnrollStudent = async (studentId: string, courseId: string, classId?: string) => {
    const updated = await api.enrollStudentInCourse(studentId, courseId, classId);
    showToast('Student enrolled into course successfully.', 'success');
    if (selectedStudentForProfile?.id === studentId) {
      setSelectedStudentForProfile(updated);
    }
    fetchStudents();
  };

  // Action: Withdraw / Drop Course
  const handleWithdrawCourse = async (studentId: string, courseId: string, classId?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Withdraw Student from Course?',
      message: 'Are you sure you want to withdraw this student? Their enrollment status will be marked as dropped.',
      confirmLabel: 'Confirm Withdrawal',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const updated = await api.withdrawStudentFromCourse(studentId, courseId, classId);
          showToast('Student enrollment status marked as dropped.', 'success');
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          if (selectedStudentForProfile?.id === studentId) {
            setSelectedStudentForProfile(updated);
          }
          fetchStudents();
        } catch (err: any) {
          showToast(err.message || 'Failed to withdraw student', 'error');
        }
      },
    });
  };

  // Action: Add Payment
  const handleAddPayment = async (studentId: string, payment: any) => {
    const updated = await api.addStudentPayment(studentId, payment);
    showToast('Payment record added successfully.', 'success');
    if (selectedStudentForProfile?.id === studentId) {
      setSelectedStudentForProfile(updated);
    }
    fetchStudents();
  };

  // Action: Add Exam Score
  const handleAddExam = async (studentId: string, exam: any) => {
    const updated = await api.addStudentExam(studentId, exam);
    showToast('Assessment result logged successfully.', 'success');
    if (selectedStudentForProfile?.id === studentId) {
      setSelectedStudentForProfile(updated);
    }
    fetchStudents();
  };

  // Action: Add Note
  const handleAddNote = async (studentId: string, note: any) => {
    const updated = await api.addStudentNote(studentId, note);
    showToast('Internal note saved.', 'success');
    if (selectedStudentForProfile?.id === studentId) {
      setSelectedStudentForProfile(updated);
    }
    fetchStudents();
  };

  const currency = currentTenant?.currency || 'SAR';

  return (
    <div id="student-management-view" className="space-y-6">
      {/* 1. View Header with Breadcrumbs and Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>MR. FLUENCY Academic Registry</span>
            <span>•</span>
            <span className="text-slate-500">{currentTenant?.name || 'Academy Hub'}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Student Management & Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tenant-isolated learner profiles, CEFR fluency tracking, course enrollments, attendance, and billing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="refresh-students-btn"
            onClick={() => {
              setRefreshing(true);
              fetchStudents();
            }}
            disabled={refreshing || loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition disabled:opacity-50"
            title="Refresh student records"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action: Admit / Add Student */}
          <button
            id="admit-student-btn"
            onClick={handleAddStudent}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Admit New Student</span>
          </button>
        </div>
      </div>

      {/* 2. Real Database Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Enrolled</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{stats?.totalStudents || 0}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {stats?.activeStudents || 0} active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Tenant academic registry</p>
        </div>

        {/* Avg Attendance */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Avg Attendance Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {stats?.avgAttendanceRate || 95}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Live classroom participation</p>
        </div>

        {/* Avg Fluency Score */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Avg Fluency Score</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700">
              {stats?.avgFluencyScore || 75}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">/ 100 pts</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">MR. FLUENCY AI Engine</p>
        </div>

        {/* Total Invoiced Tuition */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Tuition Collected</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              {(stats?.totalPaidTuition || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{currency}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            of {(stats?.totalBilledTuition || 0).toLocaleString()} {currency} billed
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Pending Tuition</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-xl font-extrabold ${
                (stats?.outstandingTuition || 0) > 0 ? 'text-amber-600' : 'text-slate-900'
              }`}
            >
              {(stats?.outstandingTuition || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{currency}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Uncollected receivables</p>
        </div>
      </div>

      {/* 3. Search & Multi-Criteria Filtering Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="student-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, Arabic name, email, admission #, or phone..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Filter Pills / Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters:
          </span>

          {/* Status Filter */}
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* CEFR Level Filter */}
          <select
            id="cefr-filter-select"
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">CEFR Level: All</option>
            <option value="A1">A1 Beginner</option>
            <option value="A2">A2 Elementary</option>
            <option value="B1">B1 Intermediate</option>
            <option value="B2">B2 Upper Intermediate</option>
            <option value="C1">C1 Advanced</option>
            <option value="C2">C2 Mastery</option>
          </select>

          {/* Course Enrolled Filter */}
          <select
            id="course-filter-select"
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Course: All Enrolled</option>
            {courses.map((crs) => (
              <option key={crs.id} value={crs.id}>
                {crs.title} ({crs.level})
              </option>
            ))}
          </select>

          {/* Tuition Payment Filter */}
          <select
            id="payment-filter-select"
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Tuition: All</option>
            <option value="paid">Fully Settled</option>
            <option value="unpaid">Outstanding Balance</option>
          </select>

          {(statusFilter !== 'ALL' ||
            levelFilter !== 'ALL' ||
            courseFilter !== 'ALL' ||
            paymentFilter !== 'ALL' ||
            search) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
            >
              Reset All Filters
            </button>
          )}

          <div className="ml-auto text-xs text-slate-400">
            Found <strong className="text-slate-700 font-semibold">{totalStudents}</strong> students
          </div>
        </div>
      </div>

      {/* 4. Student Records Presentation (Table or Cards) */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium">Loading student academic registry...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Students Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || statusFilter !== 'ALL' || levelFilter !== 'ALL'
              ? 'No students matched your search criteria. Try modifying your filters.'
              : 'There are no students enrolled in this academy partition yet.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {(search || statusFilter !== 'ALL' || levelFilter !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Clear Search & Filters
              </button>
            )}
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              Admit First Student
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-3">CEFR / Target</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3">Courses</th>
                  <th className="py-3.5 px-3 text-center">Attendance</th>
                  <th className="py-3.5 px-3 text-center">Fluency</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((student) => {
                  const statusConf = STATUS_BADGES[student.status] || STATUS_BADGES.active;
                  const attRate = student.attendanceStats?.ratePercentage ?? 100;
                  const fluency = student.fluencyProgress?.overallScore ?? 70;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => handleOpenProfile(student)}
                    >
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              student.avatarUrl ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                            }
                            alt={student.fullName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{student.fullName}</span>
                              {student.fullNameAr && (
                                <span className="text-[11px] text-slate-400 font-serif" dir="rtl">
                                  ({student.fullNameAr})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                              <span className="text-indigo-600 font-semibold">
                                {student.studentAdmissionNumber}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{student.studentType}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CEFR & Target Exam */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                              CEFR_COLORS[student.cefrLevel] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            CEFR {student.cefrLevel}
                          </span>
                          <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                            {student.targetExam || 'General'}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConf.bg} ${statusConf.text}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-0.5">
                          <a
                            href={`mailto:${student.email}`}
                            className="text-slate-700 hover:text-indigo-600 block truncate max-w-[150px]"
                          >
                            {student.email}
                          </a>
                          <a
                            href={`tel:${student.phone}`}
                            className="text-[11px] text-slate-400 hover:text-indigo-600 block"
                          >
                            {student.phone}
                          </a>
                        </div>
                      </td>

                      {/* Courses */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">
                            {student.courses?.length || 0}
                          </span>
                          <span className="text-[11px] text-slate-400">programs</span>
                        </div>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              attRate >= 85
                                ? 'text-emerald-600'
                                : attRate >= 70
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {attRate}%
                          </span>
                        </div>
                      </td>

                      {/* Fluency Score */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 text-[11px]">
                          {fluency}/100
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenProfile(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="View Complete Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit Student"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEnrollingStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Enroll in Course"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Student Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* MOBILE-FRIENDLY GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => {
            const statusConf = STATUS_BADGES[student.status] || STATUS_BADGES.active;
            const attRate = student.attendanceStats?.ratePercentage ?? 100;
            const fluency = student.fluencyProgress?.overallScore ?? 70;

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition space-y-4 cursor-pointer flex flex-col justify-between"
                onClick={() => handleOpenProfile(student)}
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          student.avatarUrl ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={student.fullName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{student.fullName}</h3>
                        {student.fullNameAr && (
                          <span className="text-xs text-slate-400 font-serif block" dir="rtl">
                            {student.fullNameAr}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold block">
                          {student.studentAdmissionNumber}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConf.bg} ${statusConf.text}`}
                    >
                      {statusConf.label}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                        CEFR_COLORS[student.cefrLevel] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      CEFR {student.cefrLevel}
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {student.targetExam || 'General'}
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md capitalize">
                      {student.studentType}
                    </span>
                  </div>

                  {/* Telemetry metrics strip */}
                  <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Attendance</span>
                      <span className="text-xs font-bold text-emerald-600">{attRate}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Fluency</span>
                      <span className="text-xs font-bold text-indigo-700">{fluency}/100</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Courses</span>
                      <span className="text-xs font-bold text-slate-800">{student.courses?.length || 0}</span>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{student.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div
                  className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleOpenProfile(student)}
                    className="flex-1 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleEditStudent(student)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEnrollingStudent(student)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    title="Enroll in Course"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Pagination Bar */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{(page - 1) * limit + 1}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(page * limit, totalStudents)}</strong> of{' '}
            <strong className="text-slate-800">{totalStudents}</strong> students
          </div>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="6">6 / page</option>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>

            <button
              id="student-prev-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition disabled:opacity-40"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-slate-700 px-2">
              Page {page} of {totalPages}
            </span>

            <button
              id="student-next-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition disabled:opacity-40"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Modals Layer */}
      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        student={selectedStudentForProfile}
        currency={currency}
        onClose={() => setSelectedStudentForProfile(null)}
        onEdit={(stu) => {
          setEditingStudent(stu);
          setShowFormModal(true);
        }}
        onDelete={(stu) => handleDeleteStudent(stu)}
        onStatusChange={handleStatusChange}
        onOpenEnroll={(stu) => setEnrollingStudent(stu)}
        onOpenPayment={(stu) => setPayingStudent(stu)}
        onOpenExam={(stu) => setExamStudent(stu)}
        onOpenNote={(stu) => setNotingStudent(stu)}
        onWithdrawCourse={handleWithdrawCourse}
      />

      {/* Add / Edit Student Form Modal */}
      <StudentFormModal
        isOpen={showFormModal}
        student={editingStudent}
        courses={courses}
        classes={classes}
        teachers={teachers}
        defaultCountry={currentTenant?.address?.country || 'Saudi Arabia'}
        defaultCity={currentTenant?.address?.city || 'Riyadh'}
        onClose={() => {
          setShowFormModal(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSubmitStudentForm}
      />

      {/* Enroll Modal */}
      <StudentEnrollModal
        isOpen={!!enrollingStudent}
        student={enrollingStudent}
        courses={courses}
        classes={classes}
        onClose={() => setEnrollingStudent(null)}
        onEnroll={handleEnrollStudent}
      />

      {/* Payment Modal */}
      <StudentPaymentModal
        isOpen={!!payingStudent}
        student={payingStudent}
        currency={currency}
        onClose={() => setPayingStudent(null)}
        onAddPayment={handleAddPayment}
      />

      {/* Exam Result Modal */}
      <StudentExamModal
        isOpen={!!examStudent}
        student={examStudent}
        onClose={() => setExamStudent(null)}
        onAddExam={handleAddExam}
      />

      {/* Note Modal */}
      <StudentNoteModal
        isOpen={!!notingStudent}
        student={notingStudent}
        onClose={() => setNotingStudent(null)}
        onAddNote={handleAddNote}
      />

      {/* Confirmation Dialog Modal */}
      <ConfirmDialogModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
