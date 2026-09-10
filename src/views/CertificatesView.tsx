import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Certificate, User, Course } from '../types';
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Printer,
  QrCode,
} from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { currentTenant, currentUser, showToast, hasRole } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [grade, setGrade] = useState<'Distinction' | 'Merit' | 'Pass' | 'Completed'>('Distinction');
  const [directorName, setDirectorName] = useState('Dr. Tariq Al-Ghamdi');

  const loadData = async () => {
    try {
      setLoading(true);
      const [certList, studentList, courseList] = await Promise.all([
        api.getCertificates(),
        api.getStudents(),
        api.getCourses(),
      ]);
      setCertificates(certList);
      setStudents(studentList);
      setCourses(courseList);

      if (studentList.length > 0) setSelectedStudentId(studentList[0].id);
      if (courseList.length > 0) setSelectedCourseId(courseList[0].id);
      if (certList.length > 0) setPreviewCert(certList[0]);
    } catch (err: any) {
      showToast(err.message || 'Failed to load certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant?.id]);

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    const course = courses.find((c) => c.id === selectedCourseId);

    if (!student || !course) {
      showToast('Please select valid student and course', 'error');
      return;
    }

    try {
      const cert = await api.issueCertificate({
        studentId: student.id,
        studentName: student.fullName,
        courseId: course.id,
        courseTitle: course.title,
        grade,
        instructorName: currentUser?.fullName || 'Senior Instructor',
        directorName,
      });

      setCertificates((prev) => [cert, ...prev]);
      setPreviewCert(cert);
      setShowModal(false);
      showToast(`Certificate ${cert.verificationCode} issued to ${cert.studentName}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to issue certificate', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">
              Digital Certificates & Credentials Registry
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Issue and verify authentic language certifications for{' '}
            <strong className="text-slate-700">{currentTenant?.name}</strong>.
          </p>
        </div>

        {hasRole(['ORGANIZATION_OWNER', 'ADMIN', 'TEACHER']) && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </button>
        )}
      </div>

      {/* Grid: Certificate Table & Diploma Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Issued Certificates Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Issued Institutional Credentials ({certificates.length})
          </h3>

          {loading ? (
            <p className="text-xs text-slate-400">Loading certificates...</p>
          ) : certificates.length === 0 ? (
            <p className="text-xs text-slate-400">No certificates issued yet for this tenant.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">Student Name</th>
                    <th className="pb-2 font-medium">Course Title</th>
                    <th className="pb-2 font-medium">Grade</th>
                    <th className="pb-2 font-medium">Verification ID</th>
                    <th className="pb-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-800">{cert.studentName}</td>
                      <td className="py-3 text-slate-600 max-w-xs truncate">{cert.courseTitle}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-700">
                          {cert.grade}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-indigo-600">
                        {cert.verificationCode}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setPreviewCert(cert)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View Diploma
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Live Certificate Diploma Preview */}
        <div className="space-y-4">
          {previewCert ? (
            <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
              <div className="text-center space-y-2 border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                  MR. FLUENCY • ACADEMIC CREST
                </span>
                <h4 className="text-base font-extrabold text-white">
                  CERTIFICATE OF ACHIEVEMENT
                </h4>
                <p className="text-[10px] text-slate-300 font-serif">
                  {previewCert.organizationName}
                </p>
              </div>

              <div className="py-6 text-center space-y-2">
                <span className="text-[10px] text-slate-400 uppercase">This is awarded to</span>
                <h5 className="text-lg font-black text-amber-200">{previewCert.studentName}</h5>
                <p className="text-xs text-slate-300">for successful completion of</p>
                <strong className="text-xs text-white block px-4">{previewCert.courseTitle}</strong>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                  Rating: {previewCert.grade}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-slate-400">
                <div>
                  <span className="block text-slate-300 font-semibold">
                    {previewCert.directorName}
                  </span>
                  <span>Academic Director</span>
                </div>
                <div className="text-right font-mono">
                  <span className="block text-amber-300">{previewCert.verificationCode}</span>
                  <span>Date: {previewCert.issueDate}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-1 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by MR. FLUENCY SaaS Digital Registry</span>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              Select a certificate from the table to preview the credential.
            </div>
          )}
        </div>
      </div>

      {/* Issue Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Issue Digital Credential</h2>
            <p className="text-xs text-slate-500 mb-4">
              Generate a permanent verifiable certificate for student completion.
            </p>

            <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Student *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentDetails?.level || 'B2'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Course *</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grade Awarded</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Distinction">Distinction (90%+)</option>
                    <option value="Merit">Merit (80-89%)</option>
                    <option value="Pass">Pass (70-79%)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Director Name</label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Issue & Sign Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
