import React, { useState } from 'react';
import {
  TeacherProfile,
  TeacherAvailabilityDay,
  Course,
  BatchClass,
  StudentProfile,
} from '../../types';
import {
  X,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  Users,
  MessageSquare,
  DollarSign,
  Briefcase,
  Sparkles,
  History,
  Send,
  Plus,
} from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  courses: Course[];
  classes: BatchClass[];
  allStudents?: StudentProfile[];
  onUpdateAvailability: (availability: TeacherAvailabilityDay[]) => Promise<void>;
  onTriggerWorkflow: (workflow: 'attendance' | 'homework' | 'quiz' | 'result' | 'message') => void;
  onEdit: () => void;
}

type ProfileTab =
  | 'overview'
  | 'availability'
  | 'courses-classes'
  | 'students'
  | 'attendance'
  | 'homework'
  | 'exams'
  | 'performance'
  | 'activity';

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacher,
  courses,
  classes,
  allStudents = [],
  onUpdateAvailability,
  onTriggerWorkflow,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [availabilitySchedule, setAvailabilitySchedule] = useState<TeacherAvailabilityDay[]>(
    teacher.availability && teacher.availability.length > 0
      ? teacher.availability
      : [
          { day: 'Monday', slots: ['morning', 'evening'], isAvailable: true },
          { day: 'Tuesday', slots: ['morning', 'afternoon', 'evening'], isAvailable: true },
          { day: 'Wednesday', slots: ['evening'], isAvailable: true },
          { day: 'Thursday', slots: ['morning', 'afternoon'], isAvailable: true },
          { day: 'Friday', slots: [], isAvailable: false },
          { day: 'Saturday', slots: ['morning', 'afternoon'], isAvailable: true },
          { day: 'Sunday', slots: [], isAvailable: false },
        ]
  );
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [availabilityChanged, setAvailabilityChanged] = useState(false);

  if (!isOpen) return null;

  // Filter assigned entities
  const assignedCourses = courses.filter((c) => teacher.assignedCourseIds?.includes(c.id));
  const assignedClasses = classes.filter((cl) => teacher.assignedClassIds?.includes(cl.id));

  // Determine assigned students based on assigned classes
  const assignedStudents = allStudents.filter((s) => {
    return (
      (s.assignedTeacherId && s.assignedTeacherId === teacher.id) ||
      (s.enrolledClassId && teacher.assignedClassIds?.includes(s.enrolledClassId))
    );
  });

  const handleToggleDay = (index: number) => {
    const updated = [...availabilitySchedule];
    updated[index].isAvailable = !updated[index].isAvailable;
    if (!updated[index].isAvailable) {
      updated[index].slots = [];
    } else if (updated[index].slots.length === 0) {
      updated[index].slots = ['morning', 'evening'];
    }
    setAvailabilitySchedule(updated);
    setAvailabilityChanged(true);
  };

  const handleToggleSlot = (dayIndex: number, slot: string) => {
    const updated = [...availabilitySchedule];
    const currentSlots = updated[dayIndex].slots;
    if (currentSlots.includes(slot)) {
      updated[dayIndex].slots = currentSlots.filter((s) => s !== slot);
      if (updated[dayIndex].slots.length === 0) {
        updated[dayIndex].isAvailable = false;
      }
    } else {
      updated[dayIndex].slots = [...currentSlots, slot];
      updated[dayIndex].isAvailable = true;
    }
    setAvailabilitySchedule(updated);
    setAvailabilityChanged(true);
  };

  const handleSaveAvailability = async () => {
    try {
      setSavingAvailability(true);
      await onUpdateAvailability(availabilitySchedule);
      setAvailabilityChanged(false);
    } finally {
      setSavingAvailability(false);
    }
  };

  return (
    <div
      id="teacher-profile-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="teacher-profile-card"
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Profile Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
                {teacher.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white tracking-tight">{teacher.fullName}</h1>
                  {teacher.fullNameAr && (
                    <span className="text-sm text-slate-300 font-serif">({teacher.fullNameAr})</span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      teacher.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : teacher.status === 'on_leave'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}
                  >
                    {teacher.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1.5">
                  <span className="flex items-center gap-1 font-mono text-amber-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    {teacher.employeeId}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {teacher.email}
                  </span>
                  {teacher.phone && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {teacher.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={onEdit}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-1.5"
              >
                Edit Details
              </button>
            </div>
          </div>

          {/* Quick Workflow Action Toolbar */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-300 mr-1">Faculty Workflows:</span>
            <button
              onClick={() => onTriggerWorkflow('attendance')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Record Attendance</span>
            </button>
            <button
              onClick={() => onTriggerWorkflow('homework')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Create Homework</span>
            </button>
            <button
              onClick={() => onTriggerWorkflow('quiz')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Quiz</span>
            </button>
            <button
              onClick={() => onTriggerWorkflow('result')}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Record Result</span>
            </button>
            <button
              onClick={() => onTriggerWorkflow('message')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 flex gap-1 overflow-x-auto shrink-0">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'availability', label: 'Availability' },
              { id: 'courses-classes', label: 'Courses & Batches' },
              { id: 'students', label: `Assigned Students (${assignedStudents.length})` },
              { id: 'attendance', label: 'Attendance' },
              { id: 'homework', label: 'Homework' },
              { id: 'exams', label: 'Exams & Quizzes' },
              { id: 'performance', label: 'Performance' },
              { id: 'activity', label: 'Activity History' },
            ] as { id: ProfileTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Assigned Courses
                  </p>
                  <p className="text-2xl font-black text-indigo-950 mt-1">
                    {teacher.assignedCourseIds?.length || 0}
                  </p>
                  <p className="text-[10px] text-indigo-600 mt-0.5">Active curricula</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Live Batches
                  </p>
                  <p className="text-2xl font-black text-emerald-950 mt-1">
                    {teacher.assignedClassIds?.length || 0}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Scheduled classes</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Student Rating
                  </p>
                  <p className="text-2xl font-black text-amber-950 mt-1">
                    {teacher.performance?.studentSatisfactionRating?.toFixed(1) || '4.9'} / 5.0
                  </p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Satisfaction score</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Total Students
                  </p>
                  <p className="text-2xl font-black text-purple-950 mt-1">
                    {assignedStudents.length || teacher.performance?.totalStudentsTaught || 24}
                  </p>
                  <p className="text-[10px] text-purple-600 mt-0.5">Assigned cohort</p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Faculty Credentials */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    Professional Credentials & Specialization
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Specialization</span>
                      <span className="font-semibold text-slate-800">{teacher.specialization}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Highest Teaching Qualification</span>
                      <span className="font-semibold text-slate-800">{teacher.qualification}</span>
                    </div>
                    {teacher.bio && (
                      <div>
                        <span className="text-slate-400 block text-[11px]">Faculty Bio</span>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{teacher.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contract & Compensation */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    Contractual Details & Rate
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Contract Type</span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {teacher.contractType?.replace('_', ' ') || 'Full Time'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Hourly Rate</span>
                      <span className="font-mono font-bold text-slate-900">
                        {teacher.hourlyRate} {teacher.currency || 'SAR'} / hour
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Joined Academy</span>
                      <span className="font-mono text-slate-600">
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {teacher.notes && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block">Internal Notes:</span>
                        <p className="text-slate-600 text-[11px] italic mt-0.5">{teacher.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AVAILABILITY SCHEDULE */}
          {activeTab === 'availability' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Weekly Teaching Availability Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Configure days and time slots when {teacher.fullName} is available for classes and 1-on-1 tutoring.
                  </p>
                </div>
                {availabilityChanged && (
                  <button
                    onClick={handleSaveAvailability}
                    disabled={savingAvailability}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {savingAvailability ? 'Saving...' : 'Save Availability'}
                  </button>
                )}
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                {availabilitySchedule.map((day, dIdx) => (
                  <div key={day.day} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-36">
                      <input
                        type="checkbox"
                        checked={day.isAvailable}
                        onChange={() => handleToggleDay(dIdx)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span className={`text-xs font-bold ${day.isAvailable ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                        {day.day}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      {['morning', 'afternoon', 'evening'].map((slot) => {
                        const isSlotSelected = day.slots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleToggleSlot(dIdx, slot)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                              isSlotSelected
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            <span className="capitalize">{slot}</span>
                            <span className="text-[10px] ml-1 text-slate-400">
                              {slot === 'morning' ? '(08:00 - 12:00)' : slot === 'afternoon' ? '(12:00 - 17:00)' : '(17:00 - 21:00)'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        day.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {day.isAvailable ? `${day.slots.length} slots active` : 'Unavailable'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ASSIGNED COURSES & BATCHES */}
          {activeTab === 'courses-classes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Assigned Teaching Courses ({assignedCourses.length})
                </h3>
                {assignedCourses.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    No courses assigned yet. Edit this teacher profile to assign courses.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignedCourses.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{c.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                            {c.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-2 font-mono">
                          <span>Modules: {c.modules?.length || 0}</span>
                          <span>•</span>
                          <span>Duration: {c.durationWeeks} Weeks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Live Teaching Batches / Classes ({assignedClasses.length})
                </h3>
                {assignedClasses.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    No classes currently assigned.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignedClasses.map((cls) => (
                      <div key={cls.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                            Active Batch
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-600 font-medium">{cls.courseTitle}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {cls.scheduleDay} • {cls.scheduleTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNED STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enrolled Student Cohort</h3>
                  <p className="text-xs text-slate-500">
                    Students instructed by {teacher.fullName} across assigned batches.
                  </p>
                </div>
                <button
                  onClick={() => onTriggerWorkflow('message')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Broadcast to Class</span>
                </button>
              </div>

              {assignedStudents.length === 0 ? (
                <p className="text-xs text-slate-400 p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  No students currently assigned to this teacher's batches.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white divide-y divide-slate-100">
                  {assignedStudents.map((st) => (
                    <div key={st.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs">
                          {st.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{st.fullName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                              {st.studentId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{st.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {st.englishLevel || 'B1 Intermediate'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Attendance: <strong className="text-slate-700">{st.stats?.attendanceRate || 95}%</strong>
                        </span>
                        <button
                          onClick={() => onTriggerWorkflow('result')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        >
                          Grade Student
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Faculty Attendance & Teaching Logs</h3>
                  <p className="text-xs text-slate-500">
                    Sessions conducted, punctuality, and student attendance records.
                  </p>
                </div>
                <button
                  onClick={() => onTriggerWorkflow('attendance')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Today's Attendance</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Sessions Conducted</p>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    {teacher.performance?.attendanceRate ? '48 Classes' : '32 Classes'}
                  </p>
                  <p className="text-[10px] text-emerald-600">100% on schedule</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Student Attendance Rate</p>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    {teacher.performance?.attendanceRate || 96.5}%
                  </p>
                  <p className="text-[10px] text-slate-500">Average across batches</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Punctuality Score</p>
                  <p className="text-xl font-black text-slate-900 mt-1">99.2%</p>
                  <p className="text-[10px] text-indigo-600">Standard punctuality</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Recent Attendance Sessions</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { date: '2026-09-08', class: 'Batch A - General Fluency', present: 14, total: 15 },
                    { date: '2026-09-06', class: 'Batch B - IELTS Academic', present: 10, total: 10 },
                    { date: '2026-09-04', class: 'Batch A - General Fluency', present: 15, total: 15 },
                  ].map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800">{rec.class}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-2">{rec.date}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        {rec.present} / {rec.total} Present ({Math.round((rec.present / rec.total) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HOMEWORK */}
          {activeTab === 'homework' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Assigned Homework & Essay Tasks</h3>
                  <p className="text-xs text-slate-500">
                    Tasks designed by {teacher.fullName} and submission evaluation logs.
                  </p>
                </div>
                <button
                  onClick={() => onTriggerWorkflow('homework')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Homework</span>
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'IELTS Academic Writing Task 2 - AI Ethics Essay',
                    course: 'IELTS Preparation Elite',
                    dueDate: '2026-09-15',
                    maxScore: 100,
                    submissions: '12 / 14 Submissions',
                  },
                  {
                    title: 'Business Negotiation Vocabulary Drill',
                    course: 'Business English & Executive Communication',
                    dueDate: '2026-09-12',
                    maxScore: 50,
                    submissions: '8 / 8 Submissions',
                  },
                ].map((hw, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{hw.title}</h4>
                      <span className="text-[11px] font-mono text-slate-500">Due: {hw.dueDate}</span>
                    </div>
                    <p className="text-[11px] text-indigo-600 font-medium">{hw.course}</p>
                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 border-t border-slate-100">
                      <span>Max Score: {hw.maxScore} pts</span>
                      <span className="font-semibold text-emerald-600">{hw.submissions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: EXAMS & QUIZZES */}
          {activeTab === 'exams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Examinations & Assessment Tools</h3>
                  <p className="text-xs text-slate-500">
                    Formative quizzes and standardized CEFR tests managed by this instructor.
                  </p>
                </div>
                <button
                  onClick={() => onTriggerWorkflow('quiz')}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Quiz</span>
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Mid-Term CEFR B2 Diagnostic Exam',
                    course: 'General English & Fluency',
                    questions: 30,
                    duration: '45 mins',
                    passRate: '92% Pass Rate',
                  },
                  {
                    title: 'Academic Collocations & Phrasal Verbs Test',
                    course: 'IELTS Preparation Elite',
                    questions: 20,
                    duration: '25 mins',
                    passRate: '88% Pass Rate',
                  },
                ].map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{ex.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded">
                        {ex.passRate}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-600 font-medium">{ex.course}</p>
                    <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400 font-mono border-t border-slate-100">
                      <span>{ex.questions} Questions</span>
                      <span>•</span>
                      <span>Duration: {ex.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Student Pass Rate</p>
                  <p className="text-3xl font-black text-indigo-600">
                    {teacher.performance?.studentPassRate || 94.2}%
                  </p>
                  <p className="text-[11px] text-slate-500">Above academy benchmark (85%)</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Teaching Satisfaction</p>
                  <p className="text-3xl font-black text-amber-500">
                    {teacher.performance?.studentSatisfactionRating?.toFixed(1) || '4.9'} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Based on 68 anonymous evaluations</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Lifetime Students</p>
                  <p className="text-3xl font-black text-emerald-600">
                    {teacher.performance?.totalStudentsTaught || 140}
                  </p>
                  <p className="text-[11px] text-slate-500">Accredited graduates</p>
                </div>
              </div>

              {/* Performance Feedback */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pedagogical Quality Review & Feedback
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-700 italic">
                      "Consistently demonstrates exemplary lesson planning and interactive communicative methodology. Students show significant acceleration in spoken confidence within 4 weeks."
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      — Academic Director Inspection Report
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ACTIVITY HISTORY */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Faculty Audit Log & Activity Trail</h3>
                <p className="text-xs text-slate-500">
                  Chronological records of grades submitted, attendance marked, and profile updates.
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                {(teacher.activityLog && teacher.activityLog.length > 0
                  ? teacher.activityLog
                  : [
                      {
                        id: 'act_1',
                        action: 'ATTENDANCE_RECORDED',
                        details: 'Recorded attendance for Batch A (15 students present)',
                        timestamp: new Date().toISOString(),
                      },
                      {
                        id: 'act_2',
                        action: 'HOMEWORK_EVALUATED',
                        details: 'Graded 12 essays for IELTS Academic Writing Task 2',
                        timestamp: new Date(Date.now() - 86400000).toISOString(),
                      },
                      {
                        id: 'act_3',
                        action: 'QUIZ_CREATED',
                        details: 'Published Mid-Term CEFR B2 Diagnostic Exam',
                        timestamp: new Date(Date.now() - 172800000).toISOString(),
                      },
                    ]
                ).map((act, i) => (
                  <div key={act.id || i} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-200"></div>
                    <p className="text-xs font-bold text-slate-900">{act.action.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{act.details}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      {new Date(act.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Teacher ID: {teacher.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
