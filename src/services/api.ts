import {
  Organization,
  User,
  Course,
  CourseModule,
  CourseLesson,
  LessonMaterial,
  StudentCourseProgress,
  CourseStatus,
  BatchClass,
  AttendanceRecord,
  Assignment,
  QuizExam,
  Certificate,
  AuditLog,
  DashboardStats,
  UserRole,
  UserListResponse,
  StudentProfile,
  StudentListResponse,
  StudentListStats,
  StudentStatus,
  StudentPayment,
  StudentNote,
  StudentExamResult,
  TeacherProfile,
  TeacherAvailabilityDay,
  TeacherListResponse,
  TeacherDashboardData,
  TeacherMessage,
} from '../types';

class ApiService {
  private tenantId: string = 'org_oxford';
  private userId: string = 'usr_oxf_owner';

  public setTenantId(id: string) {
    this.tenantId = id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public setUserId(id: string) {
    this.userId = id;
  }

  public getUserId(): string {
    return this.userId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-tenant-id': this.tenantId,
      'x-user-id': this.userId,
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.error) errorMessage = errorJson.error;
      } catch {
        // use default message
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  // Auth & Session
  async getSession() {
    return this.request<{
      user: User | null;
      tenant: Organization | null;
      availableTenants: Partial<Organization>[];
    }>('/api/auth/me');
  }

  async switchDemoRole(role: UserRole, targetTenantId?: string) {
    return this.request<{
      success: boolean;
      user: User;
      tenant: Organization | null;
      activeRole: UserRole;
    }>('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ role, tenantId: targetTenantId || this.tenantId }),
    });
  }

