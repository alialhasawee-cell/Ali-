import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, UserRole, UserListResponse } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Shield,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Trash2,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Check,
} from 'lucide-react';

const ROLE_BADGE_COLORS: Record<UserRole, { bg: string; text: string; label: string }> = {
  SUPER_ADMIN: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Super Admin' },
  ORGANIZATION_OWNER: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'Owner' },
  ADMIN: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', label: 'Admin' },
  MANAGER: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Manager' },
  TEACHER: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Teacher' },
  STAFF: { bg: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-700', label: 'Staff' },
  STUDENT: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', label: 'Student' },
  PARENT: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Parent' },
};

export const TenantUsersView: React.FC = () => {
  const { currentTenant, showToast } = useAuth();

  // Query & Pagination State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  // Data State
  const [data, setData] = useState<UserListResponse>({
    users: [],
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleModalUser, setRoleModalUser] = useState<User | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<UserRole>('STUDENT');

  // New User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newFullNameAr, setNewFullNameAr] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('STUDENT');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');
  // Student Specific Form Fields
  const [newCefrLevel, setNewCefrLevel] = useState('B1');
  const [newTargetExam, setNewTargetExam] = useState('General English');
  const [newParentEmail, setNewParentEmail] = useState('');
  // Teacher Specific Form Fields
  const [newSpecialization, setNewSpecialization] = useState('IELTS Academic');
  const [newBio, setNewBio] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getPagedUsers({
        search: search.trim() || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        limit,
      });
      setData(res);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      showToast(err.message || 'Error fetching user directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter, page, limit, currentTenant?.id]);

  // Handle Add User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    try {
      await api.createUser({
        fullName: newFullName.trim(),
        fullNameAr: newFullNameAr.trim() || undefined,
        email: newEmail.trim().toLowerCase(),
        phone: newPhone.trim() || undefined,
        role: newRole,
        status: newStatus,
        studentDetails:
          newRole === 'STUDENT'
            ? {
                level: newCefrLevel as any,
                targetExam: newTargetExam as any,
                parentEmail: newParentEmail || undefined,
              }
            : undefined,
        teacherDetails:
          newRole === 'TEACHER'
            ? {
                specialization: newSpecialization,
                bio: newBio,
              }
            : undefined,
      });

      showToast(`User ${newFullName} added to organization!`, 'success');
      setShowAddModal(false);
      resetAddForm();
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to create user', 'error');
    }
  };

  const resetAddForm = () => {
    setNewFullName('');
    setNewFullNameAr('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('STUDENT');
    setNewStatus('active');
    setNewCefrLevel('B1');
    setNewTargetExam('General English');
    setNewParentEmail('');
    setNewSpecialization('IELTS Academic');
    setNewBio('');
  };

  // Handle Edit User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await api.updateUser(editingUser.id, {
        fullName: editingUser.fullName,
        fullNameAr: editingUser.fullNameAr,
        phone: editingUser.phone,
        studentDetails: editingUser.studentDetails,
        teacherDetails: editingUser.teacherDetails,
      });

      showToast(`Profile updated for ${editingUser.fullName}`, 'success');
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to update user', 'error');
    }
  };

  // Handle Toggle Status (Active / Inactive)
  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await api.setUserStatus(user.id, nextStatus);
      showToast(
        `User ${user.fullName} is now marked as ${nextStatus.toUpperCase()}`,
        nextStatus === 'active' ? 'success' : 'info'
      );
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to update user status', 'error');
    }
  };

  // Handle Assign Role
  const handleAssignRole = async () => {
    if (!roleModalUser) return;

    try {
      await api.setUserRole(roleModalUser.id, newSelectedRole);
      showToast(
        `Role for ${roleModalUser.fullName} updated to ${newSelectedRole}`,
        'success'
      );
      setRoleModalUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to reassign role', 'error');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to remove ${user.fullName} from this organization? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteUser(user.id);
      showToast(`User ${user.fullName} removed from organization.`, 'info');
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              User & Staff Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {data.total} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, enroll learners, assign pedagogical roles, and manage credentials for{' '}
            <strong className="text-slate-700">{currentTenant?.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition shadow-md whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* 2. Search, Filter, and Pagination Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by full name, Arabic name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="TEACHER">Teachers / Instructors</option>
              <option value="ADMIN">Admins</option>
              <option value="MANAGER">Managers</option>
              <option value="STAFF">Staff</option>
              <option value="ORGANIZATION_OWNER">Owners</option>
              <option value="PARENT">Parents</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Disabled / Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Page Size:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="py-1.5 px-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value={5}>5 / page</option>
              <option value={8}>8 / page</option>
              <option value={15}>15 / page</option>
              <option value={25}>25 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. User Table & Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Academic Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading organization user directory...
                  </td>
                </tr>
              ) : data.users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span className="font-bold text-slate-700 block text-sm">No users matched your criteria</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Try clearing search filters or click "Add New User" to enroll faculty or students.
                    </p>
                    {(search || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
                      <button
                        onClick={() => {
                          setSearch('');
                          setRoleFilter('ALL');
                          setStatusFilter('ALL');
                          setPage(1);
                        }}
                        className="mt-3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                data.users.map((u) => {
                  const roleBadge = ROLE_BADGE_COLORS[u.role] || {
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                    label: u.role,
                  };

                  const isStudent = u.role === 'STUDENT';
                  const isTeacher = u.role === 'TEACHER';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      {/* Name & Arabic */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs flex-shrink-0">
                            {u.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.fullName}</span>
                            {u.fullNameAr && (
                              <span className="text-[11px] text-slate-400 font-serif block" dir="rtl">
                                {u.fullNameAr}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role Badge & Changer */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setRoleModalUser(u);
                            setNewSelectedRole(u.role);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border hover:opacity-80 transition ${roleBadge.bg} ${roleBadge.text}`}
                          title="Click to reassign role"
                        >
                          <span>{roleBadge.label}</span>
                          <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      </td>

                      {/* Academic / Pedagogical Details */}
                      <td className="py-3 px-4 text-slate-600">
                        {isStudent && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded text-[10px]">
                                CEFR {u.studentDetails?.level || 'B1'}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {u.studentDetails?.targetExam || 'General'}
                              </span>
                            </div>
                            {u.studentDetails?.parentEmail && (
                              <span className="text-[10px] text-slate-400 block">
                                Parent: {u.studentDetails.parentEmail}
                              </span>
                            )}
                          </div>
                        )}

                        {isTeacher && (
                          <div>
                            <span className="font-medium text-emerald-800 text-[11px] block">
                              {u.teacherDetails?.specialization || 'General English'}
                            </span>
                            {u.teacherDetails?.bio && (
                              <span className="text-[10px] text-slate-400 truncate block max-w-xs">
                                {u.teacherDetails.bio}
                              </span>
                            )}
                          </div>
                        )}

                        {!isStudent && !isTeacher && (
                          <span className="text-slate-400 text-[11px]">Administrative Staff</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : u.status === 'inactive' ? (
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Inactive
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Status */}
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                              u.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Disable User' : 'Reactivate User'}
                          >
                            {u.status === 'active' ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => setEditingUser({ ...u })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                            title="Edit User Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Showing <strong className="text-slate-800">{data.users.length > 0 ? (page - 1) * limit + 1 : 0}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(page * limit, data.total)}</strong> of{' '}
            <strong className="text-slate-800">{data.total}</strong> users
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 text-slate-600 font-semibold">
              Page {data.page} of {data.totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD NEW USER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add New Organization User</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name (Arabic)</label>
                  <input
                    type="text"
                    value={newFullNameAr}
                    onChange={(e) => setNewFullNameAr(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-serif text-right"
                    dir="rtl"
                    placeholder="جين دو"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    placeholder="user@academy.edu"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="+966 50 000 0000"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">System Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-indigo-700"
                  >
                    <option value="STUDENT">STUDENT (Learner)</option>
                    <option value="TEACHER">TEACHER (Faculty)</option>
                    <option value="ADMIN">ADMIN (Academy Admin)</option>
                    <option value="MANAGER">MANAGER (Academic Supervisor)</option>
                    <option value="STAFF">STAFF (Support)</option>
                    <option value="PARENT">PARENT (Guardian)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="active">Active (Immediate Access)</option>
                    <option value="inactive">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>

              {/* Student Specific Fields */}
              {newRole === 'STUDENT' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 text-[11px] block">
                    Student Enrollment Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-slate-600 block mb-1">CEFR Baseline Level</label>
                      <select
                        value={newCefrLevel}
                        onChange={(e) => setNewCefrLevel(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="A1">A1 - Beginner</option>
                        <option value="A2">A2 - Elementary</option>
                        <option value="B1">B1 - Intermediate</option>
                        <option value="B2">B2 - Upper Intermediate</option>
                        <option value="C1">C1 - Advanced</option>
                        <option value="C2">C2 - Proficient Mastery</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-medium text-slate-600 block mb-1">Target Examination</label>
                      <select
                        value={newTargetExam}
                        onChange={(e) => setNewTargetExam(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="General English">General English</option>
                        <option value="IELTS Academic">IELTS Academic (Band 7.5+)</option>
                        <option value="TOEFL iBT">TOEFL iBT</option>
                        <option value="Business English">Business English</option>
                        <option value="OET Medical">OET Medical English</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-medium text-slate-600 block mb-1">Parent / Guardian Email</label>
                      <input
                        type="email"
                        value={newParentEmail}
                        onChange={(e) => setNewParentEmail(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200"
                        placeholder="parent@home.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher Specific Fields */}
              {newRole === 'TEACHER' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 text-[11px] block">
                    Teacher Qualifications & Subject Area
                  </span>
                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-slate-600 block mb-1">Primary Specialization</label>
                      <input
                        type="text"
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200"
                        placeholder="e.g. IELTS Academic, Business English, Phonetics"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-600 block mb-1">Certifications & Bio</label>
                      <textarea
                        rows={2}
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200"
                        placeholder="e.g. CELTA Certified, 8 years IELTS examiner experience"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER DETAILS */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Edit User Profile</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Arabic Name</label>
                <input
                  type="text"
                  value={editingUser.fullNameAr || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, fullNameAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-serif text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* If student */}
              {editingUser.role === 'STUDENT' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 text-[11px] block">Student Academic Level</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-slate-600 block mb-1">CEFR Level</label>
                      <select
                        value={editingUser.studentDetails?.level || 'B1'}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            studentDetails: {
                              ...editingUser.studentDetails,
                              level: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-medium text-slate-600 block mb-1">Target Exam</label>
                      <input
                        type="text"
                        value={editingUser.studentDetails?.targetExam || ''}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            studentDetails: {
                              ...editingUser.studentDetails,
                              targetExam: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN ROLE */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Assign Role</h3>
              </div>
              <button
                onClick={() => setRoleModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Change permission tier for <strong className="text-slate-800">{roleModalUser.fullName}</strong> ({roleModalUser.email}).
              </p>

              <div className="space-y-2">
                {(['STUDENT', 'TEACHER', 'ADMIN', 'MANAGER', 'STAFF', 'ORGANIZATION_OWNER', 'PARENT'] as UserRole[]).map(
                  (role) => (
                    <label
                      key={role}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        newSelectedRole === role
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="assignedRole"
                          checked={newSelectedRole === role}
                          onChange={() => setNewSelectedRole(role)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{role}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {role === 'STUDENT'
                          ? 'Learning portal & assignments'
                          : role === 'TEACHER'
                          ? 'Course instruction & grading'
                          : role === 'ADMIN'
                          ? 'Full academy configuration'
                          : role === 'MANAGER'
                          ? 'Curriculum & classes'
                          : 'Standard access'}
                      </span>
                    </label>
                  )
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignRole}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-sm"
                >
                  Confirm Reassignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
