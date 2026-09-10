import React, { useState, useEffect } from 'react';
import { Course, CourseStatus, EnrollmentRuleType } from '../../types';
import { X, BookOpen, DollarSign, Users, Sparkles, Image, ShieldAlert } from 'lucide-react';

interface CourseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Course>) => Promise<void>;
  initialCourse?: Course | null;
  teachers?: { id: string; fullName: string; avatarUrl?: string }[];
}

export const CourseSettingsModal: React.FC<CourseSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCourse,
  teachers = [],
}) => {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    code: '',
    description: '',
    level: 'B1' as Course['level'],
    category: 'General English',
    durationWeeks: 8,
    totalHours: 32,
    duration: '8 Weeks (32 Hours)',
    teacherId: '',
    teacherName: '',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    status: 'draft' as CourseStatus,
    pricingType: 'paid' as 'free' | 'paid',
    price: 1200,
    currency: 'SAR',
    enrollmentType: 'open' as EnrollmentRuleType,
    maxStudents: 50,
    requiresPlacementTest: false,
    minimumPlacementLevel: 'B1',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialCourse) {
      setFormData({
        title: initialCourse.title || '',
        titleAr: initialCourse.titleAr || '',
        code: initialCourse.code || '',
        description: initialCourse.description || '',
        level: initialCourse.level || 'B1',
        category: initialCourse.category || 'General English',
        durationWeeks: initialCourse.durationWeeks || 8,
        totalHours: initialCourse.totalHours || 32,
        duration: initialCourse.duration || `${initialCourse.durationWeeks || 8} Weeks`,
        teacherId: initialCourse.teacherId || '',
        teacherName: initialCourse.teacherName || '',
        thumbnail:
          initialCourse.thumbnail ||
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
        status: initialCourse.status || 'draft',
        pricingType: initialCourse.pricing?.type || (initialCourse.price > 0 ? 'paid' : 'free'),
        price: initialCourse.pricing?.amount ?? initialCourse.price ?? 1200,
        currency: initialCourse.pricing?.currency || 'SAR',
        enrollmentType: initialCourse.enrollmentRules?.type || 'open',
        maxStudents: initialCourse.enrollmentRules?.maxStudents || 50,
        requiresPlacementTest: !!initialCourse.enrollmentRules?.requiresPlacementTest,
        minimumPlacementLevel: initialCourse.enrollmentRules?.minimumPlacementLevel || 'B1',
      });
    } else {
      setFormData({
        title: '',
        titleAr: '',
        code: `ENG-${Math.floor(100 + Math.random() * 900)}`,
        description: '',
        level: 'B1',
        category: 'General English',
        durationWeeks: 8,
        totalHours: 32,
        duration: '8 Weeks (32 Hours)',
        teacherId: teachers[0]?.id || '',
        teacherName: teachers[0]?.fullName || '',
        thumbnail:
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
        status: 'draft',
        pricingType: 'paid',
        price: 1200,
        currency: 'SAR',
        enrollmentType: 'open',
        maxStudents: 50,
        requiresPlacementTest: false,
        minimumPlacementLevel: 'B1',
      });
    }
  }, [initialCourse, isOpen, teachers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      const selectedTeacher = teachers.find((t) => t.id === formData.teacherId);

      await onSave({
        title: formData.title,
        titleAr: formData.titleAr,
        code: formData.code,
        description: formData.description,
        level: formData.level,
        category: formData.category,
        durationWeeks: Number(formData.durationWeeks) || 8,
        totalHours: Number(formData.totalHours) || 32,
        duration: `${formData.durationWeeks} Weeks (${formData.totalHours} Hours)`,
        teacherId: formData.teacherId,
        teacherName: selectedTeacher ? selectedTeacher.fullName : formData.teacherName,
        teacherAvatar: selectedTeacher?.avatarUrl,
        thumbnail: formData.thumbnail,
        status: formData.status,
        pricing: {
          type: formData.pricingType,
          amount: formData.pricingType === 'free' ? 0 : Number(formData.price) || 0,
          currency: formData.currency,
        },
        price: formData.pricingType === 'free' ? 0 : Number(formData.price) || 0,
        enrollmentRules: {
          type: formData.enrollmentType,
          maxStudents: Number(formData.maxStudents) || 50,
          requiresPlacementTest: formData.requiresPlacementTest,
          minimumPlacementLevel: formData.minimumPlacementLevel,
        },
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const sampleThumbnails = [
    {
      label: 'Classroom Collaboration',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Lecture & Seminar',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Library & Study',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Business English Meeting',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Digital Learning Lab',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialCourse ? 'Edit Course Specifications' : 'Create New LMS Course'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure curriculum properties, CEFR level, pricing, and enrollment rules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Course Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., IELTS Academic Masterclass 7.5+"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title (Arabic)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="دورة الآيلتس الأكاديمي المكثفة"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="ENG-IELTS-701"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CEFR Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="A1">A1 - Beginner / Breakthrough</option>
                  <option value="A2">A2 - Elementary / Waystage</option>
                  <option value="B1">B1 - Intermediate / Threshold</option>
                  <option value="B2">B2 - Upper Intermediate / Vantage</option>
                  <option value="C1">C1 - Advanced / Effective Operational</option>
                  <option value="C2">C2 - Mastery / Proficiency</option>
                  <option value="All Levels">All Levels (Open Workshop)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="General English">General English</option>
                  <option value="IELTS Prep">IELTS Prep</option>
                  <option value="TOEFL Prep">TOEFL Prep</option>
                  <option value="Business English">Business English</option>
                  <option value="Kids & Teens">Kids & Teens</option>
                  <option value="Grammar & Writing">Grammar & Writing</option>
                  <option value="Speaking & Pronunciation">Speaking & Pronunciation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive syllabus overview, pedagogical outcomes, target exam benchmarks..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Instructor & Duration */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Instructor & Duration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Teacher
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => {
                    const tId = e.target.value;
                    const teacher = teachers.find((t) => t.id === tId);
                    setFormData({
                      ...formData,
                      teacherId: tId,
                      teacherName: teacher ? teacher.fullName : '',
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration (Weeks)
                </label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={formData.durationWeeks}
                  onChange={(e) =>
                    setFormData({ ...formData, durationWeeks: parseInt(e.target.value, 10) || 8 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Academic Hours
                </label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={formData.totalHours}
                  onChange={(e) =>
                    setFormData({ ...formData, totalHours: parseInt(e.target.value, 10) || 32 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Enrollment Rules */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pricing & Enrollment Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pricing Model
                </label>
                <select
                  value={formData.pricingType}
                  onChange={(e) =>
                    setFormData({ ...formData, pricingType: e.target.value as 'free' | 'paid' })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="paid">Paid Enrollment</option>
                  <option value="free">Free / Open Access</option>
                </select>
              </div>

              {formData.pricingType === 'paid' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price Amount (SAR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enrollment Access Rule
                </label>
                <select
                  value={formData.enrollmentType}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollmentType: e.target.value as EnrollmentRuleType })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="open">Open Registration</option>
                  <option value="by_application">By Application & Review</option>
                  <option value="invitation_only">Invitation / Admin Enrolled Only</option>
                  <option value="prerequisite">Requires Prerequisite Level</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Student Seat Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({ ...formData, maxStudents: parseInt(e.target.value, 10) || 50 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Publication Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as CourseStatus })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="draft">Draft (Private to Curriculum Team)</option>
                  <option value="published">Published (Live in Student LMS)</option>
                  <option value="archived">Archived (Read Only)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thumbnail Image */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Course Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-500 self-center">Presets:</span>
              {sampleThumbnails.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, thumbnail: preset.url })}
                  className="text-[10px] px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : initialCourse ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
