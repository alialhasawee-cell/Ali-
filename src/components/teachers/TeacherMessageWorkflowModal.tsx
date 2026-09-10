import React, { useState } from 'react';
import { StudentProfile, BatchClass } from '../../types';
import { X, Send, Users, User, AlertTriangle } from 'lucide-react';

interface TeacherMessageWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  classes: BatchClass[];
  onSubmit: (payload: {
    recipientType: 'class' | 'student' | 'all_students';
    recipientId?: string;
    recipientName: string;
    subject: string;
    content: string;
    priority: 'normal' | 'high' | 'urgent';
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export const TeacherMessageWorkflowModal: React.FC<TeacherMessageWorkflowModalProps> = ({
  isOpen,
  onClose,
  students,
  classes,
  onSubmit,
  isSubmitting = false,
}) => {
  const [recipientType, setRecipientType] = useState<'class' | 'student' | 'all_students'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    let recipientId: string | undefined = undefined;
    let recipientName = 'All Assigned Students';

    if (recipientType === 'class') {
      const cls = classes.find((c) => c.id === selectedClassId);
      recipientId = selectedClassId;
      recipientName = cls ? `Class: ${cls.name}` : 'Selected Class';
    } else if (recipientType === 'student') {
      const st = students.find((s) => s.id === selectedStudentId);
      recipientId = selectedStudentId;
      recipientName = st ? st.fullName : 'Selected Student';
    }

    await onSubmit({
      recipientType,
      recipientId,
      recipientName,
      subject,
      content,
      priority,
    });
  };

  return (
    <div
      id="teacher-message-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="teacher-message-modal"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Student & Class Communication</h2>
              <p className="text-xs text-slate-500">
                Dispatch announcements, assignment reminders, or individual feedback
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Recipient Target</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRecipientType('class')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  recipientType === 'class'
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Entire Class</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipientType('student')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  recipientType === 'student'
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Direct Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipientType('all_students')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  recipientType === 'all_students'
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>All Cohorts</span>
              </button>
            </div>
          </div>

          {recipientType === 'class' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Teaching Batch
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.courseTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {recipientType === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Individual Learner
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Line <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Preparation for Mock Oral Examination"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
              >
                <option value="normal">Normal Priority</option>
                <option value="high">High Importance</option>
                <option value="urgent">Urgent Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Type your message, instructions, or meeting links..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !content.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send Communication'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
