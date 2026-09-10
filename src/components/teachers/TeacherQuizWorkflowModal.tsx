import React, { useState } from 'react';
import { Course } from '../../types';
import { X, Sparkles, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface QuizQuestionDraft {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface TeacherQuizWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSubmit: (payload: {
    courseId: string;
    courseTitle: string;
    title: string;
    type: 'quiz' | 'exam' | 'practice';
    durationMinutes: number;
    passingScore: number;
    questions: QuizQuestionDraft[];
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export const TeacherQuizWorkflowModal: React.FC<TeacherQuizWorkflowModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSubmit,
  isSubmitting = false,
}) => {
  const [courseId, setCourseId] = useState<string>(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'quiz' | 'exam' | 'practice'>('quiz');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [passingScore, setPassingScore] = useState<number>(75);

  const [questions, setQuestions] = useState<QuizQuestionDraft[]>([
    {
      question: 'Which sentence demonstrates correct usage of the present perfect continuous tense?',
      options: [
        'She has been working here since five years.',
        'She has been working here for five years.',
        'She had been work here for five years.',
        'She is working here since five years.',
      ],
      correctAnswer: 1,
      explanation: 'Use "for" with periods of duration (five years) and "since" with specific starting points.',
    },
    {
      question: 'Select the synonym that best fits an academic or formal register for "give up":',
      options: ['Abandon', 'Relinquish', 'Quit', 'Drop out'],
      correctAnswer: 1,
      explanation: '"Relinquish" is the formal register academic term commonly expected in CEFR C1/IELTS band 8+ contexts.',
    },
  ]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].question = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = val;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIdx: number, oIdx: number) => {
    const updated = [...questions];
    updated[qIdx].correctAnswer = oIdx;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId || questions.length === 0) return;

    const selectedCourse = courses.find((c) => c.id === courseId);
    await onSubmit({
      courseId,
      courseTitle: selectedCourse?.title || 'English Course',
      title,
      type,
      durationMinutes,
      passingScore,
      questions,
    });
  };

  return (
    <div
      id="teacher-quiz-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="teacher-quiz-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Academic Quiz / Examination</h2>
              <p className="text-xs text-slate-500">
                Design custom questions, configure timer, and define passing thresholds
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
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Metadata Section */}
          <div className="p-6 border-b border-slate-100 bg-white space-y-4 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
                >
                  <option value="quiz">Weekly Quiz / Checkpoint</option>
                  <option value="exam">Formal Examination (CEFR)</option>
                  <option value="practice">Self-Paced Practice Drill</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quiz / Examination Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Unit 4 Mastery Quiz: Conditional Structures & Inversions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Limit (Minutes)
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Question Builder List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Questions List ({questions.length})
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Question #{qIdx + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded transition"
                      aria-label="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  placeholder="Enter question prompt..."
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Options (Select the radio button for the correct answer):
                  </span>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_${qIdx}`}
                        checked={q.correctAnswer === oIdx}
                        onChange={() => handleCorrectChange(qIdx, oIdx)}
                        className="text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                        className={`flex-1 px-2.5 py-1 text-xs rounded-lg border ${
                          q.correctAnswer === oIdx
                            ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950 font-semibold'
                            : 'border-slate-200'
                        } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Deploy Quiz to Class'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
