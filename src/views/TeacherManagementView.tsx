import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  TeacherProfile,
  TeacherListResponse,
  TeacherStatus,
  Course,
  BatchClass,
  StudentProfile,
  TeacherAvailabilityDay,
} from '../types';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  BookOpen,
  CalendarCheck,
  Award,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  FileCheck2,
} from 'lucide-react';
import { TeacherFormModal } from '../components/teachers/TeacherFormModal';
import { TeacherProfileModal } from '../components/teachers/TeacherProfileModal';
import { ConfirmDialogModal } from '../components/students/ConfirmDialogModal';
import { TeacherAttendanceWorkflowModal } from '../components/teachers/TeacherAttendanceWorkflowModal';
import { TeacherHomeworkWorkflowModal } from '../components/teachers/TeacherHomeworkWorkflowModal';
import { TeacherQuizWorkflowModal } from '../components/teachers/TeacherQuizWorkflowModal';
import { TeacherResultWorkflowModal } from '../components/teachers/TeacherResultWorkflowModal';
import { TeacherMessageWorkflowModal } from '../components/teachers/TeacherMessageWorkflowModal';

export const TeacherManagementView: React.FC = () => {
  const { currentTenant, currentUser, activeRole, showToast } = useAuth();

  // State
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<BatchClass[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specFilter, setSpecFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [stats, setStats] = useState<TeacherListResponse['stats']>({
    total: 0,
    active: 0,
    onLeave: 0,
    inactive: 0,
    fullTime: 0,
    partTime: 0,
    adjunct: 0,
    contractor: 0,
  });

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);

  const [selectedTeacherForProfile, setSelectedTeacherForProfile] = useState<TeacherProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [deleteCandidate, setDeleteCandidate] = useState<TeacherProfile | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Workflow modals
  const [activeWorkflowTeacher, setActiveWorkflowTeacher] = useState<TeacherProfile | null>(null);
  const [workflowType, setWorkflowType] = useState<
    'attendance' | 'homework' | 'quiz' | 'result' | 'message' | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Teachers & Master Reference Data
  const loadTeachers = async () => {
    try {
      setLoading(true);
      const res = (await api.getTeachers({
        search,
        status: statusFilter,
        specialization: specFilter,
        page: currentPage,
        limit: pageSize,
      })) as TeacherListResponse;

      setTeachers(res.items || []);
      setTotalItems(res.total || 0);
      setTotalPages(res.totalPages || 1);
      if (res.stats) setStats(res.stats);
    } catch (err: any) {
      showToast(err.message || 'Failed to load faculty list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadReferenceData = async () => {
    try {
      const [crsList, clsList, stdRes] = await Promise.all([
        api.getCourses(),
        api.getClasses(),
        api.getPagedStudents({ limit: 100 }),
      ]);
      setCourses(crsList);
      setClasses(clsList);
      setStudents(stdRes.students || []);
    } catch (err) {
      console.error('Failed to load reference data', err);
    }
  };

  useEffect(() => {
    loadReferenceData();
  }, [currentTenant?.id]);

  useEffect(() => {
    loadTeachers();
  }, [currentTenant?.id, search, statusFilter, specFilter, currentPage]);

  // CRUD Handlers
  const handleCreateOrUpdateTeacher = async (data: Partial<TeacherProfile>) => {
    try {
      setIsSubmitting(true);
      if (editingTeacher) {
        const updated = await api.updateTeacher(editingTeacher.id, data);
        showToast(`Teacher ${updated.fullName} updated successfully!`, 'success');
      } else {
        const created = await api.createTeacher(data);
        showToast(`Teacher ${created.fullName} enrolled successfully!`, 'success');
      }
      setIsAddEditOpen(false);
      setEditingTeacher(null);
      await loadTeachers();
    } catch (err: any) {
      showToast(err.message || 'Failed to save teacher', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!deleteCandidate) return;
    try {
      setIsSubmitting(true);
      await api.deleteTeacher(deleteCandidate.id);
      showToast(`Teacher ${deleteCandidate.fullName} removed successfully!`, 'success');
      setIsDeleteOpen(false);
      setDeleteCandidate(null);
      await loadTeachers();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete teacher', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAvailability = async (availability: TeacherAvailabilityDay[]) => {
    if (!selectedTeacherForProfile) return;
    try {
      const updated = await api.updateTeacherAvailability(
        selectedTeacherForProfile.id,
        availability
      );
      setSelectedTeacherForProfile(updated);
      showToast('Teacher weekly availability schedule saved!', 'success');
      await loadTeachers();
    } catch (err: any) {
      showToast(err.message || 'Failed to update availability', 'error');
    }
  };

  // Workflow Handlers
  const handleRecordAttendance = async (payload: {
    classId: string;
    date: string;
    entries: any[];
  }) => {
    if (!activeWorkflowTeacher) return;
    try {
      setIsSubmitting(true);
      await api.recordTeacherAttendance(activeWorkflowTeacher.id, payload);
      showToast('Attendance recorded and synced to database!', 'success');
      setWorkflowType(null);
      await loadTeachers();
    } catch (err: any) {
      showToast(err.message || 'Failed to record attendance', 'error');
    } finally {
      setIsSubmitting(false);
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
    if (!activeWorkflowTeacher) return;
    try {
      setIsSubmitting(true);
      await api.createTeacherHomework(activeWorkflowTeacher.id, payload);
      showToast(`Homework "${payload.title}" created successfully!`, 'success');
      setWorkflowType(null);
      await loadTeachers();
    } catch (err: any) {
      showToast(err.message || 'Failed to create homework', 'error');
    } finally {
      setIsSubmitting(false);
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
    if (!activeWorkflowTeacher) return;
    try {
      setIsSubmitting(true);
      await api.createTeacherQuiz(activeWorkflowTeacher.id, payload);
      showToast(`Quiz "${payload.title}" created and published!`, 'success');
      setWorkflowType(null);
      await loadTeachers();
    } catch (err: any) {
      showToast(err.message || 'Failed to create quiz', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordResult = async (payload: any) => {
    if (!activeWorkflowTeacher) return;
    try {
      setIsSubmitting(true);
      await api.recordTeacherExamResult(activeWorkflowTeacher.id, payload);
      showToast('Exam score and feedback saved to student file!', 'success');
      setWorkflowType(null);
      await loadTeachers();
    } catch (err: any) {
      showToast(err.message || 'Failed to record result', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (payload: any) => {
    if (!activeWorkflowTeacher) return;
    try {
      setIsSubmitting(true);
      await api.sendTeacherMessage(activeWorkflowTeacher.id, payload);
      showToast(`Message sent to ${payload.recipientName}!`, 'success');
      setWorkflowType(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canManage =
    activeRole === 'ORGANIZATION_OWNER' ||
    activeRole === 'ADMIN' ||
    activeRole === 'SUPER_ADMIN' ||
    activeRole === 'MANAGER';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Faculty & Teacher Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified instructor profiles, curriculum assignments, availability schedules, and grading
            workflows for <strong className="text-slate-700">{currentTenant?.name}</strong>
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsAddEditOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Teacher</span>
          </button>
        )}
      </div>

      {/* Teacher Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Instructors
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.total || 0}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
            <span className="text-emerald-600 font-semibold">{stats?.active || 0} Active</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{stats?.onLeave || 0} On Leave</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Contract Status
          </p>
          <p className="text-2xl font-black text-indigo-950 mt-1">{stats?.fullTime || 0}</p>
          <p className="text-[11px] text-indigo-600 mt-0.5">
            Full-Time Staff ({stats?.adjunct || 0} Adjunct / Part-Time)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Assigned Batches
          </p>
          <p className="text-2xl font-black text-emerald-950 mt-1">{classes.length}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Active classroom sections</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Average Faculty Rating
          </p>
          <p className="text-2xl font-black text-amber-500 mt-1">
            4.9 <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Student satisfaction index</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty name, email, employee ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Employment Status</option>
            <option value="active">Active Faculty</option>
            <option value="on_leave">On Sabbatical / Leave</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={specFilter}
            onChange={(e) => {
              setSpecFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Specializations</option>
            <option value="General English">General English</option>
            <option value="IELTS">IELTS Preparation</option>
            <option value="Business English">Business English</option>
            <option value="Linguistics">Linguistics & Grammar</option>
          </select>
        </div>
      </div>

      {/* Desktop Responsive Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-2"></div>
            Loading faculty records...
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No teachers found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or add your first certified teacher to this academy.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Instructor Profile</th>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Specialization & Credentials</th>
                    <th className="py-3 px-4">Assignments</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Rate</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
                            {t.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{t.fullName}</span>
                              {t.fullNameAr && (
                                <span className="text-[11px] text-slate-400 font-serif">
                                  ({t.fullNameAr})
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block">{t.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 font-semibold">
                        {t.employeeId}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            {t.specialization}
                          </span>
                          <span className="text-[10px] text-slate-500 block line-clamp-1">
                            {t.qualification}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                            {t.assignedCourseIds?.length || 0} Courses
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                            {t.assignedClassIds?.length || 0} Batches
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            t.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'on_leave'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {t.hourlyRate} {t.currency || 'SAR'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedTeacherForProfile(t);
                              setIsProfileOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canManage && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingTeacher(t);
                                  setIsAddEditOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                                title="Edit Teacher"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setDeleteCandidate(t);
                                  setIsDeleteOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete Teacher"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile-Friendly Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {teachers.map((t) => (
                <div key={t.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                        {t.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{t.fullName}</h4>
                        <p className="text-[11px] text-slate-500">{t.email}</p>
                        <span className="text-[10px] font-mono text-amber-700">{t.employeeId}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'on_leave'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-slate-800">{t.specialization}</p>
                    <p className="text-[11px] text-slate-500">{t.qualification}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                        {t.assignedCourseIds?.length || 0} Courses
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                        {t.assignedClassIds?.length || 0} Batches
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-700 ml-auto">
                        {t.hourlyRate} {t.currency || 'SAR'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedTeacherForProfile(t);
                        setIsProfileOpen(true);
                      }}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold"
                    >
                      View Profile
                    </button>
                    {canManage && (
                      <>
                        <button
                          onClick={() => {
                            setEditingTeacher(t);
                            setIsAddEditOpen(true);
                          }}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteCandidate(t);
                            setIsDeleteOpen(true);
                          }}
                          className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong>{teachers.length}</strong> of <strong>{totalItems}</strong> instructors
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isAddEditOpen && (
        <TeacherFormModal
          isOpen={isAddEditOpen}
          onClose={() => {
            setIsAddEditOpen(false);
            setEditingTeacher(null);
          }}
          onSubmit={handleCreateOrUpdateTeacher}
          initialData={editingTeacher}
          courses={courses}
          classes={classes}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Teacher Profile Modal */}
      {isProfileOpen && selectedTeacherForProfile && (
        <TeacherProfileModal
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setSelectedTeacherForProfile(null);
          }}
          teacher={selectedTeacherForProfile}
          courses={courses}
          classes={classes}
          allStudents={students}
          onUpdateAvailability={handleUpdateAvailability}
          onTriggerWorkflow={(wf) => {
            setActiveWorkflowTeacher(selectedTeacherForProfile);
            setWorkflowType(wf);
          }}
          onEdit={() => {
            setEditingTeacher(selectedTeacherForProfile);
            setIsProfileOpen(false);
            setIsAddEditOpen(true);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteOpen && deleteCandidate && (
        <ConfirmDialogModal
          isOpen={isDeleteOpen}
          title="Delete Teacher Profile"
          message={`Are you sure you want to delete ${deleteCandidate.fullName} (${deleteCandidate.employeeId}) from this academy? This will dissociate them from assigned classes and courses.`}
          confirmLabel="Delete Teacher"
          cancelLabel="Cancel"
          isDestructive={true}
          onConfirm={handleDeleteTeacher}
          onCancel={() => {
            setIsDeleteOpen(false);
            setDeleteCandidate(null);
          }}
        />
      )}

      {/* Workflow Modals */}
      {workflowType === 'attendance' && activeWorkflowTeacher && (
        <TeacherAttendanceWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          classes={classes.filter((c) => activeWorkflowTeacher.assignedClassIds?.includes(c.id))}
          students={students}
          onSubmit={handleRecordAttendance}
          isSubmitting={isSubmitting}
        />
      )}

      {workflowType === 'homework' && activeWorkflowTeacher && (
        <TeacherHomeworkWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          courses={courses.filter((c) => activeWorkflowTeacher.assignedCourseIds?.includes(c.id))}
          onSubmit={handleCreateHomework}
          isSubmitting={isSubmitting}
        />
      )}

      {workflowType === 'quiz' && activeWorkflowTeacher && (
        <TeacherQuizWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          courses={courses.filter((c) => activeWorkflowTeacher.assignedCourseIds?.includes(c.id))}
          onSubmit={handleCreateQuiz}
          isSubmitting={isSubmitting}
        />
      )}

      {workflowType === 'result' && activeWorkflowTeacher && (
        <TeacherResultWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          students={students}
          onSubmit={handleRecordResult}
          isSubmitting={isSubmitting}
        />
      )}

      {workflowType === 'message' && activeWorkflowTeacher && (
        <TeacherMessageWorkflowModal
          isOpen={true}
          onClose={() => setWorkflowType(null)}
          students={students}
          classes={classes.filter((c) => activeWorkflowTeacher.assignedClassIds?.includes(c.id))}
          onSubmit={handleSendMessage}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
