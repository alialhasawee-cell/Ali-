import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Course, Assignment, QuizExam, Certificate, ActiveTab } from '../types';
import { StudentLmsPlayer } from '../components/lms/StudentLmsPlayer';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Award,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  PlayCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface StudentPortalViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({ setActiveTab }) => {
  const { currentUser, currentTenant, showToast } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<QuizExam[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Active LMS course player
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);

  // Homework submission draft
  const [submissionText, setSubmissionText] = useState('');
  const [submittingAsgId, setSubmittingAsgId] = useState<string | null>(null);

  // Interactive Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizExam | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const [cList, aList, qList, certList] = await Promise.all([
        api.getCourses(),
        api.getAssignments(),
        api.getQuizzes(),
        api.getCertificates(),
      ]);

      setCourses(cList);
      setAssignments(aList);
      setQuizzes(qList);
      const studentCerts = certList.filter((c) => c.studentId === currentUser?.id);
      setCertificates(studentCerts.length > 0 ? studentCerts : certList.slice(0, 1));

      if (qList.length > 0) {
        setActiveQuiz(qList[0]);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load student data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [currentUser?.id, currentTenant?.id]);

  const handleSubmitHomework = (asgId: string) => {
    if (!submissionText.trim()) {
      showToast('Please type your essay response before submitting', 'error');
      return;
    }

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === asgId) {
          const updatedSubs = [
            ...(a.submissions || []).filter((s) => s.studentId !== currentUser?.id),
            {
              studentId: currentUser?.id || 'usr_omar',
              studentName: currentUser?.fullName || 'Student',
              submittedAt: new Date().toISOString().split('T')[0],
              textSubmission: submissionText,
              status: 'submitted' as const,
            },
          ];
          return { ...a, submissions: updatedSubs };
        }
        return a;
      })
    );

    showToast('Homework response submitted to instructor for review!', 'success');
    setSubmissionText('');
    setSubmittingAsgId(null);
  };

  const handleQuizOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });
    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);
    showToast(`Quiz completed: ${percentage}% score achieved!`, 'success');
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // If student is learning inside a course
  if (playingCourse) {
    return (
      <StudentLmsPlayer
        course={playingCourse}
        onBack={() => {
          setPlayingCourse(null);
          loadStudentData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Welcome back, {currentUser?.fullName}!
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Target: <strong className="text-indigo-600">{currentUser?.studentDetails?.targetExam || 'IELTS 7.5+'}</strong> &bull; CEFR Level:{' '}
            <span className="font-bold text-slate-700">{currentUser?.studentDetails?.level || 'B2'}</span> &bull; {currentTenant?.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses-lms')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Course Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-tools')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Practice Speaking with AI</span>
          </button>
        </div>
      </div>

      {/* Grid: Courses & Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enrolled LMS Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrolled Courses */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">My Enrolled LMS Courses</h3>
                <p className="text-xs text-slate-500">
                  Access lectures, video materials, reading handouts, and graded quizzes.
                </p>
              </div>
              <span className="text-xs text-indigo-600 font-semibold">{courses.length} Active Courses</span>
            </div>

            <div className="space-y-4">
              {courses.map((course) => {
                const totalLessons = (course.modules || []).reduce(
                  (acc, m) => acc + (m.lessons?.length || 0),
                  0
                );

                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                            CEFR {course.level}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {course.title}
                          </span>
                        </div>
                        {course.titleAr && (
                          <p className="text-xs text-slate-500 font-serif" dir="rtl">
                            {course.titleAr}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-indigo-500" />
                            {course.modules?.length || 0} Modules
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-cyan-500" />
                            {totalLessons} Lessons
                          </span>
                          {course.teacherName && (
                            <>
                              <span>&bull;</span>
                              <span>{course.teacherName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setPlayingCourse(course)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition whitespace-nowrap self-stretch sm:self-center justify-center"
                    >
                      <PlayCircle className="w-4 h-4 text-emerald-300" />
                      <span>Enter Classroom</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Homework & Essay Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Homework & Written Tasks</h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit assignments to receive certified instructor scoring and AI grammar analysis.
            </p>

            <div className="space-y-4">
              {assignments.map((asg) => {
                const mySub = asg.submissions?.find((s) => s.studentId === currentUser?.id);
                const isWriting = submittingAsgId === asg.id;

                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="font-bold text-slate-800">{asg.title}</h4>
                        <span className="text-[11px] text-indigo-600 font-medium">{asg.courseTitle}</span>
                      </div>
                      <span className="text-slate-400 font-mono">Due: {asg.dueDate}</span>
                    </div>

                    <p className="text-slate-600">{asg.description}</p>

                    {/* Status & Feedback */}
                    {mySub ? (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">
                            Submitted on {mySub.submittedAt}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mySub.status === 'graded'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {mySub.status === 'graded'
                              ? `Score: ${mySub.score} / ${asg.maxScore}`
                              : 'Under Review by Teacher'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 italic">
                          "{mySub.textSubmission}"
                        </div>

                        {mySub.teacherFeedback && (
                          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                            <strong className="block text-[10px] uppercase font-bold text-emerald-700 mb-0.5">
                              Teacher Feedback:
                            </strong>
                            {mySub.teacherFeedback}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {!isWriting ? (
                          <button
                            onClick={() => setSubmittingAsgId(asg.id)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Response</span>
                          </button>
                        ) : (
                          <div className="space-y-3 pt-2">
                            <textarea
                              rows={4}
                              value={submissionText}
                              onChange={(e) => setSubmissionText(e.target.value)}
                              placeholder="Write your answer, essay paragraph, or vocabulary response here..."
                              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSubmittingAsgId(null)}
                                className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSubmitHomework(asg.id)}
                                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
                              >
                                Submit to Instructor
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Interactive Practice Test & Verified Credentials */}
        <div className="space-y-6">
          {/* Interactive Diagnostic Quiz Card */}
          {activeQuiz && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                    Interactive Practice Test
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeQuiz.title}</h4>
                </div>
                <span className="text-xs bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
                  {activeQuiz.durationMinutes} Mins
                </span>
              </div>

              {/* Questions */}
              <div className="space-y-4 text-xs">
                {activeQuiz.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-2">
                    <p className="font-semibold text-slate-800">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = q.correctOptionIndex === optIdx;

                        let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'border-rose-500 bg-rose-50 text-rose-800 font-semibold';
                          }
                        } else if (isSelected) {
                          btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                        <strong>Pedagogical Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quiz Submit / Reset Buttons */}
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  Grade Quiz Answers
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
                    <span className="text-xs font-semibold text-indigo-700 block">
                      Score: {quizScore}%
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {quizScore >= activeQuiz.passingScore
                        ? 'Passed! Excellent command of target structures.'
                        : 'Review explanations and retry for mastery.'}
                    </span>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="w-full py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* My Verified Digital Certificates */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              <h4 className="font-bold text-sm text-white">My Digital Credentials</h4>
            </div>

            {certificates.length > 0 ? (
              certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs space-y-1.5"
                >
                  <span className="text-[10px] text-amber-300 font-bold uppercase block">
                    {cert.grade} &bull; {cert.issueDate}
                  </span>
                  <p className="font-bold text-white text-xs">{cert.courseTitle}</p>
                  <p className="text-[10px] text-slate-300 font-mono">
                    ID: {cert.verificationCode}
                  </p>
                  <button
                    onClick={() => setActiveTab('certificates')}
                    className="text-[11px] text-blue-300 hover:underline flex items-center gap-1 pt-1"
                  >
                    <span>View Public Seal & QR</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">
                Complete all course modules and achieve passing grades to earn verifiable certificates.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
