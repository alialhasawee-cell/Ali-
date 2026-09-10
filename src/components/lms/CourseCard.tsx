import React from 'react';
import { Course, CourseStatus } from '../../types';
import {
  BookOpen,
  Clock,
  Users,
  Layers,
  Sparkles,
  PlayCircle,
  Settings,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Archive,
  Trash2,
  DollarSign,
  Tag,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  canManage: boolean;
  onOpenBuilder: (course: Course) => void;
  onOpenPlayer: (course: Course) => void;
  onEditSettings: (course: Course) => void;
  onStatusChange: (courseId: string, status: CourseStatus) => void;
  onDelete: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  canManage,
  onOpenBuilder,
  onOpenPlayer,
  onEditSettings,
  onStatusChange,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const totalLessons = (course.modules || []).reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  );

  const statusColors: Record<CourseStatus, { bg: string; text: string; border: string }> = {
    published: {
      bg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    draft: {
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    archived: {
      bg: 'bg-slate-100 text-slate-600',
      text: 'text-slate-600',
      border: 'border-slate-200',
    },
  };

  const levelColors: Record<string, string> = {
    A1: 'bg-sky-100 text-sky-800 border-sky-200',
    A2: 'bg-blue-100 text-blue-800 border-blue-200',
    B1: 'bg-teal-100 text-teal-800 border-teal-200',
    B2: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    C1: 'bg-purple-100 text-purple-800 border-purple-200',
    C2: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    'All Levels': 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <div
      id={`course-card-${course.id}`}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group relative"
    >
      {/* Thumbnail Header */}
      <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                levelColors[course.level] || 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              CEFR {course.level}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
              {course.category}
            </span>
          </div>

          <div className="pointer-events-auto relative">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm ${
                statusColors[course.status]?.bg || 'bg-slate-100 text-slate-700'
              }`}
            >
              {course.status}
            </span>
          </div>
        </div>

        {/* Course Code & Teacher bottom overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="font-mono text-[10px] bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded text-slate-200">
            {course.code}
          </span>
          {course.teacherName && (
            <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {course.teacherAvatar ? (
                <img
                  src={course.teacherAvatar}
                  alt={course.teacherName}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-indigo-500 text-[9px] flex items-center justify-center font-bold">
                  {course.teacherName.charAt(0)}
                </div>
              )}
              <span className="text-[10px] text-slate-200 font-medium truncate max-w-[120px]">
                {course.teacherName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">
              {course.title}
            </h3>
            {canManage && (
              <div className="relative">
                <button
                  id={`course-menu-btn-${course.id}`}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-6 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-xs text-slate-700">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEditSettings(course);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Course Settings</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <p className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400">
                      Status Controls
                    </p>
                    {course.status !== 'published' && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onStatusChange(course.id, 'published');
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Publish Course</span>
                      </button>
                    )}
                    {course.status !== 'draft' && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onStatusChange(course.id, 'draft');
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-amber-700 flex items-center gap-2"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Unpublish (Draft)</span>
                      </button>
                    )}
                    {course.status !== 'archived' && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onStatusChange(course.id, 'archived');
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                      >
                        <Archive className="w-3.5 h-3.5 text-slate-500" />
                        <span>Archive Course</span>
                      </button>
                    )}
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Are you sure you want to delete course "${course.title}"?`)) {
                          onDelete(course.id);
                        }
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Delete Course</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {course.titleAr && (
            <p className="text-xs text-slate-500 font-serif line-clamp-1 mt-0.5" dir="rtl">
              {course.titleAr}
            </p>
          )}

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {course.description || 'No course description provided.'}
          </p>
        </div>

        {/* LMS Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-slate-600 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">{course.modules?.length || 0}</span>
              <span className="text-slate-400 ml-0.5">Mods</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">{totalLessons}</span>
              <span className="text-slate-400 ml-0.5">Lessons</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-slate-800">{course.durationWeeks || 8}w</span>
              <span className="text-slate-400 ml-0.5">({course.totalHours || 32}h)</span>
            </div>
          </div>
        </div>

        {/* Pricing & Enrollment Rule */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-900">
              {course.pricing?.type === 'free' ? (
                <span className="text-emerald-600">Free Course</span>
              ) : (
                <span>
                  {course.pricing?.amount || course.price} {course.pricing?.currency || 'SAR'}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{course.enrolledStudentsCount || 0} enrolled</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {canManage ? (
            <>
              <button
                id={`btn-build-${course.id}`}
                onClick={() => onOpenBuilder(course)}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Build Curriculum</span>
              </button>
              <button
                id={`btn-preview-${course.id}`}
                onClick={() => onOpenPlayer(course)}
                title="Preview as Student in LMS"
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1"
              >
                <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </>
          ) : (
            <button
              id={`btn-learn-${course.id}`}
              onClick={() => onOpenPlayer(course)}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Enter Learning Classroom</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
