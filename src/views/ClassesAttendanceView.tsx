import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BatchClass, AttendanceRecord, AttendanceStatus, User } from '../types';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  HelpCircle,
  Save,
  Plus,
} from 'lucide-react';

export const ClassesAttendanceView: React.FC = () => {
  const { currentTenant, currentUser, showToast, hasRole } = useAuth();
  const [classes, setClasses] = useState<BatchClass[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // In-progress attendance entries: studentId -> { status, notes }
  const [markingEntries, setMarkingEntries] = useState<
    Record<string, { status: AttendanceStatus; notes: string }>
  >({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [classList, studentList, attList] = await Promise.all([
        api.getClasses(),
        api.getStudents(),
        api.getAttendance(),
      ]);

      setClasses(classList);
      setStudents(studentList);
      setAttendanceRecords(attList);

      if (classList.length > 0 && !selectedClassId) {
        setSelectedClassId(classList[0].id);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load classes and attendance', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant?.id]);

  // When selected class changes, pre-populate students
  const activeClass = classes.find((c) => c.id === selectedClassId);

  useEffect(() => {
    if (!activeClass) return;

    // Check if an attendance record already exists for this class & date
    const existing = attendanceRecords.find(
      (r) => r.classId === activeClass.id && r.date === selectedDate
    );

    const initialEntries: Record<string, { status: AttendanceStatus; notes: string }> = {};

    // Get enrolled students or all students if batch list empty
    const enrolledStudents =
      students.filter((s) => activeClass.studentIds?.includes(s.id)) || [];
    const targetList = enrolledStudents.length > 0 ? enrolledStudents : students;

    targetList.forEach((s) => {
      const existingEntry = existing?.entries.find((e) => e.studentId === s.id);
      initialEntries[s.id] = {
        status: existingEntry?.status || 'present',
        notes: existingEntry?.notes || '',
      };
    });

    setMarkingEntries(initialEntries);
  }, [selectedClassId, selectedDate, students, activeClass, attendanceRecords]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setMarkingEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setMarkingEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    if (!activeClass) return;
    try {
      setSaving(true);
      const entries = Object.entries(markingEntries).map(([studentId, data]: [string, { status: AttendanceStatus; notes: string }]) => {
        const student = students.find((s) => s.id === studentId);
        return {
          studentId,
          studentName: student?.fullName || 'Student',
          status: data.status,
          notes: data.notes,
        };
      });

      const saved = await api.saveAttendance({
        classId: activeClass.id,
        className: activeClass.name,
        date: selectedDate,
        entries,
        takenByTeacherId: currentUser?.id,
      });

      setAttendanceRecords((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
      showToast(
        `Attendance recorded for ${activeClass.name} (${entries.length} students)`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Enrolled list for active class
  const classStudents =
    students.filter((s) => activeClass?.studentIds?.includes(s.id)) || [];
  const displayStudents = classStudents.length > 0 ? classStudents : students;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Batches, Class Schedule & Attendance Register
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily presence tracking for{' '}
            <strong className="text-slate-700">{currentTenant?.name}</strong>.
          </p>
        </div>
      </div>

      {/* Grid: Batches & Attendance Register */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Batch Selection & Schedule Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Batch Class
            </h3>

            {loading ? (
              <p className="text-xs text-slate-400">Loading batches...</p>
            ) : classes.length === 0 ? (
              <p className="text-xs text-slate-400">No batch classes created yet.</p>
            ) : (
              <div className="space-y-2">
                {classes.map((cls) => {
                  const isSelected = cls.id === selectedClassId;
                  return (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{cls.name}</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                          {cls.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {cls.courseTitle}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cls.scheduleDay}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {cls.roomOrMeetingLink}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Class Quick Info */}
          {activeClass && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                Assigned Instructor
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm">
                  {activeClass.teacherName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{activeClass.teacherName}</h4>
                  <span className="text-[11px] text-slate-400">Senior EFL Trainer</span>
                </div>
              </div>
              <div className="border-t border-slate-800 pt-3 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Class Hours:</span>
                  <span>{activeClass.scheduleTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity:</span>
                  <span>
                    {displayStudents.length} / {activeClass.maxCapacity} Seats
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Live Interactive Attendance Marker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Attendance Register: {activeClass?.name || 'Class'}
                </h3>
                <p className="text-xs text-slate-500">
                  Mark status for each student and save directly to tenant records.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {hasRole(['ORGANIZATION_OWNER', 'ADMIN', 'TEACHER']) && (
                  <button
                    onClick={handleSaveAttendance}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Register'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Attendance Roster Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-medium">Student Name</th>
                    <th className="pb-3 font-medium">CEFR Level</th>
                    <th className="pb-3 font-medium text-center">Attendance Status</th>
                    <th className="pb-3 font-medium">Session Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayStudents.map((st) => {
                    const currentStatus = markingEntries[st.id]?.status || 'present';
                    const currentNotes = markingEntries[st.id]?.notes || '';

                    return (
                      <tr key={st.id} className="text-slate-700 hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">
                          {st.fullName}
                          {st.fullNameAr && (
                            <span className="text-[11px] text-slate-400 block font-serif">
                              {st.fullNameAr}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                            {st.studentDetails?.level || 'B2'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'present')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'late')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                currentStatus === 'late'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'absent')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                currentStatus === 'absent'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'excused')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                currentStatus === 'excused'
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Excused
                            </button>
                          </div>
                        </td>
                        <td className="py-3">
                          <input
                            type="text"
                            value={currentNotes}
                            onChange={(e) => handleNotesChange(st.id, e.target.value)}
                            placeholder="Teacher observation..."
                            className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
