import React, { useState } from 'react';
import { StudentProfile, StudentStatus } from '../../types';
import {
  User,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  Award,
  CreditCard,
  MessageSquare,
  History,
  FileText,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Flame,
  Volume2,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  currency?: string;
  onClose: () => void;
  onEdit: (student: StudentProfile) => void;
  onDelete: (student: StudentProfile) => void;
  onStatusChange: (studentId: string, newStatus: StudentStatus) => Promise<void>;
  onOpenEnroll: (student: StudentProfile) => void;
  onOpenPayment: (student: StudentProfile) => void;
  onOpenExam: (student: StudentProfile) => void;
  onOpenNote: (student: StudentProfile) => void;
  onWithdrawCourse: (studentId: string, courseId: string, classId?: string) => Promise<void>;
}

type ProfileTab =
  | 'overview'
  | 'courses'
  | 'fluency'
  | 'attendance'
  | 'homework'
  | 'exams'
  | 'payments'
  | 'certificates'
  | 'notes'
  | 'history';

const STATUS_BADGE_STYLES: Record<StudentStatus, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active Learner' },
  inactive: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400', label: 'Inactive' },
  graduated: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500', label: 'Graduated' },
  suspended: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Suspended' },
};

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-sky-50 text-sky-700 border-sky-200',
  A2: 'bg-teal-50 text-teal-700 border-teal-200',
  B1: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  B2: 'bg-purple-50 text-purple-700 border-purple-200',
  C1: 'bg-rose-50 text-rose-700 border-rose-200',
  C2: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  student,
  currency = 'SAR',
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenEnroll,
  onOpenPayment,
  onOpenExam,
  onOpenNote,
  onWithdrawCourse,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!isOpen || !student) return null;

  const statusConfig = STATUS_BADGE_STYLES[student.status] || STATUS_BADGE_STYLES.active;

  const handleQuickStatus = async (newStatus: StudentStatus) => {
    try {
      setUpdatingStatus(true);
      await onStatusChange(student.id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Tuition totals
  const totalBilled = (student.payments || []).reduce((acc, p) => acc + p.amount, 0);
  const totalPaid = (student.payments || []).filter((p) => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const totalOutstanding = totalBilled - totalPaid;

  return (
    <div
      id="student-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="student-profile-modal"
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white px-6 py-5 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    student.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={student.fullName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md bg-slate-800"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${statusConfig.dot}`}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{student.fullName}</h2>
                  {student.fullNameAr && (
                    <span className="text-xs text-slate-300 font-serif" dir="rtl">
                      ({student.fullNameAr})
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span className="font-mono text-indigo-400 font-semibold">
                    {student.studentAdmissionNumber}
                  </span>
                  <span>•</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      CEFR_COLORS[student.cefrLevel] || 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    CEFR {student.cefrLevel}
                  </span>
                  <span>•</span>
                  <span>{student.targetExam || 'General English'}</span>
                  <span>•</span>
                  <span className="capitalize">{student.studentType} Track</span>
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Status Dropdown */}
              <select
                value={student.status}
                disabled={updatingStatus}
                onChange={(e) => handleQuickStatus(e.target.value as StudentStatus)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="suspended">Suspended</option>
              </select>

              <button
                onClick={() => onEdit(student)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                title="Edit Student Information"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={() => onOpenEnroll(student)}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                title="Enroll in Course / Class"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enroll</span>
              </button>

              <button
                onClick={() => onDelete(student)}
                className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                title="Delete Student Record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition ml-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 shrink-0 flex gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'courses', label: `Courses (${student.courses?.length || 0})`, icon: BookOpen },
            { id: 'fluency', label: 'Fluency & Progress', icon: TrendingUp },
            { id: 'attendance', label: `Attendance (${student.attendanceStats?.ratePercentage || 0}%)`, icon: CalendarCheck },
            { id: 'homework', label: 'Homework & Quizzes', icon: FileText },
            { id: 'exams', label: `Exams (${student.examResults?.length || 0})`, icon: Award },
            { id: 'payments', label: `Tuition (${student.payments?.length || 0})`, icon: CreditCard },
            { id: 'certificates', label: `Certificates (${student.certificates?.length || 0})`, icon: GraduationCap },
            { id: 'notes', label: `Staff Notes (${student.notes?.length || 0})`, icon: MessageSquare },
            { id: 'history', label: 'Activity History', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Overall Fluency</span>
                  <span className="text-xl font-extrabold text-indigo-600 mt-1 block">
                    {student.fluencyProgress?.overallScore || 70}/100
                  </span>
                  <span className="text-[10px] text-slate-400">Target: {student.targetExam || 'General'}</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Attendance Rate</span>
                  <span className="text-xl font-extrabold text-emerald-600 mt-1 block">
                    {student.attendanceStats?.ratePercentage || 100}%
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {student.attendanceStats?.present || 0} / {student.attendanceStats?.totalSessions || 0} sessions
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Enrolled Courses</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {student.courses?.length || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">Active programs</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Tuition Balance</span>
                  <span
                    className={`text-xl font-extrabold mt-1 block ${
                      totalOutstanding > 0 ? 'text-amber-600' : 'text-slate-900'
                    }`}
                  >
                    {totalOutstanding.toLocaleString()} {currency}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {totalPaid.toLocaleString()} paid of {totalBilled.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Personal & Contact Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Personal Identification
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Full Name</span>
                      <span className="font-semibold text-slate-800">{student.fullName}</span>
                    </div>
                    {student.fullNameAr && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Arabic Name</span>
                        <span className="font-semibold text-slate-800 font-serif" dir="rtl">{student.fullNameAr}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Gender</span>
                      <span className="font-semibold text-slate-800 capitalize">{student.gender}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Date of Birth</span>
                      <span className="font-semibold text-slate-800">{student.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">National ID / Passport</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {student.nationalIdOrPassport || 'Not on file'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Nationality</span>
                      <span className="font-semibold text-slate-800">{student.nationality}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Enrollment Date</span>
                      <span className="font-semibold text-slate-800">{student.enrollmentDate}</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Address */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Contact & Residential Address
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Email</span>
                      <a href={`mailto:${student.email}`} className="font-semibold text-indigo-600 hover:underline">
                        {student.email}
                      </a>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Primary Phone</span>
                      <a href={`tel:${student.phone}`} className="font-semibold text-slate-800 hover:text-indigo-600">
                        {student.phone}
                      </a>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Emergency Phone</span>
                      <span className="font-semibold text-slate-800">
                        {student.emergencyPhone || 'None Provided'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">City & District</span>
                      <span className="font-semibold text-slate-800">
                        {student.address?.city || 'Riyadh'}, {student.address?.district || 'Al-Olaya'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Address Line</span>
                      <span className="font-semibold text-slate-800">
                        {student.address?.addressLine || 'King Fahd Road'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Country</span>
                      <span className="font-semibold text-slate-800">
                        {student.address?.country || 'Saudi Arabia'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Academic Leadership & Advising */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Instruction & Academic Advising
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Assigned Teacher</span>
                      <span className="font-semibold text-slate-800">
                        {student.assignedTeacherName || 'Not Assigned Yet'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Academic Counselor</span>
                      <span className="font-semibold text-slate-800">
                        {student.assignedCounselor || 'Academic Department'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Study Track</span>
                      <span className="font-semibold text-slate-800 capitalize">{student.studentType} Immersion</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Tenant Academic Partition</span>
                      <span className="font-mono text-indigo-600 font-semibold">{student.organizationId}</span>
                    </div>
                  </div>
                </div>

                {/* Parent / Guardian (if present) */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Parent / Sponsor Information
                  </h3>
                  {student.parentDetails ? (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Guardian Name</span>
                        <span className="font-semibold text-slate-800">{student.parentDetails.fullName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Relationship</span>
                        <span className="font-semibold text-slate-800">{student.parentDetails.relationship}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Email</span>
                        <span className="font-semibold text-slate-800">{student.parentDetails.email || 'None'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Phone</span>
                        <span className="font-semibold text-slate-800">{student.parentDetails.phone || 'None'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      <p>Adult / Independent learner. No guardian record filed.</p>
                      <button
                        onClick={() => onEdit(student)}
                        className="mt-2 text-indigo-600 font-semibold hover:underline"
                      >
                        + Add Guardian Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES & CLASSES */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enrolled Programs & Batch Classes</h3>
                  <p className="text-xs text-slate-500">Curriculums and live schedules assigned to this student</p>
                </div>
                <button
                  onClick={() => onOpenEnroll(student)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Enroll in New Course
                </button>
              </div>

              {/* Enrolled Courses Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Courses Curriculum
                  </span>
                  <span className="text-xs text-slate-500">{student.courses?.length || 0} Registered</span>
                </div>

                {student.courses && student.courses.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {student.courses.map((course) => (
                      <div key={course.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{course.courseTitle}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              {course.courseCode}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                course.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : course.status === 'dropped'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {course.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                            <span>Enrolled: {course.enrolledAt}</span>
                            {course.className && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-600 font-medium">Batch: {course.className}</span>
                              </>
                            )}
                            {course.grade && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-emerald-700">Grade: {course.grade}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {course.attendanceRate !== undefined && (
                            <div className="text-right">
                              <span className="text-[10px] font-semibold text-slate-400 block">Attendance</span>
                              <span className="text-xs font-bold text-slate-800">{course.attendanceRate}%</span>
                            </div>
                          )}
                          {course.status === 'in_progress' && (
                            <button
                              onClick={() => onWithdrawCourse(student.id, course.courseId, course.classId)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No courses enrolled yet. Click "Enroll in New Course" to assign one.
                  </div>
                )}
              </div>

              {/* Classes Schedule */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Scheduled Batches & Classrooms
                  </span>
                  <span className="text-xs text-slate-500">{student.classes?.length || 0} Batches</span>
                </div>

                {student.classes && student.classes.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {student.classes.map((cls) => (
                      <div key={cls.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{cls.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Teacher: <span className="font-medium text-slate-700">{cls.teacherName}</span> • Course:{' '}
                            <span className="font-medium text-slate-700">{cls.courseTitle}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                            {cls.scheduleDay} {cls.scheduleTime}
                          </span>
                          <span className="text-indigo-600 font-medium">{cls.roomOrMeetingLink}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No batch classrooms scheduled.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FLUENCY & PROGRESS */}
          {activeTab === 'fluency' && (
            <div className="space-y-6">
              {/* Top Score Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-white">
                        {student.fluencyProgress?.overallScore || 70}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-indigo-200 font-bold">/ 100</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">MR. FLUENCY AI Engine Evaluation</h3>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Active Telemetry
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Current CEFR Standing: <strong className="text-white">{student.cefrLevel}</strong> • Target:{' '}
                        <strong className="text-white">{student.targetExam}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <span className="text-xs text-slate-400 block">Streak</span>
                      <span className="text-sm font-bold text-amber-300 flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        {student.fluencyProgress?.streakDays || 1} Days
                      </span>
                    </div>
                    <div className="text-center bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <span className="text-xs text-slate-400 block">Speaking Pace</span>
                      <span className="text-sm font-bold text-indigo-300">
                        {student.fluencyProgress?.wordsPerMinute || 120} WPM
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Core Competency Progress Bars */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Oral & Linguistic Competencies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pronunciation */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-indigo-500" /> Pronunciation & Intonation
                      </span>
                      <span className="text-slate-900 font-bold">
                        {student.fluencyProgress?.pronunciationScore || 70}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${student.fluencyProgress?.pronunciationScore || 70}%` }}
                      />
                    </div>
                  </div>

                  {/* Grammar Accuracy */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Grammar & Syntactic Accuracy</span>
                      <span className="text-slate-900 font-bold">
                        {student.fluencyProgress?.grammarAccuracyScore || 72}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${student.fluencyProgress?.grammarAccuracyScore || 72}%` }}
                      />
                    </div>
                  </div>

                  {/* Vocabulary Range */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Lexical Resource & Vocabulary Range</span>
                      <span className="text-slate-900 font-bold">
                        {student.fluencyProgress?.vocabularyRangeScore || 74}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${student.fluencyProgress?.vocabularyRangeScore || 74}%` }}
                      />
                    </div>
                  </div>

                  {/* Coherence & Flow */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Discourse Coherence & Fluency Flow</span>
                      <span className="text-slate-900 font-bold">
                        {student.fluencyProgress?.coherenceScore || 71}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${student.fluencyProgress?.coherenceScore || 71}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trajectory Timeline */}
              {student.fluencyProgress?.trajectory && student.fluencyProgress.trajectory.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Progress Trajectory Milestones
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {student.fluencyProgress.trajectory.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <span className="font-bold text-indigo-600">{point.level}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-slate-800">{point.score} pts</span>
                        <span className="text-slate-400 text-[10px]">({point.date})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {/* Attendance Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Attendance Rate</span>
                  <span className="text-xl font-bold text-emerald-600 mt-1 block">
                    {student.attendanceStats?.ratePercentage || 100}%
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Present</span>
                  <span className="text-xl font-bold text-emerald-600 mt-1 block">
                    {student.attendanceStats?.present || 0}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Late</span>
                  <span className="text-xl font-bold text-amber-600 mt-1 block">
                    {student.attendanceStats?.late || 0}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Absent</span>
                  <span className="text-xl font-bold text-rose-600 mt-1 block">
                    {student.attendanceStats?.absent || 0}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Excused</span>
                  <span className="text-xl font-bold text-slate-600 mt-1 block">
                    {student.attendanceStats?.excused || 0}
                  </span>
                </div>
              </div>

              {/* Attendance Records Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Session Attendance Log
                  </span>
                </div>
                {student.attendanceRecords && student.attendanceRecords.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {student.attendanceRecords.map((rec) => (
                      <div key={rec.id} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-slate-900 block">{rec.className}</span>
                          <span className="text-[11px] text-slate-500">
                            {rec.date} • Instructor: {rec.teacherName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {rec.notes && <span className="text-slate-400 italic">{rec.notes}</span>}
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] capitalize ${
                              rec.status === 'present'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : rec.status === 'late'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : rec.status === 'absent'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No individual attendance sessions recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: HOMEWORK & QUIZZES */}
          {activeTab === 'homework' && (
            <div className="space-y-6">
              {/* Homework Assignments */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Homework & Written Tasks
                  </span>
                  <span className="text-xs text-slate-500">{student.homework?.length || 0} Tasks</span>
                </div>
                {student.homework && student.homework.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {student.homework.map((hw) => (
                      <div key={hw.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <h4 className="font-bold text-slate-900">{hw.title}</h4>
                          <p className="text-slate-500 mt-0.5">
                            {hw.courseTitle} • Due: {hw.dueDate}
                          </p>
                          {hw.feedback && (
                            <p className="text-[11px] text-indigo-700 mt-1 bg-indigo-50/70 px-2 py-1 rounded-md border border-indigo-100">
                              Feedback: {hw.feedback}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {hw.score !== undefined && (
                            <span className="font-mono font-bold text-slate-800">
                              {hw.score} / {hw.maxScore}
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              hw.status === 'graded'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : hw.status === 'submitted'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {hw.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">No homework submissions on record.</div>
                )}
              </div>

              {/* Quizzes */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Interactive Quizzes
                  </span>
                  <span className="text-xs text-slate-500">{student.quizResults?.length || 0} Quizzes</span>
                </div>
                {student.quizResults && student.quizResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {student.quizResults.map((q) => (
                      <div key={q.id} className="p-4 flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-slate-900">{q.title}</h4>
                          <p className="text-slate-500 mt-0.5">{q.courseTitle} • Date: {q.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-800">{q.percentage}%</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {q.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">No quizzes recorded yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EXAMS */}
          {activeTab === 'exams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Formal Examinations & Band Scores</h3>
                  <p className="text-xs text-slate-500">IELTS, TOEFL, and institutional level examinations</p>
                </div>
                <button
                  onClick={() => onOpenExam(student)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Log Exam Score
                </button>
              </div>

              {student.examResults && student.examResults.length > 0 ? (
                <div className="space-y-3">
                  {student.examResults.map((exam) => (
                    <div
                      key={exam.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{exam.examTitle}</span>
                          <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                            {exam.examType}
                          </span>
                          {exam.bandScore && (
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">
                              Band {exam.bandScore}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Assessment Date: {exam.date}</p>
                        {exam.examinerFeedback && (
                          <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong>Examiner Notes:</strong> {exam.examinerFeedback}
                          </p>
                        )}
                        {exam.skills && (
                          <div className="flex gap-3 mt-3 text-[11px]">
                            <span className="text-slate-500">Speaking: <strong className="text-slate-800">{exam.skills.speaking}%</strong></span>
                            <span className="text-slate-500">Listening: <strong className="text-slate-800">{exam.skills.listening}%</strong></span>
                            <span className="text-slate-500">Reading: <strong className="text-slate-800">{exam.skills.reading}%</strong></span>
                            <span className="text-slate-500">Writing: <strong className="text-slate-800">{exam.skills.writing}%</strong></span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-purple-700 block">
                          {exam.score}
                          <span className="text-xs text-slate-400 font-normal"> / {exam.maxScore}</span>
                        </span>
                        <span
                          className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            exam.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {exam.passed ? 'PASSED' : 'RETEST REQUIRED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  No exam scores logged. Click "Log Exam Score" to record an assessment.
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PAYMENTS & TUITION */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tuition Fees & Invoices Ledger</h3>
                  <p className="text-xs text-slate-500">Billing history, paid installments, and outstanding balances</p>
                </div>
                <button
                  onClick={() => onOpenPayment(student)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Record Tuition Payment
                </button>
              </div>

              {/* Financial Balance Header */}
              <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Total Invoiced</span>
                  <span className="text-base font-extrabold text-slate-800">
                    {totalBilled.toLocaleString()} {currency}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Total Collected</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    {totalPaid.toLocaleString()} {currency}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Outstanding</span>
                  <span className={`text-base font-extrabold ${totalOutstanding > 0 ? 'text-amber-600' : 'text-slate-600'}`}>
                    {totalOutstanding.toLocaleString()} {currency}
                  </span>
                </div>
              </div>

              {student.payments && student.payments.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="divide-y divide-slate-100">
                    {student.payments.map((p) => (
                      <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{p.title}</span>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {p.invoiceNumber}
                            </span>
                          </div>
                          <p className="text-slate-500 mt-1">
                            {p.date} • Method: <span className="font-medium text-slate-700">{p.method}</span>
                          </p>
                          {p.notes && <p className="text-[11px] text-slate-400 italic mt-0.5">{p.notes}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {p.amount.toLocaleString()} {p.currency}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : p.status === 'partial'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  No tuition payments logged.
                </div>
              )}
            </div>
          )}

          {/* TAB 8: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Accredited Certificates</h3>
                <p className="text-xs text-slate-500">Graduation credentials with public tamper-proof verification</p>
              </div>

              {student.certificates && student.certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {student.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">
                          {cert.verificationCode}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{cert.courseTitle}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Grade: <strong className="text-emerald-700">{cert.grade}</strong></p>
                      </div>

                      <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                        <span>Issued: {cert.issueDate}</span>
                        <span>Instructor: {cert.instructorName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  No certificates issued yet for this student.
                </div>
              )}
            </div>
          )}

          {/* TAB 9: STAFF NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Staff & Teacher Internal Notes</h3>
                  <p className="text-xs text-slate-500">Confidential advisory and behavioral observations</p>
                </div>
                <button
                  onClick={() => onOpenNote(student)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Internal Note
                </button>
              </div>

              {student.notes && student.notes.length > 0 ? (
                <div className="space-y-3">
                  {student.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{note.authorName}</span>
                          <span className="text-[10px] text-slate-500">({note.authorRole})</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              note.category === 'academic'
                                ? 'bg-indigo-50 text-indigo-700'
                                : note.category === 'behavioral'
                                ? 'bg-amber-50 text-amber-700'
                                : note.category === 'financial'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {note.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  No internal notes recorded. Click "Add Internal Note" to log staff counseling details.
                </div>
              )}
            </div>
          )}

          {/* TAB 10: ACTIVITY HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Chronological Lifecycle & Audit Trail</h3>
                <p className="text-xs text-slate-500">Complete event log of admissions, exams, payments, and modifications</p>
              </div>

              {student.activityHistory && student.activityHistory.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="relative border-l border-slate-200 ml-3 space-y-5">
                    {student.activityHistory.map((act) => (
                      <div key={act.id} className="relative pl-6">
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                        {act.performedBy && (
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Logged by: <strong className="text-slate-600">{act.performedBy}</strong>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  No activity records logged.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
