import React, { useState, useEffect } from 'react';
import { TeacherProfile, TeacherStatus, Course, BatchClass } from '../../types';
import { X, UserCheck, Mail, Phone, Award, DollarSign, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TeacherProfile>) => Promise<void>;
  initialData?: TeacherProfile | null;
  courses: Course[];
  classes: BatchClass[];
  isSubmitting?: boolean;
}

const SPECIALIZATION_OPTIONS = [
  'General English & Fluency',
  'IELTS & Academic Test Prep',
  'Business English & Executive',
  'TOEFL & Academic Writing',
  'Grammar & Linguistics',
  'Pronunciation & Accent Training',
  'Kids & Teens English',
];

const QUALIFICATION_OPTIONS = [
  'DELTA (Diploma in Teaching English to Adults)',
  'CELTA (Cambridge Certificate)',
  'MA Applied Linguistics',
  'BA English Literature & TESOL',
  'Cambridge Certified CELTA (Pass A)',
  'TESOL / TEFL 120-Hour Certified',
];

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  courses,
  classes,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Partial<TeacherProfile>>({
    fullName: '',
    fullNameAr: '',
    email: '',
    phone: '',
    employeeId: '',
    specialization: SPECIALIZATION_OPTIONS[0],
    qualification: QUALIFICATION_OPTIONS[0],
    bio: '',
    status: 'active',
    contractType: 'full_time',
    hourlyRate: 150,
    currency: 'SAR',
    assignedCourseIds: [],
    assignedClassIds: [],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        fullNameAr: initialData.fullNameAr || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        employeeId: initialData.employeeId || '',
        specialization: initialData.specialization || SPECIALIZATION_OPTIONS[0],
        qualification: initialData.qualification || QUALIFICATION_OPTIONS[0],
        bio: initialData.bio || '',
        status: initialData.status || 'active',
        contractType: initialData.contractType || 'full_time',
        hourlyRate: initialData.hourlyRate || 150,
        currency: initialData.currency || 'SAR',
        assignedCourseIds: initialData.assignedCourseIds || [],
        assignedClassIds: initialData.assignedClassIds || [],
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        fullName: '',
        fullNameAr: '',
        email: '',
        phone: '',
        employeeId: `TCH-${Math.floor(1000 + Math.random() * 9000)}`,
        specialization: SPECIALIZATION_OPTIONS[0],
        qualification: QUALIFICATION_OPTIONS[0],
        bio: '',
        status: 'active',
        contractType: 'full_time',
        hourlyRate: 150,
        currency: 'SAR',
        assignedCourseIds: courses.slice(0, 1).map((c) => c.id),
        assignedClassIds: classes.slice(0, 1).map((cl) => cl.id),
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, courses, classes]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName?.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    if (!formData.email?.trim()) {
      errs.email = 'Valid academic email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (formData.hourlyRate !== undefined && Number(formData.hourlyRate) < 0) {
      errs.hourlyRate = 'Hourly rate cannot be negative.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const toggleCourse = (courseId: string) => {
    const current = formData.assignedCourseIds || [];
    if (current.includes(courseId)) {
      setFormData({ ...formData, assignedCourseIds: current.filter((id) => id !== courseId) });
    } else {
      setFormData({ ...formData, assignedCourseIds: [...current, courseId] });
    }
  };

  const toggleClass = (classId: string) => {
    const current = formData.assignedClassIds || [];
    if (current.includes(classId)) {
      setFormData({ ...formData, assignedClassIds: current.filter((id) => id !== classId) });
    } else {
      setFormData({ ...formData, assignedClassIds: [...current, classId] });
    }
  };

  return (
    <div
      id="teacher-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="teacher-form-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Faculty Member' : 'Add New Teacher'}
              </h2>
              <p className="text-xs text-slate-500">
                {initialData
                  ? `Update credential, assignments, and contract details for ${initialData.fullName}`
                  : 'Enroll a certified instructor into your academy partition'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.fullName ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.fullName && <p className="text-[10px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (Arabic / الاسم بالعربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="د. سارة جنكنز"
                  value={formData.fullNameAr || ''}
                  onChange={(e) => setFormData({ ...formData, fullNameAr: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="instructor@academy.edu"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                      errors.email ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+966 50 123 4567"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic & Contractual Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Academic Specialization & Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Specialization
                </label>
                <select
                  value={formData.specialization || SPECIALIZATION_OPTIONS[0]}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SPECIALIZATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highest Qualification
                </label>
                <select
                  value={formData.qualification || QUALIFICATION_OPTIONS[0]}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {QUALIFICATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employee / Faculty ID</label>
                <input
                  type="text"
                  value={formData.employeeId || ''}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TeacherStatus })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active Faculty</option>
                  <option value="on_leave">On Sabbatical / Leave</option>
                  <option value="inactive">Inactive / Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Type</label>
                <select
                  value={formData.contractType || 'full_time'}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="full_time">Full-Time (Resident)</option>
                  <option value="part_time">Part-Time</option>
                  <option value="adjunct">Adjunct Lecturer</option>
                  <option value="contractor">External Examiner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hourly Teaching Rate</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={formData.hourlyRate ?? 150}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={formData.currency || 'SAR'}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Assigned Courses & Classes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Curriculum & Class Assignments
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assigned Teaching Courses
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {courses.length === 0 ? (
                  <p className="text-[11px] text-slate-400 p-2">No courses registered yet in this academy.</p>
                ) : (
                  courses.map((course) => {
                    const isChecked = formData.assignedCourseIds?.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCourse(course.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className="truncate">{course.title}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assigned Batches / Classes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {classes.length === 0 ? (
                  <p className="text-[11px] text-slate-400 p-2">No batch classes registered yet.</p>
                ) : (
                  classes.map((batch) => {
                    const isChecked = formData.assignedClassIds?.includes(batch.id);
                    return (
                      <label
                        key={batch.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleClass(batch.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <span className="truncate">
                          {batch.name} <span className="text-[10px] text-slate-400 font-normal">({batch.scheduleDay})</span>
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Bio & Internal Notes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Bio & Pedagogical Notes
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty Bio / Public Introduction
              </label>
              <textarea
                rows={2}
                placeholder="Brief pedagogical summary, teaching methodology, or international testing experience..."
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrative Notes (Tenant Private)
              </label>
              <textarea
                rows={2}
                placeholder="Internal HR notes, visa, contract renewal date, or supervision feedback..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Enroll Teacher'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