  async registerTenant(data: {
    academyName: string;
    academyNameAr?: string;
    adminEmail: string;
    adminName: string;
    plan?: string;
    country?: string;
    phone?: string;
  }) {
    return this.request<{
      success: boolean;
      organization: Organization;
      owner: User;
      message: string;
    }>('/api/auth/register-tenant', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.request<DashboardStats>('/api/dashboard/stats');
  }

  // Courses & LMS Engine
  async getCourses(filters?: {
    search?: string;
    level?: string;
    category?: string;
    status?: string;
    pricingType?: string;
    teacherId?: string;
  }) {
    const query = new URLSearchParams();
    if (filters?.search) query.set('search', filters.search);
    if (filters?.level && filters.level !== 'all') query.set('level', filters.level);
    if (filters?.category && filters.category !== 'all') query.set('category', filters.category);
    if (filters?.status && filters.status !== 'all') query.set('status', filters.status);
    if (filters?.pricingType && filters.pricingType !== 'all') query.set('pricingType', filters.pricingType);
    if (filters?.teacherId && filters.teacherId !== 'all') query.set('teacherId', filters.teacherId);
    const qs = query.toString();
    return this.request<Course[]>(`/api/courses${qs ? `?${qs}` : ''}`);
  }

  async getCourseById(courseId: string) {
    return this.request<Course>(`/api/courses/${encodeURIComponent(courseId)}`);
  }

  async createCourse(data: Partial<Course>) {
    return this.request<Course>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(courseId: string, data: Partial<Course>) {
    return this.request<Course>(`/api/courses/${encodeURIComponent(courseId)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateCourseStatus(courseId: string, status: CourseStatus) {
    return this.request<Course>(`/api/courses/${encodeURIComponent(courseId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteCourse(courseId: string) {
    return this.request<{ success: boolean; message: string }>(
      `/api/courses/${encodeURIComponent(courseId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Module Methods
  async createModule(courseId: string, data: { title: string; titleAr?: string; description?: string; order?: number }) {
    return this.request<CourseModule>(`/api/courses/${encodeURIComponent(courseId)}/modules`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateModule(courseId: string, moduleId: string, data: Partial<CourseModule>) {
    return this.request<CourseModule>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteModule(courseId: string, moduleId: string) {
    return this.request<{ success: boolean }>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  async reorderModules(courseId: string, moduleIds: string[]) {
    return this.request<Course>(`/api/courses/${encodeURIComponent(courseId)}/modules/reorder`, {
      method: 'POST',
      body: JSON.stringify({ moduleIds }),
    });
  }

  // Lesson Methods
  async createLesson(
    courseId: string,
    moduleId: string,
    data: {
      title: string;
      titleAr?: string;
      description?: string;
      durationMinutes?: number;
      isFreePreview?: boolean;
      order?: number;
    }
  ) {
    return this.request<CourseLesson>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/lessons`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async updateLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
    data: Partial<CourseLesson>
  ) {
    return this.request<CourseLesson>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/lessons/${encodeURIComponent(lessonId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteLesson(courseId: string, moduleId: string, lessonId: string) {
    return this.request<{ success: boolean }>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/lessons/${encodeURIComponent(lessonId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  async reorderLessons(courseId: string, moduleId: string, lessonIds: string[]) {
    return this.request<CourseModule>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/lessons/reorder`,
      {
        method: 'POST',
        body: JSON.stringify({ lessonIds }),
      }
    );
  }

  // Material Methods
  async createMaterial(
    courseId: string,
    moduleId: string,
    lessonId: string,
    data: Partial<LessonMaterial>
  ) {
    return this.request<LessonMaterial>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/lessons/${encodeURIComponent(lessonId)}/materials`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async updateMaterial(
    courseId: string,
    moduleId: string,
    lessonId: string,
    materialId: string,
    data: Partial<LessonMaterial>
  ) {
    return this.request<LessonMaterial>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/lessons/${encodeURIComponent(lessonId)}/materials/${encodeURIComponent(materialId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteMaterial(
    courseId: string,
    moduleId: string,
    lessonId: string,
    materialId: string
  ) {
    return this.request<{ success: boolean }>(
      `/api/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/lessons/${encodeURIComponent(lessonId)}/materials/${encodeURIComponent(materialId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Student Progress & Learning Interface
  async getCourseProgress(courseId: string, studentId?: string) {
    const qs = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
    return this.request<StudentCourseProgress>(
      `/api/courses/${encodeURIComponent(courseId)}/progress${qs}`
    );
  }

  async updateLessonProgress(
    courseId: string,
    lessonId: string,
    completed: boolean,
    timeSpentSeconds?: number,
    studentId?: string
  ) {
    return this.request<StudentCourseProgress>(
      `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/progress`,
      {
        method: 'POST',
        body: JSON.stringify({ completed, timeSpentSeconds, studentId }),
      }
    );
  }

  async submitQuizProgress(
    courseId: string,
    lessonId: string,
    materialId: string,
    answers: Record<string, number>,
    score: number,
    passed: boolean,
    studentId?: string
  ) {
    return this.request<StudentCourseProgress>(
      `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/quizzes/${encodeURIComponent(materialId)}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({ answers, score, passed, studentId }),
      }
    );
  }

  async submitAssignment(
    courseId: string,
    lessonId: string,
    materialId: string,
    textSubmission: string,
    fileUrl?: string,
    studentId?: string
  ) {
    return this.request<StudentCourseProgress>(
      `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/assignments/${encodeURIComponent(materialId)}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({ textSubmission, fileUrl, studentId }),
      }
    );
  }

  // Students & Teachers
  async getStudents() {
    return this.request<User[]>('/api/students?format=flat');
  }

  async getPagedStudents(
    params: {
      search?: string;
      level?: string;
      status?: string;
      courseId?: string;
      paymentStatus?: string;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.level) query.set('level', params.level);
    if (params.status) query.set('status', params.status);
    if (params.courseId) query.set('courseId', params.courseId);
    if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    return this.request<StudentListResponse>(`/api/students${qs ? `?${qs}` : ''}`);
  }

  async getStudentStats() {
    return this.request<StudentListStats>('/api/students/stats');
  }

  async getStudentById(studentId: string) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}`);
  }

  async createStudentProfile(data: Partial<StudentProfile> & { courseId?: string; classId?: string }) {
    return this.request<StudentProfile>('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudentProfile(studentId: string, updates: Partial<StudentProfile>) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async setStudentStatus(studentId: string, status: StudentStatus) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteStudentProfile(studentId: string) {
    return this.request<{ success: boolean; message: string }>(
      `/api/students/${encodeURIComponent(studentId)}`,
      { method: 'DELETE' }
    );
  }

  async enrollStudentInCourse(studentId: string, courseId: string, classId?: string) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ courseId, classId }),
    });
  }

  async withdrawStudentFromCourse(studentId: string, courseId: string, classId?: string, reason?: string) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ courseId, classId, reason }),
    });
  }

  async addStudentPayment(studentId: string, payment: Partial<StudentPayment>) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}/payments`, {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async addStudentNote(studentId: string, note: { content: string; category?: StudentNote['category'] }) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async addStudentExam(studentId: string, exam: Partial<StudentExamResult>) {
    return this.request<StudentProfile>(`/api/students/${encodeURIComponent(studentId)}/exams`, {
      method: 'POST',
      body: JSON.stringify(exam),
    });
  }

  async createStudent(data: Partial<User> & { studentDetails?: any }) {
    return this.request<User>('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Classes & Schedules
  async getClasses() {
    return this.request<BatchClass[]>('/api/classes');
  }

  async createClass(data: Partial<BatchClass>) {
    return this.request<BatchClass>('/api/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Attendance
  async getAttendance(classId?: string) {
    const query = classId ? `?classId=${encodeURIComponent(classId)}` : '';
    return this.request<AttendanceRecord[]>(`/api/attendance${query}`);
  }

  async saveAttendance(data: Partial<AttendanceRecord>) {
    return this.request<AttendanceRecord>('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Assignments
  async getAssignments() {
    return this.request<Assignment[]>('/api/assignments');
  }

  async createAssignment(data: Partial<Assignment>) {
    return this.request<Assignment>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async gradeAssignment(assignmentId: string, studentId: string, score: number, feedback: string) {
    return this.request<Assignment>(`/api/assignments/${assignmentId}/grade`, {
      method: 'POST',
      body: JSON.stringify({ studentId, score, feedback }),
    });
  }

  // Quizzes
  async getQuizzes() {
    return this.request<QuizExam[]>('/api/quizzes');
  }

  async createQuiz(data: Partial<QuizExam>) {
    return this.request<QuizExam>('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Certificates
  async getCertificates() {
    return this.request<Certificate[]>('/api/certificates');
  }

  async issueCertificate(data: Partial<Certificate>) {
    return this.request<Certificate>('/api/certificates/issue', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyCertificate(code: string) {
    return this.request<{
      valid: boolean;
      certificate?: Certificate;
      message?: string;
      verifiedAt?: string;
      securitySeal?: string;
    }>(`/api/certificates/verify/${encodeURIComponent(code)}`);
  }

  // Organizations
  async getOrganizations() {
    return this.request<Organization[]>('/api/organizations');
  }

  async getCurrentOrganization() {
    return this.request<Organization>('/api/organization/current');
  }

  async updateOrganizationSettings(settings: Partial<Organization>) {
    return this.request<Organization>('/api/organization/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  // Users Management
  async getPagedUsers(
    params: {
      search?: string;
      role?: string;
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.role) query.set('role', params.role);
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    return this.request<UserListResponse>(`/api/users${qs ? `?${qs}` : ''}`);
  }

  async createUser(data: Partial<User> & { fullName: string; email: string; role: UserRole }) {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, updates: Partial<User>) {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async setUserStatus(id: string, status: 'active' | 'inactive' | 'suspended') {
    return this.request<User>(`/api/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async setUserRole(id: string, role: UserRole) {
    return this.request<User>(`/api/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Customer Demonstration Data Controls
  async seedDemoData() {
    return this.request<{ success: boolean; message: string; stats: DashboardStats }>('/api/demo/seed', {
      method: 'POST',
    });
  }

  async resetOrganizationData() {
    return this.request<{ success: boolean; message: string; stats: DashboardStats }>('/api/demo/reset', {
      method: 'POST',
    });
  }

  // Audit Logs
  async getAuditLogs() {
    return this.request<AuditLog[]>('/api/audit-logs');
  }

  // AI Educational Tools (Server-Side Gemini)
  async generateLessonPlan(params: {
    level: string;
    topic: string;
    durationMinutes: number;
    focusArea: string;
    targetAge?: string;
  }) {
    return this.request<{ success: boolean; plan: string }>('/api/ai/lesson-plan', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async evaluateFluency(params: { studentText: string; examType: string; targetBand?: string }) {
    return this.request<{ success: boolean; evaluation: any }>('/api/ai/fluency-evaluator', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async loginWithEmail(email: string) {
    return this.request<{
      token: string;
      user: User;
      tenant: Organization | null;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async submitContactInquiry(data: {
    fullName: string;
    email: string;
    phone?: string;
    institutionName?: string;
    institutionType?: string;
    interestedIn?: string;
    message?: string;
  }) {
    return this.request<{
      success: boolean;
      ticketId: string;
      receivedAt: string;
      message: string;
    }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateQuiz(params: { topic: string; level: string; count: number }) {
    return this.request<{ success: boolean; questions: any[] }>('/api/ai/quiz-generator', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Teacher Management & Workflows
  async getTeachers(params?: {
    search?: string;
    status?: string;
    specialization?: string;
    page?: number;
    limit?: number;
    format?: string;
    all?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.specialization && params.specialization !== 'all')
      query.append('specialization', params.specialization);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.format) query.append('format', params.format);
    if (params?.all) query.append('all', 'true');

    const qs = query.toString() ? `?${query.toString()}` : '';
    if (params?.format === 'flat' || params?.all) {
      return this.request<TeacherProfile[]>(`/api/teachers${qs}`);
    }
    return this.request<TeacherListResponse>(`/api/teachers${qs}`);
  }

  async getTeacherById(id: string) {
    return this.request<TeacherProfile>(`/api/teachers/${id}`);
  }

  async createTeacher(data: Partial<TeacherProfile>) {
    return this.request<TeacherProfile>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeacher(id: string, updates: Partial<TeacherProfile>) {
    return this.request<TeacherProfile>(`/api/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTeacher(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTeacherAvailability(id: string, availability: TeacherAvailabilityDay[]) {
    return this.request<TeacherProfile>(`/api/teachers/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }

  async getTeacherDashboard(id: string) {
    return this.request<TeacherDashboardData>(`/api/teachers/${id}/dashboard`);
  }

  async recordTeacherAttendance(
    id: string,
    payload: {
      classId: string;
      date?: string;
      entries: { studentId: string; studentName: string; status: 'present' | 'absent' | 'late' | 'excused'; remarks?: string }[];
    }
  ) {
    return this.request<AttendanceRecord>(`/api/teachers/${id}/attendance`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createTeacherHomework(
    id: string,
    payload: {
      courseId: string;
      courseTitle?: string;
      title: string;
      description: string;
      dueDate: string;
      maxScore?: number;
    }
  ) {
    return this.request<Assignment>(`/api/teachers/${id}/homework`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createTeacherQuiz(
    id: string,
    payload: {
      courseId: string;
      courseTitle?: string;
      title: string;
      type?: 'quiz' | 'exam' | 'practice';
      durationMinutes?: number;
      passingScore?: number;
      questions?: any[];
    }
  ) {
    return this.request<QuizExam>(`/api/teachers/${id}/quizzes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async recordTeacherExamResult(
    id: string,
    payload: {
      studentId: string;
      examTitle: string;
      examType?: string;
      date?: string;
      score: number;
      maxScore?: number;
      bandScore?: string;
      passed?: boolean;
      skills?: { listening?: number; reading?: number; writing?: number; speaking?: number };
      examinerFeedback?: string;
    }
  ) {
    return this.request<any>(`/api/teachers/${id}/results`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async sendTeacherMessage(
    id: string,
    payload: {
      recipientType: 'class' | 'student' | 'all_students';
      recipientId?: string;
      recipientName: string;
      subject: string;
      content: string;
      priority?: 'normal' | 'high' | 'urgent';
    }
  ) {
    return this.request<TeacherMessage>(`/api/teachers/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getTeacherMessages(id: string) {
    return this.request<TeacherMessage[]>(`/api/teachers/${id}/messages`);
  }
}

export const api = new ApiService();
