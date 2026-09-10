import React, { useState, useEffect } from 'react';
import { StudentProfile, User, Course, BatchClass, CEFRLevel, StudentStatus } from '../../types';
import { UserPlus, Edit3, X, Check, AlertCircle, Sparkles } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  student: StudentProfile | null; // null if adding new, StudentProfile if editing
  courses: Course[];
  classes: BatchClass[];
  teachers: User[];
  defaultCountry?: string;
  defaultCity?: string;
  onClose: () => void;
  onSubmit: (studentData: Partial<StudentProfile> & { courseId?: string; classId?: string }) => Promise<void>;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  student,
  courses,
  classes,
  teachers,
  defaultCountry = 'Saudi Arabia',
  defaultCity = 'Riyadh',
  onClose,
  onSubmit,
}) => {
  const isEditing = !!student;

  // Active form section
  const [activeSection, setActiveSection] = useState<'personal' | 'contact' | 'academic' | 'guardian'>('personal');

  // Form states
  const [fullName, setFullName] = useState('');
  const [fullNameAr, setFullNameAr] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dateOfBirth, setDateOfBirth] = useState('2001-01-15');
  const [nationalIdOrPassport, setNationalIdOrPassport] = useState('');
  const [nationality, setNationality] = useState(defaultCountry);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Contact
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+966 50 ');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [district, setDistrict] = useState('Al-Olaya');
  const [addressLine, setAddressLine] = useState('King Fahd Road');
  const [country, setCountry] = useState(defaultCountry);

  // Academic
  const [studentType, setStudentType] = useState<'regular' | 'intensive' | 'private' | 'corporate'>('regular');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B1');
  const [targetExam, setTargetExam] = useState<string>('General English');
  const [status, setStatus] = useState<StudentStatus>('active');
  const [assignedTeacherId, setAssignedTeacherId] = useState('');
  const [assignedCounselor, setAssignedCounselor] = useState('Academic Advisory Board');

  // Initial Enrollment (for Add mode)
  const [initialCourseId, setInitialCourseId] = useState('');
  const [initialClassId, setInitialClassId] = useState('');

  // Parent / Guardian
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Father / Guardian');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load existing data when editing
  useEffect(() => {
    if (student) {
      setFullName(student.fullName);
      setFullNameAr(student.fullNameAr || '');
      setGender(student.gender || 'male');
      setDateOfBirth(student.dateOfBirth || '2001-01-15');
      setNationalIdOrPassport(student.nationalIdOrPassport || '');
      setNationality(student.nationality || defaultCountry);
      setAvatarUrl(student.avatarUrl || '');

      setEmail(student.email);
      setPhone(student.phone);
      setEmergencyPhone(student.emergencyPhone || '');
      setCity(student.address?.city || defaultCity);
      setDistrict(student.address?.district || 'Al-Olaya');
      setAddressLine(student.address?.addressLine || 'King Fahd Road');
      setCountry(student.address?.country || defaultCountry);

      setStudentType(student.studentType || 'regular');
      setCefrLevel(student.cefrLevel || 'B1');
      setTargetExam(student.targetExam || 'General English');
      setStatus(student.status || 'active');
      setAssignedTeacherId(student.assignedTeacherId || '');
      setAssignedCounselor(student.assignedCounselor || 'Academic Advisory Board');

      if (student.parentDetails) {
        setParentName(student.parentDetails.fullName || '');
        setParentEmail(student.parentDetails.email || '');
        setParentPhone(student.parentDetails.phone || '');
        setParentRelationship(student.parentDetails.relationship || 'Father / Guardian');
      } else {
        setParentName('');
        setParentEmail('');
        setParentPhone('');
      }
    } else {
      // Defaults for new student
      setFullName('');
      setFullNameAr('');
      setGender('male');
      setDateOfBirth('2002-05-10');
      setNationalIdOrPassport('');
      setNationality(defaultCountry);
      setAvatarUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

      setEmail('');
      setPhone('+966 50 ');
      setEmergencyPhone('');
      setCity(defaultCity);
      setDistrict('Al-Olaya');
      setAddressLine('King Fahd Road');
      setCountry(defaultCountry);

      setStudentType('regular');
      setCefrLevel('B1');
      setTargetExam('General English');
      setStatus('active');
      setAssignedTeacherId(teachers.length > 0 ? teachers[0].id : '');
      setAssignedCounselor('Academic Advisory Board');

      setInitialCourseId(courses.length > 0 ? courses[0].id : '');
      setInitialClassId('');

      setParentName('');
      setParentEmail('');
      setParentPhone('');
      setParentRelationship('Father / Guardian');
    }
    setError('');
  }, [student, isOpen, defaultCountry, defaultCity, teachers, courses]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Student full English name is required');
      setActiveSection('personal');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Valid student email address is required');
      setActiveSection('contact');
      return;
    }
    if (!phone.trim()) {
      setError('Contact phone number is required');
      setActiveSection('contact');
      return;
    }

    const assignedTeacher = teachers.find((t) => t.id === assignedTeacherId);

    const payload: Partial<StudentProfile> & { courseId?: string; classId?: string } = {
      fullName: fullName.trim(),
      fullNameAr: fullNameAr.trim() || undefined,
      gender,
      dateOfBirth,
      nationalIdOrPassport: nationalIdOrPassport.trim() || undefined,
      nationality: nationality.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      emergencyPhone: emergencyPhone.trim() || undefined,
      address: {
        city: city.trim(),
        district: district.trim(),
        addressLine: addressLine.trim(),
        country: country.trim(),
      },
      studentType,
      cefrLevel,
      targetExam,
      status,
      assignedTeacherId: assignedTeacher?.id,
      assignedTeacherName: assignedTeacher?.fullName,
      assignedCounselor: assignedCounselor.trim() || undefined,
      parentDetails: parentName.trim()
        ? {
            fullName: parentName.trim(),
            relationship: parentRelationship,
            email: parentEmail.trim() || undefined,
            phone: parentPhone.trim() || undefined,
          }
        : undefined,
    };

    if (!isEditing) {
      if (initialCourseId) {
        payload.courseId = initialCourseId;
        if (initialClassId) {
          payload.classId = initialClassId;
        }
      }
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving student information');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="student-form-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="student-form-modal"
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isEditing ? `Edit Student: ${student.fullName}` : 'Admit & Register New Student'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `ID: ${student.studentAdmissionNumber} • Tenant Isolated Record`
                  : 'Enroll student profile into academic registry with complete telemetry'}
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

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-6 shrink-0 overflow-x-auto">
          {[
            { id: 'personal', label: '1. Personal Info' },
            { id: 'contact', label: '2. Contact & Address' },
            { id: 'academic', label: '3. Academic & Programs' },
            { id: 'guardian', label: '4. Parent / Guardian' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as any)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                activeSection === sec.id
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SECTION 1: PERSONAL INFO */}
          {activeSection === 'personal' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-fullname-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Tariq Al-Mansoor"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name (Arabic)
                  </label>
                  <input
                    id="student-fullname-ar-input"
                    type="text"
                    dir="rtl"
                    value={fullNameAr}
                    onChange={(e) => setFullNameAr(e.target.value)}
                    placeholder="مثال: طارق المنصور"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="student-gender-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="student-dob-input"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    National ID / Passport #
                  </label>
                  <input
                    id="student-nid-input"
                    type="text"
                    value={nationalIdOrPassport}
                    onChange={(e) => setNationalIdOrPassport(e.target.value)}
                    placeholder="e.g. 1099887766"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nationality
                  </label>
                  <input
                    id="student-nationality-input"
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    id="student-avatar-input"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CONTACT & ADDRESS */}
          {activeSection === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+966 50 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Phone Contact
                </label>
                <input
                  id="student-emergency-phone-input"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+966 54 999 8888 (Relative / Sponsor)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    id="student-city-input"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District / Neighborhood
                  </label>
                  <input
                    id="student-district-input"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street / Address Line
                  </label>
                  <input
                    id="student-addressline-input"
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    id="student-country-input"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: ACADEMIC & PROGRAMS */}
          {activeSection === 'academic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current CEFR Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="student-cefr-select"
                    value={cefrLevel}
                    onChange={(e) => setCefrLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Mastery / Proficient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Exam / Program <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="student-targetexam-select"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="General English">General English</option>
                    <option value="IELTS">IELTS Academic / General</option>
                    <option value="TOEFL">TOEFL iBT</option>
                    <option value="Business English">Business & Corporate English</option>
                    <option value="Duolingo">Duolingo English Test (DET)</option>
                    <option value="SAT Verbal">SAT Verbal & Reading</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enrollment Status
                  </label>
                  <select
                    id="student-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Type / Track
                  </label>
                  <select
                    id="student-type-select"
                    value={studentType}
                    onChange={(e) => setStudentType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="regular">Regular Track (Semi-Intensive)</option>
                    <option value="intensive">Intensive Immersion Track</option>
                    <option value="private">Private VIP 1-on-1 Tutoring</option>
                    <option value="corporate">Corporate Sponsored Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Lead Teacher
                  </label>
                  <select
                    id="student-teacher-select"
                    value={assignedTeacherId}
                    onChange={(e) => setAssignedTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Initial Course Selection only shown on Add Student */}
              {!isEditing && (
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Initial Course & Class Enrollment (Optional)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Course to Enroll Immediately
                      </label>
                      <select
                        id="student-initial-course-select"
                        value={initialCourseId}
                        onChange={(e) => setInitialCourseId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                      >
                        <option value="">-- Do not enroll now (Admit only) --</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} ({c.level})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Batch Class Schedule
                      </label>
                      <select
                        id="student-initial-class-select"
                        value={initialClassId}
                        onChange={(e) => setInitialClassId(e.target.value)}
                        disabled={!initialCourseId}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 disabled:opacity-50"
                      >
                        <option value="">-- No specific batch --</option>
                        {classes
                          .filter((cl) => !initialCourseId || cl.courseId === initialCourseId)
                          .map((cl) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.name} ({cl.scheduleDay} {cl.scheduleTime})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: PARENT / GUARDIAN */}
          {activeSection === 'guardian' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-slate-500">
                Optional guardian information for notifications, academic progress reports, and tuition billing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parent / Guardian Full Name
                  </label>
                  <input
                    id="student-parentname-input"
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Dr. Mansoor Al-Harbi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relationship to Student
                  </label>
                  <select
                    id="student-parentrel-select"
                    value={parentRelationship}
                    onChange={(e) => setParentRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Father / Guardian">Father / Guardian</option>
                    <option value="Mother">Mother</option>
                    <option value="Older Sibling">Older Sibling</option>
                    <option value="Employer / Corporate Sponsor">Employer / Corporate Sponsor</option>
                    <option value="Self / Independent">Self / Independent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parent Email Address
                  </label>
                  <input
                    id="student-parentemail-input"
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parent Phone Number
                  </label>
                  <input
                    id="student-parentphone-input"
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+966 50 888 7777"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              {activeSection !== 'personal' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeSection === 'contact') setActiveSection('personal');
                    else if (activeSection === 'academic') setActiveSection('contact');
                    else if (activeSection === 'guardian') setActiveSection('academic');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Previous Step
                </button>
              )}
              {activeSection !== 'guardian' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeSection === 'personal') setActiveSection('contact');
                    else if (activeSection === 'contact') setActiveSection('academic');
                    else if (activeSection === 'academic') setActiveSection('guardian');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
                >
                  Next Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                id="submit-student-form-btn"
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition flex items-center gap-2"
              >
                {submitting ? (
                  <>Saving Record...</>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {isEditing ? 'Save Changes' : 'Admit Student'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
