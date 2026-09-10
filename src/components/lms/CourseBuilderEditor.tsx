import React, { useState } from 'react';
import {
  Course,
  CourseModule,
  CourseLesson,
  LessonMaterial,
  CourseStatus,
  MaterialType,
} from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ModuleModal } from './ModuleModal';
import { LessonModal } from './LessonModal';
import { MaterialModal } from './MaterialModal';
import { CourseSettingsModal } from './CourseSettingsModal';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Layers,
  ChevronDown,
  ChevronUp,
  MoveUp,
  MoveDown,
  Edit2,
  Trash2,
  PlayCircle,
  Settings,
  CheckCircle2,
  AlertCircle,
  Archive,
  Eye,
  Clock,
  FileText,
  Video,
  FileDown,
  Volume2,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

interface CourseBuilderEditorProps {
  course: Course;
  onBack: () => void;
  onCourseUpdated: (updatedCourse: Course) => void;
  onOpenPlayer: (course: Course) => void;
  teachers?: { id: string; fullName: string; avatarUrl?: string }[];
}

export const CourseBuilderEditor: React.FC<CourseBuilderEditorProps> = ({
  course,
  onBack,
  onCourseUpdated,
  onOpenPlayer,
  teachers = [],
}) => {
  const { showToast } = useAuth();

  // Modals state
  const [courseSettingsOpen, setCourseSettingsOpen] = useState(false);

  // Module Modal
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  // Lesson Modal
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);

  // Material Modal
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [targetLessonId, setTargetLessonId] = useState<string | null>(null);
  const [targetModuleForMat, setTargetModuleForMat] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<LessonMaterial | null>(null);

  // Collapsed modules state
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const toggleModuleCollapse = (modId: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Status Change
  const handleStatusChange = async (status: CourseStatus) => {
    try {
      const updated = await api.updateCourseStatus(course.id, status);
      onCourseUpdated(updated);
      showToast(`Course status updated to ${status}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update course status', 'error');
    }
  };

  // Save Course Settings
  const handleSaveCourseSettings = async (data: Partial<Course>) => {
    try {
      const updated = await api.updateCourse(course.id, data);
      onCourseUpdated(updated);
      showToast('Course settings updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update course', 'error');
    }
  };

  // Module Handlers
  const handleSaveModule = async (data: {
    title: string;
    titleAr?: string;
    description?: string;
    order?: number;
  }) => {
    try {
      if (editingModule) {
        await api.updateModule(course.id, editingModule.id, data);
        showToast('Module updated successfully!', 'success');
      } else {
        await api.createModule(course.id, data);
        showToast('Module created successfully!', 'success');
      }
      // Refresh course
      const refreshed = await api.getCourseById(course.id);
      onCourseUpdated(refreshed);
    } catch (err: any) {
      showToast(err.message || 'Failed to save module', 'error');
    }
  };

  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete module "${title}" and all its lessons?`)) return;
    try {
      await api.deleteModule(course.id, moduleId);
      const refreshed = await api.getCourseById(course.id);
      onCourseUpdated(refreshed);
      showToast('Module deleted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete module', 'error');
    }
  };

  const handleReorderModule = async (moduleId: string, direction: 'up' | 'down') => {
    const modules = course.modules || [];
    const index = modules.findIndex((m) => m.id === moduleId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...modules];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    try {
      const updated = await api.reorderModules(
        course.id,
        reordered.map((m) => m.id)
      );
      onCourseUpdated(updated);
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder modules', 'error');
    }
  };

  // Lesson Handlers
  const handleSaveLesson = async (data: {
    title: string;
    titleAr?: string;
    description?: string;
    durationMinutes?: number;
    isFreePreview?: boolean;
    order?: number;
  }) => {
    if (!targetModuleId) return;
    try {
      if (editingLesson) {
        await api.updateLesson(course.id, targetModuleId, editingLesson.id, data);
        showToast('Lesson updated successfully!', 'success');
      } else {
        await api.createLesson(course.id, targetModuleId, data);
        showToast('Lesson added to module!', 'success');
      }
      const refreshed = await api.getCourseById(course.id);
      onCourseUpdated(refreshed);
    } catch (err: any) {
      showToast(err.message || 'Failed to save lesson', 'error');
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string, title: string) => {
    if (!confirm(`Delete lesson "${title}"?`)) return;
    try {
      await api.deleteLesson(course.id, moduleId, lessonId);
      const refreshed = await api.getCourseById(course.id);
      onCourseUpdated(refreshed);
      showToast('Lesson deleted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete lesson', 'error');
    }
  };

  const handleReorderLesson = async (moduleId: string, lessonId: string, direction: 'up' | 'down') => {
    const mod = (course.modules || []).find((m) => m.id === moduleId);
    if (!mod || !mod.lessons) return;
    const index = mod.lessons.findIndex((l) => l.id === lessonId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === mod.lessons.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...mod.lessons];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    try {
      await api.reorderLessons(
        course.id,
        moduleId,
        reordered.map((l) => l.id)
      );
      const refreshed = await api.getCourseById(course.id);
      onCourseUpdated(refreshed);
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder lessons', 'error');
    }
  };

  // Material Handlers
  const handleSaveMaterial = async (data: Partial<LessonMaterial>) => {
    if (!targetModuleForMat || !targetLessonId) return;
    try {
      if (editingMaterial) {
        await api.updateMaterial(
          course.id,
          targetModuleForMat,
          targetLessonId,
          editingMaterial.id,
          data
        );
        showToast('Material updated successfully!', 'success');
      } else {
        await api.createMaterial(course.id, targetModuleForMat, targetLessonId, data);
        showToast('Material added to lesson!', 'success');
      }
      const refreshed = await api.getCourseById(course.id);
      onCourseUpdated(refreshed);
    } catch (err: any) {
      showToast(err.message || 'Failed to save material', 'error');
    }
  };

  const handleDeleteMaterial = async (
    moduleId: string,
    lessonId: string,
    materialId: string,
    title: string
  ) => {
    if (!confirm(`Delete material "${title}"?`)) return;
    try {
      await api.deleteMaterial(course.id, moduleId, lessonId, materialId);
      const refreshed = await api.getCourseById(course.id);
      onCourseUpdated(refreshed);
      showToast('Material deleted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete material', 'error');
    }
  };

  const materialTypeIcons: Record<MaterialType, { icon: any; color: string; label: string }> = {
    text: { icon: FileText, color: 'text-sky-600 bg-sky-50', label: 'Text' },
    video: { icon: Video, color: 'text-red-600 bg-red-50', label: 'Video' },
    pdf: { icon: FileDown, color: 'text-amber-600 bg-amber-50', label: 'PDF' },
    audio: { icon: Volume2, color: 'text-purple-600 bg-purple-50', label: 'Audio' },
    image: { icon: ImageIcon, color: 'text-emerald-600 bg-emerald-50', label: 'Image' },
    external_resource: { icon: ExternalLink, color: 'text-blue-600 bg-blue-50', label: 'Link' },
    quiz: { icon: HelpCircle, color: 'text-indigo-600 bg-indigo-50', label: 'Quiz' },
    assignment: { icon: FileCheck2, color: 'text-rose-600 bg-rose-50', label: 'Assignment' },
  };

  const totalLessons = (course.modules || []).reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb and Course Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Course Directory</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{course.title}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                {course.code}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                CEFR {course.level}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {course.category}
              </span>
            </div>

            {course.titleAr && (
              <p className="text-xs text-slate-500 font-serif" dir="rtl">
                {course.titleAr}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Status Control Buttons */}
            <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 text-xs">
              <button
                onClick={() => handleStatusChange('published')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  course.status === 'published'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Published</span>
              </button>
              <button
                onClick={() => handleStatusChange('draft')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  course.status === 'draft'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-amber-700'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Draft</span>
              </button>
              <button
                onClick={() => handleStatusChange('archived')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  course.status === 'archived'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archived</span>
              </button>
            </div>

            <button
              onClick={() => onOpenPlayer(course)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>Preview Student LMS</span>
            </button>

            <button
              onClick={() => setCourseSettingsOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setEditingModule(null);
                setModuleModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Module</span>
            </button>
          </div>
        </div>

        {/* Course Meta Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Curriculum Depth:</span>
            <span className="font-bold text-slate-800">
              {course.modules?.length || 0} Modules &bull; {totalLessons} Lessons
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Assigned Faculty:</span>
            <span className="font-bold text-slate-800">
              {course.teacherName || 'Not assigned'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Tuition & Pricing:</span>
            <span className="font-bold text-slate-800">
              {course.pricing?.type === 'free'
                ? 'Free Enrollment'
                : `${course.pricing?.amount || course.price} ${course.pricing?.currency || 'SAR'}`}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Enrollment Model:</span>
            <span className="font-bold text-slate-800 capitalize">
              {course.enrollmentRules?.type?.replace('_', ' ') || 'Open Registration'}
            </span>
          </div>
        </div>
      </div>

      {/* Course Builder Hierarchy List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Curriculum Hierarchy (Modules &rarr; Lessons &rarr; Materials)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Reorder modules and lessons with live updates. Add video, audio, quiz, or writing materials.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingModule(null);
              setModuleModalOpen(true);
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Module</span>
          </button>
        </div>

        {(!course.modules || course.modules.length === 0) ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Modules Created Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Start building this course curriculum by adding your first module. Modules group structured lessons and materials together.
            </p>
            <button
              onClick={() => {
                setEditingModule(null);
                setModuleModalOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Module 1</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {course.modules.map((mod, modIdx) => {
              const isCollapsed = !!collapsedModules[mod.id];
              return (
                <div
                  key={mod.id}
                  id={`module-block-${mod.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  {/* Module Header Bar */}
                  <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          disabled={modIdx === 0}
                          onClick={() => handleReorderModule(mod.id, 'up')}
                          title="Move Module Up"
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={modIdx === (course.modules?.length || 0) - 1}
                          onClick={() => handleReorderModule(mod.id, 'down')}
                          title="Move Module Down"
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Module Number badge */}
                      <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {mod.order || modIdx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({mod.lessons?.length || 0} Lessons)
                          </span>
                        </div>
                        {mod.titleAr && (
                          <p className="text-xs text-slate-500 font-serif" dir="rtl">
                            {mod.titleAr}
                          </p>
                        )}
                        {mod.description && (
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Module Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setTargetModuleId(mod.id);
                          setEditingLesson(null);
                          setLessonModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lesson</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingModule(mod);
                          setModuleModalOpen(true);
                        }}
                        title="Edit Module Details"
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteModule(mod.id, mod.title)}
                        title="Delete Module"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleModuleCollapse(mod.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition ml-1"
                      >
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Lessons List inside Module */}
                  {!isCollapsed && (
                    <div className="p-4 space-y-3 bg-white">
                      {(!mod.lessons || mod.lessons.length === 0) ? (
                        <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                          <p className="text-xs text-slate-500">No lessons inside this module yet.</p>
                          <button
                            onClick={() => {
                              setTargetModuleId(mod.id);
                              setEditingLesson(null);
                              setLessonModalOpen(true);
                            }}
                            className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add First Lesson</span>
                          </button>
                        </div>
                      ) : (
                        mod.lessons.map((lesson, lesIdx) => (
                          <div
                            key={lesson.id}
                            id={`lesson-block-${lesson.id}`}
                            className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-3.5 space-y-3 hover:border-slate-300 transition"
                          >
                            {/* Lesson Title & Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                {/* Lesson Reorder */}
                                <div className="flex flex-col">
                                  <button
                                    disabled={lesIdx === 0}
                                    onClick={() => handleReorderLesson(mod.id, lesson.id, 'up')}
                                    className="p-0.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                  >
                                    <MoveUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    disabled={lesIdx === (mod.lessons?.length || 0) - 1}
                                    onClick={() => handleReorderLesson(mod.id, lesson.id, 'down')}
                                    className="p-0.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                  >
                                    <MoveDown className="w-3 h-3" />
                                  </button>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs text-slate-900">
                                      {lesson.order || lesIdx + 1}. {lesson.title}
                                    </span>
                                    {lesson.isFreePreview && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                                        Free Preview
                                      </span>
                                    )}
                                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{lesson.durationMinutes || 20}m</span>
                                    </span>
                                  </div>
                                  {lesson.titleAr && (
                                    <p className="text-xs text-slate-500 font-serif" dir="rtl">
                                      {lesson.titleAr}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Lesson Controls */}
                              <div className="flex items-center gap-1.5 self-end sm:self-center">
                                <button
                                  onClick={() => {
                                    setTargetModuleForMat(mod.id);
                                    setTargetLessonId(lesson.id);
                                    setEditingMaterial(null);
                                    setMaterialModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Material</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setTargetModuleId(mod.id);
                                    setEditingLesson(lesson);
                                    setLessonModalOpen(true);
                                  }}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-500"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() => handleDeleteLesson(mod.id, lesson.id, lesson.title)}
                                  className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Materials Attached inside Lesson */}
                            <div className="pl-6 border-l-2 border-indigo-200/60 space-y-2">
                              {(!lesson.materials || lesson.materials.length === 0) ? (
                                <p className="text-[11px] text-slate-400 italic">
                                  No materials attached to this lesson yet. Click "Add Material" to attach video lectures, reading PDFs, audio files, interactive quizzes, or assignments.
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {lesson.materials.map((mat, matIdx) => {
                                    const meta = materialTypeIcons[mat.type] || {
                                      icon: FileText,
                                      color: 'text-slate-600 bg-slate-100',
                                      label: mat.type,
                                    };
                                    const Icon = meta.icon;
                                    return (
                                      <div
                                        key={mat.id || matIdx}
                                        className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs hover:border-indigo-300 transition"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className={`p-1.5 rounded-lg shrink-0 ${meta.color}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                          </div>
                                          <div className="truncate">
                                            <span className="text-xs font-semibold text-slate-800 block truncate">
                                              {mat.title}
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                              {meta.label}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          <button
                                            onClick={() => {
                                              setTargetModuleForMat(mod.id);
                                              setTargetLessonId(lesson.id);
                                              setEditingMaterial(mat);
                                              setMaterialModalOpen(true);
                                            }}
                                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteMaterial(mod.id, lesson.id, mat.id, mat.title)
                                            }
                                            className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {courseSettingsOpen && (
        <CourseSettingsModal
          isOpen={courseSettingsOpen}
          onClose={() => setCourseSettingsOpen(false)}
          onSave={handleSaveCourseSettings}
          initialCourse={course}
          teachers={teachers}
        />
      )}

      {moduleModalOpen && (
        <ModuleModal
          isOpen={moduleModalOpen}
          onClose={() => {
            setModuleModalOpen(false);
            setEditingModule(null);
          }}
          onSave={handleSaveModule}
          initialModule={editingModule}
          defaultOrder={(course.modules?.length || 0) + 1}
        />
      )}

      {lessonModalOpen && (
        <LessonModal
          isOpen={lessonModalOpen}
          onClose={() => {
            setLessonModalOpen(false);
            setEditingLesson(null);
            setTargetModuleId(null);
          }}
          onSave={handleSaveLesson}
          initialLesson={editingLesson}
        />
      )}

      {materialModalOpen && (
        <MaterialModal
          isOpen={materialModalOpen}
          onClose={() => {
            setMaterialModalOpen(false);
            setEditingMaterial(null);
            setTargetLessonId(null);
            setTargetModuleForMat(null);
          }}
          onSave={handleSaveMaterial}
          initialMaterial={editingMaterial}
        />
      )}
    </div>
  );
};
