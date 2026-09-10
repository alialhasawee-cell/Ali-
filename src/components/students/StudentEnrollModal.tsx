import React, { useState } from 'react';
import { Course, BatchClass, StudentProfile } from '../../types';
import { BookOpen, Calendar, X, Check, AlertCircle } from 'lucide-react';

interface StudentEnrollModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  courses: Course[];
  classes: BatchClass[];
  onClose: () => void;
  onEnroll: (studentId: string, courseId: string, classId?: string) => Promise<void>;
}

export const StudentEnrollModal: React.FC<StudentEnrollModalProps> = ({
  isOpen,
  student,
  courses,
  classes,
  onClose,
  onEnroll,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  // Filter available classes matching the selected course
  const availableClasses = selectedCourseId
    ? classes.filter((c) => c.courseId === selectedCourseId)
    : classes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setError('Please select an English course to enroll.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onEnroll(student.id, selectedCourseId, selectedClassId || undefined);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to enroll student into course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="student-enroll-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="student-enroll-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enroll Student into Course</h3>
              <p className="text-xs text-slate-500">
                Register {student.fullName} ({student.studentAdmissionNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Enrolled Courses Warning */}
          {student.courses && student.courses.length > 0 && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Currently Enrolled Courses:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.courses.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700"
                  >
                    <BookOpen className="w-3 h-3 text-indigo-500" />
                    {c.courseTitle} ({c.status})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select English Course <span className="text-rose-500">*</span>
            </label>
            <select
              id="enroll-course-select"
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedClassId('');
              }}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">-- Choose Course --</option>
              {courses.map((crs) => (
                <option key={crs.id} value={crs.id}>
                  {crs.title} ({crs.code} • {crs.level} • {crs.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign to Batch / Schedule Class (Optional)
            </label>
            <select
              id="enroll-class-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">-- No specific batch (Self-paced / To be scheduled) --</option>
              {availableClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} (Teacher: {cls.teacherName} • {cls.scheduleDay} {cls.scheduleTime})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Batch classes help organize live schedules and attendance logs.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              id="submit-enroll-btn"
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition flex items-center gap-2"
            >
              {submitting ? (
                <>Processing Enrollment...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm Enrollment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
