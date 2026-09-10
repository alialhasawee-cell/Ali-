import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Course, CourseStatus } from '../types';
import { CourseCard } from '../components/lms/CourseCard';
import { CourseSettingsModal } from '../components/lms/CourseSettingsModal';
import { CourseBuilderEditor } from '../components/lms/CourseBuilderEditor';
import { StudentLmsPlayer } from '../components/lms/StudentLmsPlayer';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Archive,
  GraduationCap,
} from 'lucide-react';

export const CoursesLmsView: React.FC = () => {
  const { currentTenant, showToast, hasRole, activeRole } = useAuth();

  // Mode: 'catalog' | 'builder' | 'player'
  const [viewMode, setViewMode] = useState<'catalog' | 'builder' | 'player'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Courses data
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<{ id: string; fullName: string; avatarUrl?: string }[]>(
    []
  );

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pricingFilter, setPricingFilter] = useState('all');

  // Course Settings Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingSettingsCourse, setEditingSettingsCourse] = useState<Course | null>(null);

  const canManage = hasRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER', 'SUPER_ADMIN']);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, teachersData] = await Promise.all([
        api.getCourses(),
        api.getTeachers().catch(() => []),
      ]);
      setCourses(coursesData);
      const rawTeachers: any[] = Array.isArray(teachersData)
        ? teachersData
        : (teachersData as any)?.teachers || [];
      setTeachers(
        rawTeachers.map((t: any) => ({
          id: t.id,
          fullName: t.fullName,
          avatarUrl: t.avatarUrl,
        }))
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant?.id]);

  // Create or Update Course
  const handleSaveCourse = async (data: Partial<Course>) => {
    try {
      if (editingSettingsCourse) {
        const updated = await api.updateCourse(editingSettingsCourse.id, data);
        setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        if (selectedCourse?.id === updated.id) {
          setSelectedCourse(updated);
        }
        showToast('Course specifications updated!', 'success');
      } else {
        const created = await api.createCourse(data);
        setCourses((prev) => [created, ...prev]);
        showToast(`Course "${created.title}" created successfully!`, 'success');
        // Automatically open the builder so user can construct modules & lessons
        setSelectedCourse(created);
        setViewMode('builder');
      }
      setCreateModalOpen(false);
      setEditingSettingsCourse(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save course', 'error');
    }
  };

  // Status Change
  const handleStatusChange = async (courseId: string, status: CourseStatus) => {
    try {
      const updated = await api.updateCourseStatus(courseId, status);
      setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      if (selectedCourse?.id === updated.id) {
        setSelectedCourse(updated);
      }
      showToast(`Course marked as ${status}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update course status', 'error');
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await api.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
        setViewMode('catalog');
      }
      showToast('Course removed from catalogue', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete course', 'error');
    }
  };

  // Filter logic
  const filteredCourses = courses.filter((c) => {
    // Search query matches title, code, category, teacher, or description
    const matchQuery =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.teacherName && c.teacherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchLevel = levelFilter === 'all' || c.level === levelFilter;
    const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchPricing =
      pricingFilter === 'all' ||
      (pricingFilter === 'free' && c.pricing?.type === 'free') ||
      (pricingFilter === 'paid' && c.pricing?.type === 'paid');

    return matchQuery && matchLevel && matchCategory && matchStatus && matchPricing;
  });

  // If currently in Course Builder Editor
  if (viewMode === 'builder' && selectedCourse) {
    return (
      <CourseBuilderEditor
        course={selectedCourse}
        onBack={() => {
          setViewMode('catalog');
          setSelectedCourse(null);
          loadData();
        }}
        onCourseUpdated={(updated) => {
          setSelectedCourse(updated);
          setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }}
        onOpenPlayer={(courseToPlay) => {
          setSelectedCourse(courseToPlay);
          setViewMode('player');
        }}
        teachers={teachers}
      />
    );
  }

  // If currently in Student LMS Player
  if (viewMode === 'player' && selectedCourse) {
    return (
      <StudentLmsPlayer
        course={selectedCourse}
        onBack={() => {
          setViewMode('catalog');
          setSelectedCourse(null);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Curriculum & Course Management (LMS)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build and publish hierarchical courses (Course &rarr; Module &rarr; Lesson &rarr; Material) with student progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <button
              onClick={() => {
                setEditingSettingsCourse(null);
                setCreateModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Live Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title, code, instructor, or keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Level Filter */}
          <div className="w-full md:w-auto">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full md:w-36 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All CEFR Levels</option>
              <option value="A1">CEFR A1</option>
              <option value="A2">CEFR A2</option>
              <option value="B1">CEFR B1</option>
              <option value="B2">CEFR B2</option>
              <option value="C1">CEFR C1</option>
              <option value="C2">CEFR C2</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-44 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="General English">General English</option>
              <option value="IELTS Prep">IELTS Prep</option>
              <option value="TOEFL Prep">TOEFL Prep</option>
              <option value="Business English">Business English</option>
              <option value="Kids & Teens">Kids & Teens</option>
              <option value="Grammar & Writing">Grammar & Writing</option>
              <option value="Speaking & Pronunciation">Speaking & Pronunciation</option>
            </select>
          </div>

          {/* Status Filter */}
          {canManage && (
            <div className="w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-36 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts Only</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          )}

          {/* Pricing Filter */}
          <div className="w-full md:w-auto">
            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value)}
              className="w-full md:w-32 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Pricing</option>
              <option value="free">Free Only</option>
              <option value="paid">Paid Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Tags */}
        {(searchQuery ||
          levelFilter !== 'all' ||
          categoryFilter !== 'all' ||
          statusFilter !== 'all' ||
          pricingFilter !== 'all') && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400">Active filters:</span>
            <span className="font-semibold text-slate-700">
              {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'} matching
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setLevelFilter('all');
                setCategoryFilter('all');
                setStatusFilter('all');
                setPricingFilter('all');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500">
          Loading learning management system courses...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Courses Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No courses match the active filter criteria. Try adjusting the search query or creating a new course.
          </p>
          {canManage && (
            <button
              onClick={() => {
                setEditingSettingsCourse(null);
                setCreateModalOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Course</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              canManage={canManage}
              onOpenBuilder={(c) => {
                setSelectedCourse(c);
                setViewMode('builder');
              }}
              onOpenPlayer={(c) => {
                setSelectedCourse(c);
                setViewMode('player');
              }}
              onEditSettings={(c) => {
                setEditingSettingsCourse(c);
                setCreateModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      )}

      {/* Course Settings Modal (Create & Edit) */}
      {createModalOpen && (
        <CourseSettingsModal
          isOpen={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
            setEditingSettingsCourse(null);
          }}
          onSave={handleSaveCourse}
          initialCourse={editingSettingsCourse}
          teachers={teachers}
        />
      )}
    </div>
  );
};
