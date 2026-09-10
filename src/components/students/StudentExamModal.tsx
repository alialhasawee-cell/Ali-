import React, { useState } from 'react';
import { StudentProfile, StudentExamResult } from '../../types';
import { Award, X, Check, AlertCircle } from 'lucide-react';

interface StudentExamModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  onClose: () => void;
  onAddExam: (studentId: string, exam: Partial<StudentExamResult>) => Promise<void>;
}

export const StudentExamModal: React.FC<StudentExamModalProps> = ({
  isOpen,
  student,
  onClose,
  onAddExam,
}) => {
  const [examTitle, setExamTitle] = useState('Progress Fluency Assessment');
  const [examType, setExamType] = useState('Progress Test');
  const [score, setScore] = useState<number>(85);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [bandScore, setBandScore] = useState('6.5');
  const [speakingScore, setSpeakingScore] = useState<number>(82);
  const [listeningScore, setListeningScore] = useState<number>(88);
  const [readingScore, setReadingScore] = useState<number>(84);
  const [writingScore, setWritingScore] = useState<number>(80);
  const [examinerFeedback, setExaminerFeedback] = useState(
    'Demonstrates consistent fluency with natural discourse markers. Recommend expanding lexical variety.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) {
      setError('Exam title is required');
      return;
    }
    if (score < 0 || maxScore <= 0 || score > maxScore) {
      setError('Score must be between 0 and the maximum score.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onAddExam(student.id, {
        examTitle,
        examType,
        score: Number(score),
        maxScore: Number(maxScore),
        bandScore: bandScore.trim() || undefined,
        passed: (score / maxScore) >= 0.6,
        date: new Date().toISOString().split('T')[0],
        skills: {
          speaking: speakingScore,
          listening: listeningScore,
          reading: readingScore,
          writing: writingScore,
        },
        examinerFeedback: examinerFeedback.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to log exam score');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="student-exam-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="student-exam-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Log Exam / Assessment Result</h3>
              <p className="text-xs text-slate-500">
                Record score for {student.fullName} ({student.studentAdmissionNumber})
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
              Assessment Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="exam-title-input"
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              placeholder="e.g. Midterm Oral Interview, IELTS Academic Mock #2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assessment Type
              </label>
              <select
                id="exam-type-select"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="Placement Test">Placement Test</option>
                <option value="Progress Test">Progress Test</option>
                <option value="Midterm Exam">Midterm Exam</option>
                <option value="Final Exam">Final Exam</option>
                <option value="IELTS Mock Exam">IELTS Mock Exam</option>
                <option value="TOEFL Mock Exam">TOEFL Mock Exam</option>
                <option value="Oral Fluency Assessment">Oral Fluency Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Band / Level Score
              </label>
              <input
                id="exam-band-input"
                type="text"
                value={bandScore}
                onChange={(e) => setBandScore(e.target.value)}
                placeholder="e.g. 7.0, B2+, High Merit"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Score Achieved <span className="text-rose-500">*</span>
              </label>
              <input
                id="exam-score-input"
                type="number"
                min="0"
                max={maxScore}
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Score <span className="text-rose-500">*</span>
              </label>
              <input
                id="exam-max-score-input"
                type="number"
                min="1"
                value={maxScore}
                onChange={(e) => setMaxScore(parseFloat(e.target.value) || 100)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* 4 Skills Breakdown */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Skills Competency Breakdown (%):
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Speaking</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={speakingScore}
                  onChange={(e) => setSpeakingScore(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-center text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Listening</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={listeningScore}
                  onChange={(e) => setListeningScore(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-center text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Reading</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={readingScore}
                  onChange={(e) => setReadingScore(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-center text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Writing</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={writingScore}
                  onChange={(e) => setWritingScore(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-center text-slate-800"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Examiner Academic Feedback
            </label>
            <textarea
              id="exam-feedback-input"
              rows={2}
              value={examinerFeedback}
              onChange={(e) => setExaminerFeedback(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
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
              id="submit-exam-btn"
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-sm transition flex items-center gap-2"
            >
              {submitting ? (
                <>Logging Score...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Assessment Score
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
