import React, { useState, useEffect, useRef } from 'react';
import {
  Course,
  CourseLesson,
  CourseModule,
  LessonMaterial,
  StudentCourseProgress,
  LessonProgress,
  MaterialType,
} from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  Clock,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  FileDown,
  Volume2,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
  FileCheck2,
  Sparkles,
  RotateCcw,
  Download,
  ZoomIn,
  ZoomOut,
  Send,
  Check,
  AlertCircle,
  BarChart3,
  Layers,
} from 'lucide-react';

interface StudentLmsPlayerProps {
  course: Course;
  onBack: () => void;
}

export const StudentLmsPlayer: React.FC<StudentLmsPlayerProps> = ({ course, onBack }) => {
  const { currentUser, showToast } = useAuth();

  // Progress state from server
  const [progress, setProgress] = useState<StudentCourseProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Active navigation
  const [activeModuleId, setActiveModuleId] = useState<string>('');
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [activeMaterialId, setActiveMaterialId] = useState<string>('');

  // Sidebar collapse & module accordion
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Active time tracking in seconds
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Audio / Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Assignment state
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentFileName, setAssignmentFileName] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  // Fetch progress on load
  const loadProgress = async () => {
    try {
      const data = await api.getCourseProgress(course.id, currentUser?.id);
      setProgress(data);

      // Set initial lesson
      if (!activeLessonId) {
        if (data?.lastAccessedLessonId) {
          // Find module containing this lesson
          for (const m of course.modules || []) {
            const found = m.lessons?.some((l) => l.id === data.lastAccessedLessonId);
            if (found) {
              setActiveModuleId(m.id);
              setActiveLessonId(data.lastAccessedLessonId);
              setExpandedModules((prev) => ({ ...prev, [m.id]: true }));
              break;
            }
          }
        } else if (course.modules?.[0]?.lessons?.[0]) {
          const firstMod = course.modules[0];
          const firstLes = firstMod.lessons[0];
          setActiveModuleId(firstMod.id);
          setActiveLessonId(firstLes.id);
          setExpandedModules((prev) => ({ ...prev, [firstMod.id]: true }));
        }
      }
    } catch (err: any) {
      console.error('Failed to load course progress:', err);
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [course.id]);

  // Current module and lesson objects
  const activeModule = (course.modules || []).find((m) => m.id === activeModuleId);
  const activeLesson = (activeModule?.lessons || []).find((l) => l.id === activeLessonId);

  // Set default active material when lesson changes
  useEffect(() => {
    if (activeLesson && activeLesson.materials && activeLesson.materials.length > 0) {
      setActiveMaterialId(activeLesson.materials[0].id);
      // Reset video/audio state
      setIsPlaying(false);
      setMediaProgress(0);
      setShowTranscript(false);

      // Check if this lesson has existing quiz or assignment submissions
      const firstMat = activeLesson.materials[0];
      const qProgress = firstMat ? progress?.quizProgress?.[firstMat.id] : undefined;
      if (qProgress !== undefined) {
        setQuizScore(qProgress.score);
        setQuizPassed(qProgress.passed);
        setQuizSubmitted(true);
      } else {
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(null);
      }

      const existingAssignment = firstMat ? progress?.assignmentProgress?.[firstMat.id] : undefined;
      if (existingAssignment) {
        setAssignmentSubmitted(true);
        setAssignmentText(existingAssignment.textSubmission || '');
      } else {
        setAssignmentSubmitted(false);
        setAssignmentText('');
        setAssignmentFileName('');
      }
    } else {
      setActiveMaterialId('');
    }
  }, [activeLessonId, progress]);

  // Session time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if current lesson is completed
  const isLessonCompleted = !!(activeLessonId && progress?.lessonProgress?.[activeLessonId]?.completed);

  // Toggle lesson completion
  const handleToggleComplete = async () => {
    if (!activeLessonId) return;
    const nextCompleted = !isLessonCompleted;

    try {
      const updated = await api.updateLessonProgress(
        course.id,
        activeLessonId,
        nextCompleted,
        sessionSeconds,
        currentUser?.id
      );
      setProgress(updated);
      showToast(
        nextCompleted
          ? 'Lesson marked as completed!'
          : 'Lesson marked as uncompleted',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update progress', 'error');
    }
  };

  // Navigate to Next or Previous lesson
  const allLessons: { moduleId: string; lesson: CourseLesson }[] = [];
  (course.modules || []).forEach((mod) => {
    (mod.lessons || []).forEach((les) => {
      allLessons.push({ moduleId: mod.id, lesson: les });
    });
  });

  const currentLessonIndex = allLessons.findIndex((item) => item.lesson.id === activeLessonId);

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const next = allLessons[currentLessonIndex + 1];
      setActiveModuleId(next.moduleId);
      setActiveLessonId(next.lesson.id);
      setExpandedModules((prev) => ({ ...prev, [next.moduleId]: true }));
      // Automatically save time spent for previous lesson
      api.updateLessonProgress(
        course.id,
        activeLessonId,
        true,
        sessionSeconds,
        currentUser?.id
      ).then(setProgress).catch(() => {});
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prev = allLessons[currentLessonIndex - 1];
      setActiveModuleId(prev.moduleId);
      setActiveLessonId(prev.lesson.id);
      setExpandedModules((prev) => ({ ...prev, [prev.moduleId]: true }));
    }
  };

  // Submit Interactive Quiz
  const handleSubmitQuiz = async (material: LessonMaterial) => {
    if (!material.quizContent) return;
    const questions = material.quizContent.questions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q, idx) => {
      const selected = quizAnswers[q.id || `q_${idx}`];
      if (selected === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= (material.quizContent.passingScore || 70);

    setSubmittingQuiz(true);
    try {
      const updated = await api.submitQuizProgress(
        course.id,
        activeLessonId,
        material.id,
        quizAnswers,
        scorePct,
        passed,
        currentUser?.id
      );
      setProgress(updated);
      setQuizScore(scorePct);
      setQuizPassed(passed);
      setQuizSubmitted(true);
      showToast(
        passed
          ? `Quiz Passed! Score: ${scorePct}%`
          : `Quiz Score: ${scorePct}%. Passing grade is ${material.quizContent.passingScore}%. Try again!`,
        passed ? 'success' : 'info'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to submit quiz', 'error');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Submit Assignment
  const handleSubmitAssignment = async (material: LessonMaterial) => {
    if (!assignmentText.trim()) {
      showToast('Please type your essay or response before submitting.', 'error');
      return;
    }

    setSubmittingAssignment(true);
    try {
      const updated = await api.submitAssignment(
        course.id,
        activeLessonId,
        material.id,
        assignmentText,
        assignmentFileName ? `https://storage.mrfluency.academy/assignments/${assignmentFileName}` : undefined,
        currentUser?.id
      );
      setProgress(updated);
      setAssignmentSubmitted(true);
      showToast('Assignment submitted successfully to academic evaluator!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit assignment', 'error');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const activeMaterial = (activeLesson?.materials || []).find((m) => m.id === activeMaterialId);

  const materialTypeIcons: Record<MaterialType, { icon: any; color: string; label: string }> = {
    text: { icon: FileText, color: 'text-sky-600', label: 'Reading & Lexicon' },
    video: { icon: Video, color: 'text-red-600', label: 'Video Lecture' },
    pdf: { icon: FileDown, color: 'text-amber-600', label: 'PDF Handout' },
    audio: { icon: Volume2, color: 'text-purple-600', label: 'Audio Lab' },
    image: { icon: ImageIcon, color: 'text-emerald-600', label: 'Linguistic Infographic' },
    external_resource: { icon: ExternalLink, color: 'text-blue-600', label: 'External Resource' },
    quiz: { icon: HelpCircle, color: 'text-indigo-600', label: 'Knowledge Check' },
    assignment: { icon: FileCheck2, color: 'text-rose-600', label: 'Writing Assignment' },
  };

  const totalCourseLessons = allLessons.length;
  const completedCount =
    progress?.completedLessonsCount ??
    Object.values(progress?.lessonProgress || {}).filter((lp) => (lp as LessonProgress)?.completed).length;
  const overallPercentage =
    progress?.progressPercentage ??
    (totalCourseLessons > 0 ? Math.round((completedCount / totalCourseLessons) * 100) : 0);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Navbar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Course</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                {course.title}
              </h1>
              <span className="hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CEFR {course.level}
              </span>
            </div>
            {course.teacherName && (
              <p className="text-[11px] text-slate-400 truncate">
                Instructor: {course.teacherName}
              </p>
            )}
          </div>
        </div>

        {/* Progress Metric & Next Button */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Progress Bar */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400 min-w-[3rem]">
              {overallPercentage}%
            </span>
          </div>

          {/* Time spent */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition text-xs font-semibold flex items-center gap-1"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Syllabus</span>
          </button>
        </div>
      </header>

      {/* Main Dual Pane Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Syllabus Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 ease-in-out bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden z-10`}
        >
          {/* Syllabus Header */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Syllabus
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {completedCount} of {totalCourseLessons} lessons completed
              </p>
            </div>
            {overallPercentage === 100 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Certified</span>
              </span>
            )}
          </div>

          {/* Modules Accordion */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {(course.modules || []).map((mod, modIdx) => {
              const isExp = expandedModules[mod.id] ?? (modIdx === 0);
              return (
                <div
                  key={mod.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedModules((prev) => ({
                        ...prev,
                        [mod.id]: !isExp,
                      }))
                    }
                    className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0">
                        {mod.order || modIdx + 1}
                      </span>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {mod.title}
                        </span>
                        {mod.titleAr && (
                          <span className="text-[10px] text-slate-500 font-serif block truncate" dir="rtl">
                            {mod.titleAr}
                          </span>
                        )}
                      </div>
                    </div>
                    {isExp ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {/* Lessons list inside module */}
                  {isExp && (
                    <div className="p-1 space-y-1 bg-slate-950/60 border-t border-slate-800/60">
                      {(mod.lessons || []).map((les, lesIdx) => {
                        const isActive = les.id === activeLessonId;
                        const isDone = !!progress?.lessonProgress?.[les.id]?.completed;

                        return (
                          <button
                            key={les.id}
                            onClick={() => {
                              setActiveModuleId(mod.id);
                              setActiveLessonId(les.id);
                            }}
                            className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between gap-2 text-xs transition ${
                              isActive
                                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                              )}
                              <div className="truncate">
                                <span className={`block truncate ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                                  {les.order || lesIdx + 1}. {les.title}
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{les.durationMinutes || 25}m</span>
                                  <span>&bull;</span>
                                  <span>{les.materials?.length || 0} items</span>
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Central Lesson Workspace Player */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
          {!activeLesson ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <BookOpen className="w-12 h-12 text-slate-700 mb-3" />
              <h2 className="text-base font-bold text-slate-300">Select a lesson to begin</h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Choose a lesson from the syllabus sidebar to access video lectures, interactive quizzes, reading handouts, and assignments.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Lesson Hero Header */}
              <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                    <span>{activeModule?.title}</span>
                    <span>&rsaquo;</span>
                    <span className="text-slate-400">Lesson {activeLesson.order || 1}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{activeLesson.title}</h2>
                  {activeLesson.titleAr && (
                    <p className="text-xs text-slate-400 font-serif mt-0.5" dir="rtl">
                      {activeLesson.titleAr}
                    </p>
                  )}
                  {activeLesson.description && (
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {activeLesson.description}
                    </p>
                  )}
                </div>

                {/* Mark as completed toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleToggleComplete}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm ${
                      isLessonCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isLessonCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark as Complete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Material Modality Tabs (if multiple materials) */}
              {activeLesson.materials && activeLesson.materials.length > 0 && (
                <div className="px-6 pt-3 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2 overflow-x-auto">
                  {activeLesson.materials.map((mat) => {
                    const isTabActive = mat.id === activeMaterialId;
                    const meta = materialTypeIcons[mat.type] || {
                      icon: FileText,
                      color: 'text-slate-400',
                      label: mat.type,
                    };
                    const Icon = meta.icon;

                    return (
                      <button
                        key={mat.id}
                        onClick={() => setActiveMaterialId(mat.id)}
                        className={`px-3.5 py-2.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition ${
                          isTabActive
                            ? 'border-indigo-500 text-white bg-slate-800/40 rounded-t-lg'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                        <span>{mat.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active Material Dynamic Player */}
              <div className="p-6 flex-1 overflow-y-auto">
                {!activeMaterial ? (
                  <div className="p-12 text-center text-slate-500">
                    <p className="text-xs">No materials uploaded for this lesson yet.</p>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Material Title Banner */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                          {materialTypeIcons[activeMaterial.type]?.label || activeMaterial.type}
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {activeMaterial.title}
                        </h3>
                        {activeMaterial.titleAr && (
                          <p className="text-xs text-slate-400 font-serif" dir="rtl">
                            {activeMaterial.titleAr}
                          </p>
                        )}
                      </div>
                      {activeMaterial.description && (
                        <p className="text-xs text-slate-400 max-w-md text-right hidden sm:block">
                          {activeMaterial.description}
                        </p>
                      )}
                    </div>

                    {/* 1. TEXT MATERIAL */}
                    {activeMaterial.type === 'text' && (
                      <div className="space-y-6">
                        {/* Text Body */}
                        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                          <p className="whitespace-pre-line">
                            {activeMaterial.textContent?.body ||
                              'No text body content available for this lesson.'}
                          </p>
                        </div>

                        {/* Vocabulary Cards */}
                        {activeMaterial.textContent?.keyVocabulary &&
                          activeMaterial.textContent.keyVocabulary.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Key CEFR Academic Lexicon</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {activeMaterial.textContent.keyVocabulary.map((v, vIdx) => (
                                  <div
                                    key={vIdx}
                                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 hover:border-slate-700 transition"
                                  >
                                    <span className="font-bold text-white text-xs block">
                                      {v.term}
                                    </span>
                                    <p className="text-xs text-slate-300">{v.definition}</p>
                                    {v.example && (
                                      <p className="text-[11px] text-slate-500 italic mt-1">
                                        &ldquo;{v.example}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {/* 2. VIDEO MATERIAL */}
                    {activeMaterial.type === 'video' && (
                      <div className="space-y-4">
                        {/* Video Player Container */}
                        <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl aspect-video flex flex-col items-center justify-center group">
                          <video
                            src={activeMaterial.videoContent?.videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            poster="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80"
                          />
                        </div>

                        {/* Video Controls Bar & Transcript */}
                        <div className="flex items-center justify-between gap-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Speed:</span>
                            {[1, 1.25, 1.5, 2].map((spd) => (
                              <button
                                key={spd}
                                onClick={() => setPlaybackSpeed(spd)}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  playbackSpeed === spd
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>

                          {activeMaterial.videoContent?.transcript && (
                            <button
                              onClick={() => setShowTranscript(!showTranscript)}
                              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{showTranscript ? 'Hide' : 'Show'} Transcript</span>
                            </button>
                          )}
                        </div>

                        {showTranscript && activeMaterial.videoContent?.transcript && (
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto">
                            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">
                              Video Transcript & Notes
                            </h4>
                            <p className="whitespace-pre-line leading-relaxed">
                              {activeMaterial.videoContent.transcript}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. PDF MATERIAL */}
                    {activeMaterial.type === 'pdf' && (
                      <div className="space-y-4">
                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileDown className="w-5 h-5 text-amber-400" />
                              <div>
                                <h4 className="text-sm font-bold text-white">
                                  {activeMaterial.pdfContent?.fileName || 'Curriculum_Material.pdf'}
                                </h4>
                                <span className="text-[11px] text-slate-500">
                                  {activeMaterial.pdfContent?.totalPages || 12} Pages &bull; Academic Syllabus Pack
                                </span>
                              </div>
                            </div>
                            <a
                              href={activeMaterial.pdfContent?.fileUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </a>
                          </div>

                          {/* Rendered Mock PDF Sheet */}
                          <div className="bg-white text-slate-800 p-8 rounded-xl shadow-md min-h-[300px] flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between border-b pb-3 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span>MR. FLUENCY ACADEMY</span>
                                <span>CEFR {course.level} REFERENCE MANUAL</span>
                              </div>
                              <h2 className="text-lg font-bold text-slate-900 mb-2">
                                {activeMaterial.title}
                              </h2>
                              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                This standardized pedagogical document outlines diagnostic parameters, rubric scoring thresholds, and targeted academic tasks designed specifically for the {course.category} module.
                              </p>
                              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-900 text-xs mb-3">
                                <strong>Instructor Notice:</strong> Review pages 1 through {activeMaterial.pdfContent?.totalPages || 12} thoroughly before attempting the module assignment.
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t pt-2">
                              <span>Document ID: PDF-{activeMaterial.id.substring(0, 8)}</span>
                              <span>Page 1 of {activeMaterial.pdfContent?.totalPages || 12}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. AUDIO MATERIAL */}
                    {activeMaterial.type === 'audio' && (
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                              <Volume2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{activeMaterial.title}</h4>
                              <p className="text-xs text-slate-400">
                                Accent: {activeMaterial.audioContent?.accent || 'British RP'} &bull; Speaker: {activeMaterial.audioContent?.speakerName || 'Instructor'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Audio Player Bar */}
                        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                          <audio
                            src={activeMaterial.audioContent?.audioUrl}
                            controls
                            className="w-full"
                          />
                        </div>

                        {activeMaterial.audioContent?.transcript && (
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">
                              Listening Passage Script:
                            </span>
                            <p className="whitespace-pre-line leading-relaxed">
                              {activeMaterial.audioContent.transcript}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 5. IMAGE MATERIAL */}
                    {activeMaterial.type === 'image' && (
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                        <div className="rounded-xl overflow-hidden border border-slate-800 max-h-[500px] flex items-center justify-center bg-black">
                          <img
                            src={activeMaterial.imageContent?.imageUrl}
                            alt={activeMaterial.title}
                            className="max-h-[500px] w-auto object-contain"
                          />
                        </div>
                        {activeMaterial.imageContent?.caption && (
                          <p className="text-xs text-slate-400 text-center italic">
                            {activeMaterial.imageContent.caption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 6. EXTERNAL RESOURCE */}
                    {activeMaterial.type === 'external_resource' && (
                      <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-4">
                        <ExternalLink className="w-10 h-10 text-blue-400 mx-auto" />
                        <div>
                          <h4 className="text-base font-bold text-white">{activeMaterial.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                            {activeMaterial.externalContent?.description ||
                              'External linguistic reference and vocabulary database.'}
                          </p>
                        </div>
                        <a
                          href={activeMaterial.externalContent?.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
                        >
                          <span>Launch External Resource</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* 7. INTERACTIVE QUIZ */}
                    {activeMaterial.type === 'quiz' && (
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                              Assessment Mode
                            </span>
                            <h4 className="text-base font-bold text-white">
                              {activeMaterial.quizContent?.title || activeMaterial.title}
                            </h4>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                            Passing Score: {activeMaterial.quizContent?.passingScore || 75}%
                          </span>
                        </div>

                        {/* Submitted Score Banner */}
                        {quizSubmitted && quizScore !== null && (
                          <div
                            className={`p-4 rounded-xl border flex items-center justify-between ${
                              quizPassed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {quizPassed ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                              )}
                              <div>
                                <h5 className="font-bold text-sm">
                                  {quizPassed ? 'Congratulations! Quiz Passed' : 'Quiz Not Passed'}
                                </h5>
                                <p className="text-xs opacity-80">
                                  Your Score: {quizScore}% (Benchmark:{' '}
                                  {activeMaterial.quizContent?.passingScore || 75}%)
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setQuizSubmitted(false);
                                setQuizAnswers({});
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Retake</span>
                            </button>
                          </div>
                        )}

                        {/* Quiz Questions */}
                        <div className="space-y-6">
                          {(activeMaterial.quizContent?.questions || []).map((q, qIdx) => {
                            const selected = quizAnswers[q.id || `q_${qIdx}`];
                            return (
                              <div
                                key={q.id || qIdx}
                                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-200">
                                    Question {qIdx + 1}: {q.question}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {q.options.map((opt, optIdx) => {
                                    const isOptSelected = selected === optIdx;
                                    let optClass =
                                      'border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300';

                                    if (quizSubmitted) {
                                      if (optIdx === q.correctOptionIndex) {
                                        optClass =
                                          'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold';
                                      } else if (isOptSelected && optIdx !== q.correctOptionIndex) {
                                        optClass =
                                          'border-red-500 bg-red-500/20 text-red-300';
                                      }
                                    } else if (isOptSelected) {
                                      optClass =
                                        'border-indigo-500 bg-indigo-500/20 text-white font-semibold ring-1 ring-indigo-500';
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        disabled={quizSubmitted}
                                        onClick={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            [q.id || `q_${qIdx}`]: optIdx,
                                          })
                                        }
                                        className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between transition ${optClass}`}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                                            {String.fromCharCode(65 + optIdx)}
                                          </span>
                                          <span>{opt}</span>
                                        </div>
                                        {quizSubmitted && optIdx === q.correctOptionIndex && (
                                          <Check className="w-4 h-4 text-emerald-400" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {quizSubmitted && q.explanation && (
                                  <div className="p-2.5 rounded-lg bg-slate-950 text-[11px] text-slate-400 border border-slate-800">
                                    <strong className="text-indigo-400">Explanation:</strong>{' '}
                                    {q.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {!quizSubmitted && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => handleSubmitQuiz(activeMaterial)}
                              disabled={submittingQuiz}
                              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{submittingQuiz ? 'Evaluating...' : 'Submit Quiz for Grading'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 8. WRITING ASSIGNMENT */}
                    {activeMaterial.type === 'assignment' && (
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div>
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                              Writing Assignment Task
                            </span>
                            <h4 className="text-base font-bold text-white">
                              {activeMaterial.title}
                            </h4>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                            Max: {activeMaterial.assignmentContent?.maxScore || 100} Points
                          </span>
                        </div>

                        {/* Assignment Prompt */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Prompt Instructions:
                          </h5>
                          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                            {activeMaterial.assignmentContent?.prompt ||
                              'Please submit your analytical essay according to standard CEFR guidelines.'}
                          </p>
                          {activeMaterial.assignmentContent?.rubric && (
                            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                              <strong className="text-rose-400">Evaluation Rubric:</strong>{' '}
                              {activeMaterial.assignmentContent.rubric}
                            </div>
                          )}
                        </div>

                        {/* Submission status */}
                        {assignmentSubmitted && (
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div>
                              <h5 className="text-xs font-bold">Submission Confirmed</h5>
                              <p className="text-[11px] opacity-80">
                                Your response has been logged and sent to your instructor for academic assessment.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Essay Text Area */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <label className="font-semibold text-slate-300">
                              Your Essay / Written Response:
                            </label>
                            <span>
                              Words: {assignmentText.trim() ? assignmentText.trim().split(/\s+/).length : 0} &bull; Chars: {assignmentText.length}
                            </span>
                          </div>
                          <textarea
                            rows={8}
                            value={assignmentText}
                            onChange={(e) => setAssignmentText(e.target.value)}
                            disabled={assignmentSubmitted}
                            placeholder="Type or paste your academic essay response here..."
                            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans leading-relaxed disabled:opacity-60"
                          />
                        </div>

                        {/* File Attachment Upload Simulation */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                          <div className="text-xs">
                            <span className="font-semibold text-slate-300 block">
                              Supplementary Attachment (Optional)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Attach PDF, Word doc, or recorded speaking audio.
                            </span>
                          </div>
                          <input
                            type="file"
                            id="assignmentFile"
                            disabled={assignmentSubmitted}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setAssignmentFileName(e.target.files[0].name);
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="assignmentFile"
                            className={`px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer transition ${
                              assignmentSubmitted ? 'opacity-50 pointer-events-none' : ''
                            }`}
                          >
                            {assignmentFileName ? assignmentFileName : 'Choose File'}
                          </label>
                        </div>

                        {!assignmentSubmitted ? (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => handleSubmitAssignment(activeMaterial)}
                              disabled={submittingAssignment}
                              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{submittingAssignment ? 'Submitting...' : 'Submit Assignment'}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => setAssignmentSubmitted(false)}
                              className="px-4 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                            >
                              Edit Submission
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Sticky Navigation Footer */}
              <footer className="h-16 px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 z-20">
                <button
                  disabled={currentLessonIndex <= 0}
                  onClick={handlePrevLesson}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Lesson</span>
                </button>

                <div className="text-center hidden sm:block">
                  <span className="text-xs text-slate-400">
                    Lesson {currentLessonIndex + 1} of {allLessons.length}
                  </span>
                </div>

                <button
                  disabled={currentLessonIndex >= allLessons.length - 1}
                  onClick={handleNextLesson}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 transition shadow-sm"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </footer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
