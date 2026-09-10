import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { X, Award, CheckCircle, UserCheck } from 'lucide-react';

interface TeacherResultWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  onSubmit: (payload: {
    studentId: string;
    examTitle: string;
    examType: string;
    date: string;
    score: number;
    maxScore: number;
    bandScore: string;
    passed: boolean;
    skills: { listening: number; reading: number; writing: number; speaking: number };
    examinerFeedback: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export const TeacherResultWorkflowModal: React.FC<TeacherResultWorkflowModalProps> = ({
  isOpen,
  onClose,
  students,
  onSubmit,
  isSubmitting = false,
}) => {
  const [studentId, setStudentId] = useState<string>(students[0]?.id || '');
  const [examTitle, setExamTitle] = useState('CEFR Standardized Proficiency Evaluation');
  const [examType, setExamType] = useState('CEFR Assessment');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState<number>(88);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [bandScore, setBandScore] = useState('B2 Upper Intermediate');
  const [passed, setPassed] = useState(true);
  const [skills, setSkills] = useState({
    listening: 85,
    reading: 90,
    writing: 84,
    speaking: 88,
  });
  const [examinerFeedback, setExaminerFeedback] = useState(
    'Demonstrated robust fluency and natural intonation during the spoken task. Written structures showed clear organization with minor prepositional errors.'
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !examTitle.trim()) return;

    await onSubmit({
      studentId,
      examTitle,
      examType,
      date,
      score,
      maxScore,
      bandScore,
      passed,
      skills,
      examinerFeedback,
    });
  };

  return (
    <div
      id="teacher-result-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="teacher-result-modal"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Record Student Assessment Result</h2>
              <p className="text-xs text-slate-500">
                Log CEFR scores, skills breakdown, and academic evaluation feedback
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Student Candidate <span className="text-rose-500">*</span>
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentId}) — {st.englishLevel || 'General Student'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exam / Test Title</label>
              <input
                type="text"
                required
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="CEFR Assessment">CEFR Assessment</option>
                <option value="IELTS Mock Exam">IELTS Mock Exam</option>
                <option value="Mid-Term Exam">Mid-Term Exam</option>
                <option value="Final Comprehensive">Final Comprehensive</option>
                <option value="Oral Interview">Oral Interview Evaluation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Score</label>
              <input
                type="number"
                min="0"
                max={maxScore}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Band Score / Level</label>
              <input
                type="text"
                value={bandScore}
                onChange={(e) => setBandScore(e.target.value)}
                placeholder="e.g. B2 / Band 7.0"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
          </div>

          {/* 4 Core Skills Breakdown */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Core Skills Breakdown (0 - 100%)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Listening</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skills.listening}
                  onChange={(e) => setSkills({ ...skills, listening: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Reading</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skills.reading}
                  onChange={(e) => setSkills({ ...skills, reading: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Writing</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skills.writing}
                  onChange={(e) => setSkills({ ...skills, writing: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Speaking</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skills.speaking}
                  onChange={(e) => setSkills({ ...skills, speaking: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Examiner Pedagogical Feedback
            </label>
            <textarea
              rows={3}
              value={examinerFeedback}
              onChange={(e) => setExaminerFeedback(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
            />
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={passed}
              onChange={(e) => setPassed(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700">
              Candidate achieved required passing threshold
            </span>
          </label>

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
              disabled={isSubmitting || !studentId}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Record Assessment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
