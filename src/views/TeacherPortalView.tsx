import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ActiveTab,
  TeacherDashboardData,
  TeacherProfile,
  BatchClass,
  Assignment,
  StudentProfile,
  Course,
} from '../types';
import {
  FileCheck2,
  BookOpen,
  Sparkles,
  CalendarCheck,
  CheckCircle,
  Clock,
  Send,
  Award,
  Users,
  AlertCircle,
  Plus,
  TrendingUp,
  MessageSquare,
  Bell,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { TeacherAttendanceWorkflowModal } from '../components/teachers/TeacherAttendanceWorkflowModal';
import { TeacherHomeworkWorkflowModal } from '../components/teachers/TeacherHomeworkWorkflowModal';
import { TeacherQuizWorkflowModal } from '../components/teachers/TeacherQuizWorkflowModal';
import { TeacherResultWorkflowModal } from '../components/teachers/TeacherResultWorkflowModal';
import { TeacherMessageWorkflowModal } from '../components/teachers/TeacherMessageWorkflowModal';

interface TeacherPortalViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({ setActiveTab }) => {
  const { currentTenant, currentUser, activeRole, showToast } = useAuth();

  // Selected teacher state
  const [teachersList, setTeachersList] = useState<TeacherProfile[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<BatchClass[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Grading workspace state
  const [gradingAssignmentId, setGradingAssignmentId] = useState<string | null>(null);
  const [gradingStudentId, setGradingStudentId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  // Student search filter inside dashboard
  const [studentSearch, setStudentSearch] = useState('');

  // Workflow modals
  const [workflowType, setWorkflowType] = useState<
    'attendance' | 'homework' | 'quiz' | 'result' | 'message' | null
  >(null);
  const [workflowClassId, setWorkflowClassId] = useState<string | undefined>(undefined);
  const [workflowStudentId, setWorkflowStudentId] = useState<string | undefined>(undefined);
  const [isWorkflowSubmitting, setIsWorkflowSubmitting] = useState(false);

  // Initialize teacher list and default selection
  useEffect(() => {
    const initFaculty = async () => {
      try {
        setLoading(true);
        const [teachersRes, crsList, clsList, stdRes] = await Promise.all([
          api.getTeachers({ all: true, format: 'flat' }) as Promise<TeacherProfile[]>,
          api.getCourses(),
          api.getClasses(),
          api.getPagedStudents({ limit: 100 }),
        ]);

        const tList = Array.isArray(teachersRes) ? teachersRes : [];
        setTeachersList(tList);
        setCourses(crsList);
        setClasses(clsList);
        setStudents(stdRes.students || []);

        // If current user is a teacher, match their ID
        const matchedTeacher =
          tList.find((t) => t.id === currentUser?.id || t.email === currentUser?.email) ||
          tList[0];

        if (matchedTeacher) {
          setSelectedTeacherId(matchedTeacher.id);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to initialize faculty portal', 'error');
      } finally {
        setLoading(false);
      }
    };

    initFaculty();
  }, [currentTenant?.id, currentUser?.id]);

  // Load dashboard data when selectedTeacherId changes
  const loadDashboard = async (teacherId: string) => {
    if (!teacherId) return;
    try {
      setLoading(true);
      const data = await api.getTeacherDashboard(teacherId);
      setDashboardData(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load teacher dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTeacherId) {
      loadDashboard(selectedTeacherId);
    }
  }, [selectedTeacherId]);

  // Handle grade submission
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignmentId || !gradingStudentId) return;

    try {
      setSubmittingGrade(true);
      await api.gradeAssignment(
        gradingAssignmentId,
        gradingStudentId,
        gradeScore,
        gradeFeedback
      );

      showToast(`Grade (${gradeScore} pts) and feedback saved to student ledger!`, 'success');
      setGradingAssignmentId(null);
      setGradingStudentId(null);
      setGradeFeedback('');

      // Refresh dashboard
      if (selectedTeacherId) {
        await loadDashboard(selectedTeacherId);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit grade', 'error');
    } finally {
      setSubmittingGrade(false);
    }
  };

  // Workflow Handlers
  const handleRecordAttendance = async (payload: {
    classId: string;
    date: string;
    entries: any[];
  }) => {
    if (!selectedTeacherId) return;
    try {
      setIsWorkflowSubmitting(true);
      await api.recordTeacherAttendance(selectedTeacherId, payload);
      showToast('Attendance recorded and saved to tenant database!', 'success');
      setWorkflowType(null);
      await loadDashboard(selectedTeacherId);
    } catch (err: any) {
      showToast(err.message || 'Failed to record attendance', 'error');
    } finally {
      setIsWorkflowSubmitting(false);
    }
  };

  const handleCreateHomework = async (payload: {
    courseId: string;
    courseTitle: string;
    title: string;
    description: string;
    dueDate: string;
    maxScore: number;
  }) => {
    if (!selectedTeacherId) return;
    try {
      setIsWorkflowSubmitting(true);
      await api.createTeacherHomework(selectedTeacherId, payload);
      showToast(`Homework "${payload.title}" created successfully!`, 'success');
      setWorkflowType(null);
      await loadDashboard(selectedTeacherId);
    } catch (err: any) {
      showToast(err.message || 'Failed to create homework', 'error');
    } finally {
      setIsWorkflowSubmitting(false);
    }
  };

  const handleCreateQuiz = async (payload: {
    courseId: string;
    courseTitle: string;
    title: string;
    type: 'quiz' | 'exam' | 'practice';
    durationMinutes: number;
    passingScore: number;
    questions: any[];
  }) => {
    if (!selectedTeacherId) return;
    try {
      setIsWorkflowSubmitting(true);
      await api.createTeacherQuiz(selectedTeacherId, payload);
      showToast(`Quiz "${payload.title}" deployed!`, 'success');
      setWorkflowType(null);
      await loadDashboard(selectedTeacherId);
    } catch (err: any) {
      showToast(err.message || 'Failed to create quiz', 'error');
    } finally {
      setIsWorkflowSubmitting(false);
    }
  };

  const handleRecordResult = async (payload: any) => {
    if (!selectedTeacherId) return;
    try {
      setIsWorkflowSubmitting(true);
      await api.recordTeacherExamResult(selectedTeacherId, payload);
      showToast('Student result and examiner feedback recorded!', 'success');
      setWorkflowType(null);
      await loadDashboard(selectedTeacherId);
    } catch (err: any) {
      showToast(err.message || 'Failed to record result', 'error');
    } finally {
      setIsWorkflowSubmitting(false);
    }
  };

  const handleSendMessage = async (payload: any) => {
    if (!selectedTeacherId) return;
    try {
      setIsWorkflowSubmitting(true);
      await api.sendTeacherMessage(selectedTeacherId, payload);
      showToast(`Message sent to ${payload.recipientName}!`, 'success');
      setWorkflowType(null);
      await loadDashboard(selectedTeacherId);
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setIsWorkflowSubmitting(false);
    }
  };

  const teacher = dashboardData?.teacher;
  const isTeacherUser = activeRole === 'TEACHER';

  // Filter assigned students
  const filteredStudents = (dashboardData?.assignedStudents || []).filter((s) => {
    if (!studentSearch.trim()) return true;
    const term = studentSearch.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.studentId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Teacher Dashboard Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Teacher Workspace & Live Dashboard</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Faculty member:{' '}
            <strong className="text-slate-800 font-semibold">{teacher?.fullName || currentUser?.fullName}</strong>{' '}
            • {teacher?.specialization || 'English Instructor'} •{' '}
            <span className="text-indigo-600 font-medium">{currentTenant?.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto">
          {/* Switch Faculty Member if Admin/Owner */}
          {!isTeacherUser && teachersList.length > 1 && (
            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-xs font-semibold text-slate-500">Instructor:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {teachersList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.employeeId})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setActiveTab('ai-tools')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Lesson Planner</span>
          </button>

          <button
            onClick={() => {
              setWorkflowClassId(undefined);
              setWorkflowType('attendance');
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Record Attendance</span>
          </button>
        </div>
      </div>

      {/* Quick Workflow Action Buttons Ribbon */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Teacher Workflows:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setWorkflowType('attendance')}
            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Record Attendance</span>
          </button>
          <button
            onClick={() => setWorkflowType('homework')}
            className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Create Homework</span>
          </button>
          <button
            onClick={() => setWorkflowType('quiz')}
            className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Quiz</span>
          </button>
          <button
            onClick={() => setWorkflowType('result')}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Record Exam Result</span>
          </button>
          <button
            onClick={() => setWorkflowType('message')}
            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Message Students</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Classes</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {dashboardData?.todayClasses?.length || 0}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Live sessions</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming</p>
          <p className="text-2xl font-black text-indigo-900 mt-1">
            {dashboardData?.upcomingClasses?.length || 0}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Scheduled batches</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Students</p>
          <p className="text-2xl font-black text-purple-900 mt-1">
            {dashboardData?.assignedStudents?.length || 0}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active learners</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Homework</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {dashboardData?.pendingHomework?.length || 0}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active tasks</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Grading</p>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {dashboardData?.pendingGrading?.length || 0}
          </p>
          <p className="text-[10px] text-amber-600 mt-0.5">Submissions to review</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Teacher Rating</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {teacher?.performance?.studentSatisfactionRating?.toFixed(1) || '4.9'}
          </p>
          <p className="text-[10px] text-emerald-600 mt-0.5">94% pass rate</p>
        </div>
      </div>

      {/* Main Grid: Today's Classes & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Classes & Upcoming Schedule */}
        <div className="space-y-6">
          {/* Today's Classes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Today's Classes
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400">Loading today's schedule...</p>
            ) : !dashboardData?.todayClasses || dashboardData.todayClasses.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                No classes scheduled for today. Check upcoming sessions below.
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.todayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Live Today
                      </span>
                    </div>

                    <p className="text-[11px] text-indigo-600 font-medium">{cls.courseTitle}</p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{cls.scheduleTime}</span>
                    </div>

                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">15 enrolled students</span>
                      <button
                        onClick={() => {
                          setWorkflowClassId(cls.id);
                          setWorkflowType('attendance');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
                      >
                        <CalendarCheck className="w-3 h-3" />
                        <span>Take Attendance</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Upcoming Classes This Week
            </h3>

            {!dashboardData?.upcomingClasses || dashboardData.upcomingClasses.length === 0 ? (
              <p className="text-xs text-slate-400">No further upcoming classes assigned.</p>
            ) : (
              <div className="space-y-2.5">
                {dashboardData.upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800">{cls.name}</h4>
                      <p className="text-[11px] text-indigo-600 font-medium">{cls.courseTitle}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {cls.scheduleDay} • {cls.scheduleTime}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setWorkflowClassId(cls.id);
                        setWorkflowType('attendance');
                      }}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 transition shrink-0"
                    >
                      Attendance
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teacher Notifications & Broadcasts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Notifications & Messages
                </h3>
              </div>
              <button
                onClick={() => setWorkflowType('message')}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                + New Message
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {(dashboardData?.notifications || [
                {
                  id: 'n1',
                  title: 'Mid-term CEFR Assessments Open',
                  message: 'Please finalize oral interview scores by Thursday.',
                  timestamp: 'Today',
                  type: 'alert',
                },
              ]).map((nt) => (
                <div key={nt.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-0.5">
                  <p className="font-bold text-amber-900">{nt.title}</p>
                  <p className="text-[11px] text-amber-800/90 leading-relaxed">{nt.message}</p>
                  <span className="text-[9px] text-amber-600 font-mono block mt-1">{nt.timestamp}</span>
                </div>
              ))}

              {dashboardData?.messages && dashboardData.messages.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recent Communications
                  </span>
                  {dashboardData.messages.slice(0, 3).map((m) => (
                    <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate">{m.recipientName}</span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {new Date(m.sentAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{m.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Pending Grading, Pending Homework, and Student Cohort */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Grading Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Homework Submissions Awaiting Grading
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluate essays, assign numerical scores, and deliver pedagogical feedback directly to student files.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg">
                {dashboardData?.pendingGrading?.length || 0} Pending
              </span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400">Loading submissions...</p>
            ) : !dashboardData?.pendingGrading || dashboardData.pendingGrading.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-800">All student submissions are graded!</p>
                <p className="text-[11px] text-slate-500">Great job staying on top of pedagogical assessments.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.pendingGrading.map(({ assignment, submission }) => {
                  const isGrading =
                    gradingAssignmentId === assignment.id &&
                    gradingStudentId === submission.studentId;

                  return (
                    <div
                      key={`${assignment.id}-${submission.studentId}`}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{assignment.title}</h4>
                          <span className="text-[11px] text-indigo-600 font-medium">
                            {assignment.courseTitle}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Max Score: {assignment.maxScore} pts
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-800">{submission.studentName}</strong>
                            <span className="text-[10px] text-slate-400">
                              Submitted: {submission.submittedAt}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Awaiting Evaluation
                          </span>
                        </div>

                        {submission.textSubmission && (
                          <div className="p-3 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 italic leading-relaxed">
                            "{submission.textSubmission}"
                          </div>
                        )}

                        {!isGrading ? (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => {
                                setGradingAssignmentId(assignment.id);
                                setGradingStudentId(submission.studentId);
                                setGradeScore(submission.score || 85);
                                setGradeFeedback(submission.teacherFeedback || '');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs"
                            >
                              Evaluate & Grade
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleGradeSubmit} className="pt-2 space-y-3 border-t border-slate-200">
                            <div className="flex items-center gap-3">
                              <label className="text-xs font-semibold text-slate-700">
                                Score (Max {assignment.maxScore}):
                              </label>
                              <input
                                type="number"
                                min="0"
                                max={assignment.maxScore}
                                value={gradeScore}
                                onChange={(e) => setGradeScore(Number(e.target.value))}
                                className="w-20 px-2.5 py-1 text-xs rounded-lg border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Constructive Teacher Feedback & Corrections:
                              </label>
                              <textarea
                                rows={3}
                                required
                                placeholder="Highlight strengths, grammatical corrections, and recommendations for improvement..."
                                value={gradeFeedback}
                                onChange={(e) => setGradeFeedback(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setGradingAssignmentId(null);
                                  setGradingStudentId(null);
                                }}
                                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={submittingGrade}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 shadow-xs"
                              >
                                {submittingGrade ? 'Saving...' : 'Save & Publish Grade'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Homework Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assigned Homework & Essay Drills</h3>
                <p className="text-xs text-slate-500">
                  Monitor submission completion rates across active curricula.
                </p>
              </div>
              <button
                onClick={() => setWorkflowType('homework')}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Assign Homework</span>
              </button>
            </div>

            {!dashboardData?.pendingHomework || dashboardData.pendingHomework.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl border border-slate-200">
                No active homework tasks assigned. Click "Assign Homework" to create one.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dashboardData.pendingHomework.map((asg) => (
                  <div key={asg.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{asg.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">Due: {asg.dueDate}</span>
                    </div>
                    <p className="text-[11px] text-indigo-600 font-medium">{asg.courseTitle}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                      <span>Max Score: {asg.maxScore} pts</span>
                      <span className="font-semibold text-emerald-600">
                        {asg.submissions?.length || 0} Submissions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Students Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Assigned Student Cohort ({filteredStudents.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Students registered in your assigned teaching batches.
                </p>
              </div>

              <input
                type="text"
                placeholder="Filter cohort by student name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-xs text-slate-400 p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                No students match your filter.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {filteredStudents.slice(0, 8).map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {st.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{st.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {st.studentId} • {st.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                        {st.englishLevel || 'B1 Intermediate'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Attendance: <strong className="text-slate-800">{st.stats?.attendanceRate || 95}%</strong>
                      </span>
                      <button
                        onClick={() => {
                          setWorkflowStudentId(st.id);
                          setWorkflowType('result');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px] transition"
                      >
                        Grade
                      </button>
                      <button
                        onClick={() => {
                          setWorkflowStudentId(st.id);
                          setWorkflowType('message');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] transition"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Assessment Results */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Exam & Assessment Results</h3>
                <p className="text-xs text-slate-500">
                  Standardized CEFR scores, band determinations, and examiner feedbacks recorded by this instructor.
                </p>
              </div>
              <button
                onClick={() => setWorkflowType('result')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Record Result</span>
              </button>
            </div>

            {!dashboardData?.recentResults || dashboardData.recentResults.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl border border-slate-100">
                No exam results recorded yet. Click "Record Result" to add one.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {dashboardData.recentResults.map((res: any, idx: number) => (
                  <div
                    key={res.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{res.examTitle}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            res.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {res.passed ? 'PASSED' : 'REQUIRES RETAKE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        Student: {res.studentName || res.studentId} • Date: {res.date}
                      </p>
                      {res.examinerFeedback && (
                        <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          "{res.examinerFeedback}"
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-slate-900 block font-mono">
                        {res.score} / {res.maxScore || 100}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600 block">
                        {res.bandScore || 'CEFR Score'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Modals */}
      {workflowType === 'attendance' && (
        <TeacherAttendanceWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          classes={
            workflowClassId
              ? classes.filter((c) => c.id === workflowClassId)
              : teacher
              ? classes.filter((c) => teacher.assignedClassIds?.includes(c.id))
              : classes
          }
          students={students}
          onSubmit={handleRecordAttendance}
          isSubmitting={isWorkflowSubmitting}
        />
      )}

      {workflowType === 'homework' && (
        <TeacherHomeworkWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          courses={
            teacher ? courses.filter((c) => teacher.assignedCourseIds?.includes(c.id)) : courses
          }
          onSubmit={handleCreateHomework}
          isSubmitting={isWorkflowSubmitting}
        />
      )}

      {workflowType === 'quiz' && (
        <TeacherQuizWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          courses={
            teacher ? courses.filter((c) => teacher.assignedCourseIds?.includes(c.id)) : courses
          }
          onSubmit={handleCreateQuiz}
          isSubmitting={isWorkflowSubmitting}
        />
      )}

      {workflowType === 'result' && (
        <TeacherResultWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          students={
            workflowStudentId
              ? students.filter((s) => s.id === workflowStudentId)
              : students
          }
          onSubmit={handleRecordResult}
          isSubmitting={isWorkflowSubmitting}
        />
      )}

      {workflowType === 'message' && (
        <TeacherMessageWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          students={
            workflowStudentId
              ? students.filter((s) => s.id === workflowStudentId)
              : students
          }
          classes={
            teacher ? classes.filter((c) => teacher.assignedClassIds?.includes(c.id)) : classes
          }
          onSubmit={handleSendMessage}
          isSubmitting={isWorkflowSubmitting}
        />
      )}
    </div>
  );
};
