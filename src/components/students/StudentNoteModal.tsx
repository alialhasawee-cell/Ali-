import React, { useState } from 'react';
import { StudentProfile, StudentNote } from '../../types';
import { MessageSquare, X, Check, AlertCircle } from 'lucide-react';

interface StudentNoteModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  onClose: () => void;
  onAddNote: (studentId: string, note: { content: string; category?: StudentNote['category'] }) => Promise<void>;
}

export const StudentNoteModal: React.FC<StudentNoteModalProps> = ({
  isOpen,
  student,
  onClose,
  onAddNote,
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<StudentNote['category']>('academic');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Note content cannot be blank');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onAddNote(student.id, {
        content: content.trim(),
        category,
      });
      setContent('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="student-note-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="student-note-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Staff / Teacher Note</h3>
              <p className="text-xs text-slate-500">
                Log entry for {student.fullName} ({student.studentAdmissionNumber})
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Note Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['academic', 'behavioral', 'administrative', 'medical', 'financial'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl border text-center transition capitalize ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Note Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="note-content-input"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="e.g. Student requested additional speaking mock tests before IELTS exam next month. Counselor advised weekly one-on-one sessions."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
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
              id="submit-note-btn"
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm transition flex items-center gap-2"
            >
              {submitting ? (
                <>Saving Note...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Note Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
