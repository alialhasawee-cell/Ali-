import React, { useState, useEffect } from 'react';
import { CourseLesson } from '../../types';
import { X, BookOpen, Clock, Eye } from 'lucide-react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    titleAr?: string;
    description?: string;
    durationMinutes?: number;
    isFreePreview?: boolean;
    order?: number;
  }) => Promise<void>;
  initialLesson?: CourseLesson | null;
  defaultOrder?: number;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLesson,
  defaultOrder = 1,
}) => {
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [order, setOrder] = useState(defaultOrder);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialLesson) {
      setTitle(initialLesson.title || '');
      setTitleAr(initialLesson.titleAr || '');
      setDescription(initialLesson.description || '');
      setDurationMinutes(initialLesson.durationMinutes || 25);
      setIsFreePreview(!!initialLesson.isFreePreview);
      setOrder(initialLesson.order || defaultOrder);
    } else {
      setTitle('');
      setTitleAr('');
      setDescription('');
      setDurationMinutes(25);
      setIsFreePreview(false);
      setOrder(defaultOrder);
    }
  }, [initialLesson, isOpen, defaultOrder]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title,
        titleAr: titleAr.trim() || undefined,
        description: description.trim() || undefined,
        durationMinutes: Number(durationMinutes) || 25,
        isFreePreview,
        order: Number(order) || 1,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {initialLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lesson Title (English) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lesson 1.1: Diagnostic Speaking Simulation & Rubrics"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lesson Title (Arabic)
            </label>
            <input
              type="text"
              dir="rtl"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="الدرس الأول: محاكاة اختبار التحدث ومعايير التقييم"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Duration (Min)
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 25)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order within Module
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lesson Description / Objectives
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specific skills, vocabulary sets, listening tactics or exercises covered..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <input
              type="checkbox"
              id="isFreePreview"
              checked={isFreePreview}
              onChange={(e) => setIsFreePreview(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isFreePreview" className="text-xs text-slate-700 cursor-pointer flex-1">
              <span className="font-semibold block">Enable Free Preview for Prospects</span>
              <span className="text-[11px] text-slate-500">
                Allows prospective students to preview this lesson without full enrollment.
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : initialLesson ? 'Update Lesson' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
