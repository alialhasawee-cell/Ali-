import React, { useState, useEffect } from 'react';
import { BatchClass, StudentProfile } from '../../types';
import { X, CalendarCheck, Check, Clock, AlertCircle } from 'lucide-react';

interface AttendanceEntry {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

interface TeacherAttendanceWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: BatchClass[];
  students: StudentProfile[];
  onSubmit: (payload: { classId: string; date: string; entries: AttendanceEntry[] }) => Promise<void>;
  isSubmitting?: boolean;
}

export const TeacherAttendanceWorkflowModal: React.FC<TeacherAttendanceWorkflowModalProps> = ({
  isOpen,
  onClose,
  classes,
  students,
  onSubmit,
  isSubmitting = false,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    // Populate students for selected class or all students
    const classStudents = students.filter(
      (s) => !selectedClassId || s.enrolledClassId === selectedClassId
    );
    const targetStudents = classStudents.length > 0 ? classStudents : students.slice(0, 10);

    setEntries(
      targetStudents.map((st) => ({
        studentId: st.id,
        studentName: st.fullName,
        status: 'present',
        remarks: '',
      }))
    );
  }, [selectedClassId, students]);

  if (!isOpen) return null;

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, status } : e))
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, remarks } : e))
    );
  };

  const setAllStatus = (status: 'present' | 'absent') => {
    setEntries((prev) => prev.map((e) => ({ ...e, status })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
    await onSubmit({
      classId: selectedClassId,
      date,
      entries,
    });
  };

  return (
    <div
      id="teacher-attendance-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="teacher-attendance-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Record Live Class Attendance</h2>
              <p className="text-xs text-slate-500">
                Log student presence, tardiness, and pedagogical session notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white shrink-0">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Teaching Batch / Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.courseTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
            <span className="font-semibold text-slate-600">
              Students Roster ({entries.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAllStatus('present')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => setAllStatus('absent')}
                className="text-[11px] font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {entries.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No students found for this class.</p>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.studentId}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">{entry.studentName}</span>

                    {/* Status radio pills */}
                    <div className="flex items-center gap-1.5">
                      {(['present', 'absent', 'late', 'excused'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(entry.studentId, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition border ${
                            entry.status === st
                              ? st === 'present'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : st === 'absent'
                                ? 'bg-rose-600 text-white border-rose-600'
                                : st === 'late'
                                ? 'bg-amber-500 text-white border-amber-500'
                                : 'bg-slate-600 text-white border-slate-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Remarks (e.g. Arrived 10 mins late, participating actively...)"
                    value={entry.remarks || ''}
                    onChange={(e) => handleRemarksChange(entry.studentId, e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-600"
                  />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || entries.length === 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Confirm Attendance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
