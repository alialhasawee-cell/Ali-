export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ORGANIZATION_OWNER'
  | 'ADMIN'
  | 'MANAGER'
  | 'TEACHER'
  | 'STAFF'
  | 'STUDENT'
  | 'PARENT';

export type SubscriptionPlan = 'starter' | 'growth' | 'pro' | 'enterprise';

export interface OrganizationAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrganizationSocialLinks {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
}

export interface OrganizationBranding {
  brandColor: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  faviconUrl?: string;
  headerStyle?: 'light' | 'dark' | 'brand';
}

export interface OrganizationAcademicSettings {
  gradingScale: 'percentage' | 'letter' | 'cefr';
  minAttendanceRate: number;
  minQuizPassingScore: number;
  defaultClassDuration: number;
  academicTerm: string;
  enableAiFluencyEvaluator: boolean;
}

export interface OrganizationCertificateSettings {
  certificateTitle: string;
  signatoryName: string;
  signatoryTitle: string;
  secondarySignatoryName?: string;
  secondarySignatoryTitle?: string;
  enableQrVerification: boolean;
  verificationCodePrefix: string;
  sealText?: string;
}

export interface Organization {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  logoUrl?: string;
  plan: SubscriptionPlan;
  planStatus: 'active' | 'trial' | 'past_due' | 'canceled';
  studentLimit: number;
  teacherLimit: number;
  aiCreditsLimit: number;
  aiCreditsUsed: number;
  contactEmail: string;
  phone?: string;
  emergencyPhone?: string;
  websiteUrl?: string;
  customDomain?: string;
  country: string;
  timezone: string;
  currency: string;
  brandColor?: string;
  address?: OrganizationAddress;
  socialLinks?: OrganizationSocialLinks;
  branding?: OrganizationBranding;
  academicSettings?: OrganizationAcademicSettings;
  certificateSettings?: OrganizationCertificateSettings;
  createdAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  fullName: string;
  fullNameAr?: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
  studentDetails?: {
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    parentEmail?: string;
    parentPhone?: string;
    targetExam?: 'IELTS' | 'TOEFL' | 'General English' | 'Business English' | 'Duolingo' | 'SAT Verbal' | string;
  };
  teacherDetails?: {
    specialization: string;
    bio?: string;
    hourlyRate?: number;
  };
}

export type CourseStatus = 'draft' | 'published' | 'archived';
export type CoursePricingType = 'free' | 'paid';
export type EnrollmentRuleType = 'open' | 'invite_only' | 'approval_required' | 'prerequisite';

export interface CoursePricing {
  type: CoursePricingType;
  amount: number;
  currency: string;
  discountAmount?: number;
}

export interface CourseEnrollmentRules {
  type: EnrollmentRuleType;
  prerequisiteCourseId?: string;
  prerequisiteCourseTitle?: string;
  maxStudents?: number;
  requiresPlacementTest?: boolean;
  minimumPlacementLevel?: string;
}

// Hierarchy: COURSE -> MODULE -> LESSON -> MATERIAL

export type MaterialType =
  | 'text'
  | 'video'
  | 'pdf'
  | 'audio'
  | 'image'
  | 'external_resource'
  | 'quiz'
  | 'assignment';

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

// File Storage & Educational Content Security Types
export type FileCategory = 'pdf' | 'image' | 'audio' | 'video' | 'document' | 'other';
export type FileEntityType = 'course_material' | 'course_file' | 'lesson_resource' | 'assignment_submission' | 'general';
export type FileVisibility = 'public' | 'tenant' | 'enrolled_students' | 'instructors_only';

export interface FileAccessControl {
  visibility: FileVisibility;
  allowedRoles?: UserRole[];
  requiresEnrollment?: boolean;
}

export interface VideoChapter {
  timeSeconds: number;
  title: string;
  titleAr?: string;
  description?: string;
}

export interface MediaMetadata {
  durationSeconds?: number;
  resolution?: string; // e.g. "1080p Full HD", "4K", "720p"
  bitrateKbps?: number;
  width?: number;
  height?: number;
  totalPages?: number; // for PDF
  speakerName?: string; // for Audio
  accent?: string; // for Audio
  waveformPreviewUrl?: string; // for Audio
  chapters?: VideoChapter[];
  subtitlesUrl?: string;
}

export interface StreamingConfig {
  isStreamReady: boolean;
  streamProvider: 'native_http_range' | 'cloudflare_stream' | 'mux' | 'aws_cloudfront' | 'bunny_stream';
  streamUrl: string; // URL for playback or stream endpoint
  hlsManifestUrl?: string; // m3u8 playlist
  dashManifestUrl?: string; // mpd manifest
  cdnUrl?: string; // CDN distribution endpoint
  playbackResolutions?: ('360p' | '720p' | '1080p' | 'auto')[];
  bandwidthRequirementsKbps?: number;
}

export interface StoredFileMetadata {
  id: string;
  organizationId: string;
  originalFileName: string;
  storedFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  fileExtension: string;
  category: FileCategory;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: UserRole;
  entityType: FileEntityType;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  materialId?: string;
  accessControl: FileAccessControl;
  mediaMetadata?: MediaMetadata;
  streamingConfig?: StreamingConfig;
  downloadCount: number;
  sha256Hash?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoProgressRecord {
  lessonId: string;
  courseId: string;
  studentId: string;
  durationSeconds: number;
  currentTimeSeconds: number;
  watchedPercentage: number;
  completed: boolean;
  highestWatchedSeconds: number;
  lastWatchedAt: string;
}

export interface LessonMaterial {
  id: string;
  lessonId?: string;
  title: string;
  titleAr?: string;
  type: MaterialType;
  order: number;
  description?: string;
  fileId?: string;
  fileMetadata?: StoredFileMetadata;
  // Content payloads depending on type
  textContent?: {
    body: string;
    estimatedReadMinutes?: number;
    keyVocabulary?: { term: string; definition: string; example?: string }[];
  };
  videoContent?: {
    videoUrl: string;
    provider?: 'direct' | 'youtube' | 'vimeo' | 'stream_cdn';
    durationSeconds?: number;
    transcript?: string;
    thumbnailUrl?: string;
    resolution?: string;
    fileId?: string;
    chapters?: VideoChapter[];
    streamingConfig?: StreamingConfig;
  };
  pdfContent?: {
    fileUrl: string;
    fileName: string;
    fileSize?: string;
    fileSizeBytes?: number;
    totalPages?: number;
    allowDownload?: boolean;
    description?: string;
    fileId?: string;
  };
  audioContent?: {
    audioUrl: string;
    durationSeconds?: number;
    accent?: string;
    transcript?: string;
    speakerName?: string;
    fileId?: string;
  };
  imageContent?: {
    imageUrl: string;
    caption?: string;
    altText?: string;
    fileId?: string;
  };
  externalContent?: {
    url: string;
    title: string;
    description?: string;
    openInNewTab?: boolean;
  };
  quizContent?: {
    quizId?: string;
    title: string;
    description?: string;
    passingScore: number;
    questions: QuizQuestionItem[];
  };
  assignmentContent?: {
    assignmentId?: string;
    prompt: string;
    instructions?: string;
    maxScore: number;
    dueDate?: string;
    rubric?: string;
  };
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  titleAr?: string;
  description?: string;
  order: number;
  durationMinutes: number;
  isFreePreview?: boolean;
  materials: LessonMaterial[];
  resources?: StoredFileMetadata[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  titleAr?: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  organizationId: string;
  title: string;
  titleAr?: string;
  code: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'All Levels';
  category: 'General English' | 'IELTS Prep' | 'Business English' | 'Kids & Teens' | 'Grammar & Writing' | 'Speaking & Pronunciation' | 'TOEFL Prep' | string;
  durationWeeks: number;
  totalHours: number;
  duration?: string;
  teacherId?: string;
  teacherName?: string;
  teacherAvatar?: string;
  thumbnail: string;
  status: CourseStatus;
  pricing: CoursePricing;
  enrollmentRules: CourseEnrollmentRules;
  modules: CourseModule[];
  courseFiles?: StoredFileMetadata[];
  // Backwards compatibility
  price: number;
  syllabus?: {
    week: number;
    title: string;
    topics: string[];
  }[];
  enrolledStudentsCount: number;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// Student Learning Progress Tracking
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  timeSpentSeconds: number;
}

export interface QuizProgress {
  quizMaterialId: string;
  score: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt: string;
  answers: Record<string, number>;
}

export interface AssignmentProgress {
  assignmentMaterialId: string;
  submitted: boolean;
  submittedAt?: string;
  textSubmission?: string;
  fileUrl?: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface StudentCourseProgress {
  id: string;
  studentId: string;
  courseId: string;
  organizationId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  timeSpentMinutes: number;
  startedAt: string;
  lastAccessedAt: string;
  lastAccessedLessonId?: string;
  completedAt?: string;
  lessonProgress: Record<string, LessonProgress>;
  quizProgress: Record<string, QuizProgress>;
  assignmentProgress: Record<string, AssignmentProgress>;
  videoProgress?: Record<string, VideoProgressRecord>;
}

export interface BatchClass {
  id: string;
  organizationId: string;
  courseId: string;
  courseTitle: string;
  name: string;
  teacherId: string;
  teacherName: string;
  scheduleDay: string;
  scheduleTime: string;
  roomOrMeetingLink: string;
  studentIds: string[];
  maxCapacity: number;
  status: 'upcoming' | 'in_progress' | 'completed';
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  organizationId: string;
  classId: string;
  className: string;
  date: string;
  entries: {
    studentId: string;
    studentName: string;
    status: AttendanceStatus;
    notes?: string;
  }[];
  takenByTeacherId: string;
  takenAt: string;
}

export interface Assignment {
  id: string;
  organizationId: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionsCount: number;
  submissions: {
    studentId: string;
    studentName: string;
    submittedAt: string;
    fileUrl?: string;
    textSubmission?: string;
    score?: number;
    teacherFeedback?: string;
    status: 'submitted' | 'graded' | 'late';
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizExam {
  id: string;
  organizationId: string;
  courseId: string;
  courseTitle: string;
  title: string;
  type: 'quiz' | 'exam';
  durationMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
  published: boolean;
  attemptsCount: number;
}

export interface Certificate {
  id: string;
  organizationId: string;
  organizationName: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  verificationCode: string;
  grade: 'Distinction' | 'Merit' | 'Pass' | 'Completed';
  issueDate: string;
  instructorName: string;
  directorName: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface OrganizationNotification {
  id: string;
  type: 'attendance' | 'grading' | 'exam' | 'certificate' | 'system' | 'enrollment';
  title: string;
  titleAr?: string;
  message: string;
  messageAr?: string;
  severity: 'info' | 'warning' | 'success' | 'urgent';
  timestamp: string;
  read: boolean;
  actionTab?: string;
}

export interface DashboardStats {
  organization: Organization;
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  activeCourses: number;
  activeBatches: number;
  // Attendance metrics
  attendanceRate: number;
  totalSessionsHeld: number;
  attendanceBreakdown: {
    present: number;
    late: number;
    absent: number;
    excused: number;
  };
  // Homework & Assignments
  totalHomework: number;
  totalSubmissions: number;
  pendingGradingCount: number;
  // Exams & Quizzes
  totalExams: number;
  totalExamAttempts: number;
  averageExamScore: number;
  // Certificates
  totalCertificatesIssued: number;
  // Revenue
  estimatedRevenue: number;
  monthlyRevenueTrend: { month: string; revenue: number; enrollments: number }[];
  // Real database dynamic chart series
  cefrDistribution: { level: string; count: number }[];
  courseEnrollmentBreakdown: { name: string; students: number; revenue: number }[];
  attendanceTrend: { date: string; rate: number }[];
  // Lists
  recentActivity: AuditLog[];
  upcomingClasses: BatchClass[];
  notifications: OrganizationNotification[];
  aiCreditsUsed: number;
  aiCreditsLimit: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface StudentEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  classId?: string;
  className?: string;
  enrolledAt: string;
  status: 'in_progress' | 'completed' | 'dropped';
  grade?: string;
  attendanceRate?: number;
}

export interface StudentPayment {
  id: string;
  studentId: string;
  title: string;
  amount: number;
  currency: string;
  status: 'paid' | 'partial' | 'unpaid';
  method: string;
  date: string;
  invoiceNumber: string;
  notes?: string;
}

export interface StudentExamResult {
  id: string;
  studentId: string;
  examTitle: string;
  examType: string;
  date: string;
  score: number;
  maxScore: number;
  bandScore?: string;
  passed: boolean;
  skills?: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
  };
  examinerFeedback?: string;
}

export interface StudentNote {
  id: string;
  studentId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  category: 'academic' | 'behavioral' | 'attendance' | 'financial' | 'general';
  content: string;
  createdAt: string;
}

export interface StudentActivity {
  id: string;
  studentId: string;
  type: 'enrollment' | 'attendance' | 'exam' | 'certificate' | 'payment' | 'status_change' | 'note' | 'profile_update';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
}

export interface StudentFluencyProgress {
  overallScore: number;
  cefrLevel: CEFRLevel;
  pronunciationScore: number;
  grammarAccuracyScore: number;
  vocabularyRangeScore: number;
  coherenceScore: number;
  wordsPerMinute: number;
  streakDays: number;
  hoursCompleted: number;
  trajectory: { date: string; level: string; score: number }[];
}

export interface StudentProfile {
  id: string;
  organizationId: string;
  studentAdmissionNumber: string;
  fullName: string;
  fullNameAr?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  nationalIdOrPassport?: string;
  nationality?: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  emergencyPhone?: string;
  address?: {
    city?: string;
    district?: string;
    addressLine?: string;
    country?: string;
  };
  parentDetails?: {
    fullName: string;
    fullNameAr?: string;
    relationship: 'Father' | 'Mother' | 'Guardian' | 'Sponsor' | 'Self';
    phone: string;
    email?: string;
  };
  status: StudentStatus;
  enrollmentDate: string;
  studentType: 'regular' | 'executive' | 'scholarship' | 'private_tutoring';
  cefrLevel: CEFRLevel;
  targetExam: 'IELTS' | 'TOEFL' | 'General English' | 'Business English' | 'Duolingo' | 'SAT Verbal' | 'Cambridge Exams' | 'Other';
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  assignedCounselor?: string;
  courses: StudentEnrollment[];
  classes: BatchClass[];
  attendanceStats: {
    totalSessions: number;
    present: number;
    late: number;
    absent: number;
    excused: number;
    ratePercentage: number;
  };
  attendanceRecords: {
    id: string;
    classId: string;
    className: string;
    date: string;
    status: AttendanceStatus;
    notes?: string;
    teacherName: string;
  }[];
  homework: {
    id: string;
    title: string;
    courseTitle: string;
    dueDate: string;
    status: 'submitted' | 'graded' | 'pending' | 'late';
    score?: number;
    maxScore: number;
    feedback?: string;
  }[];
  quizResults: {
    id: string;
    title: string;
    courseTitle: string;
    date: string;
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
  }[];
  examResults: StudentExamResult[];
  fluencyProgress: StudentFluencyProgress;
  certificates: Certificate[];
  payments: StudentPayment[];
  notes: StudentNote[];
  activityHistory: StudentActivity[];
}

export interface StudentListStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  graduatedStudents: number;
  suspendedStudents: number;
  avgAttendanceRate: number;
  avgFluencyScore: number;
  tuitionStats: {
    totalBilled: number;
    totalCollected: number;
    totalOutstanding: number;
    currency: string;
  };
  cefrBreakdown: { level: string; count: number }[];
  examBreakdown: { exam: string; count: number }[];
}

export interface StudentListResponse {
  students: StudentProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: StudentListStats;
}

export interface TeacherAvailabilityDay {
  dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes?: string;
}

export interface TeacherPerformanceMetrics {
  rating: number;
  totalReviews: number;
  classesConducted: number;
  totalStudentsTaught: number;
  averageStudentScore: number;
  attendanceCompletionRate: number;
  onTimeGradingRate: number;
  studentPassRate: number;
}

export interface TeacherActivity {
  id: string;
  teacherId: string;
  type: 'attendance' | 'homework' | 'quiz' | 'grading' | 'communication' | 'class_started' | 'profile_updated';
  title: string;
  description: string;
  timestamp: string;
  relatedEntityId?: string;
}

export interface TeacherMessage {
  id: string;
  organizationId: string;
  teacherId: string;
  teacherName: string;
  recipientType: 'class' | 'student' | 'all_students';
  recipientId?: string;
  recipientName: string;
  subject: string;
  content: string;
  sentAt: string;
  priority: 'normal' | 'high' | 'urgent';
  readByCount?: number;
}

export interface TeacherProfile {
  id: string;
  organizationId: string;
  employeeId: string;
  fullName: string;
  fullNameAr?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'on_leave';
  specialization: string;
  qualification: string;
  bio: string;
  hireDate: string;
  hourlyRate?: number;
  currency?: string;
  contractType: 'full_time' | 'part_time' | 'visiting_lecturer';
  assignedCourseIds: string[];
  assignedClassIds: string[];
  availability: TeacherAvailabilityDay[];
  performanceMetrics: TeacherPerformanceMetrics;
  activityHistory: TeacherActivity[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherListStats {
  totalTeachers: number;
  activeTeachers: number;
  inactiveTeachers: number;
  onLeaveTeachers: number;
  avgRating: number;
  totalStudentsTaught: number;
  totalClassesAssigned: number;
  pendingGradingCount: number;
}

export interface TeacherListResponse {
  teachers: TeacherProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: TeacherListStats;
}

export interface TeacherDashboardData {
  teacher: TeacherProfile;
  todayClasses: BatchClass[];
  upcomingClasses: BatchClass[];
  assignedStudents: StudentProfile[];
  assignedCourses: Course[];
  pendingHomework: Assignment[];
  pendingGradingCount: number;
  recentResults: {
    id: string;
    studentName: string;
    courseTitle: string;
    assessmentTitle: string;
    type: 'homework' | 'quiz' | 'exam';
    score: number;
    maxScore: number;
    date: string;
    status: string;
  }[];
  notifications: OrganizationNotification[];
  messages: TeacherMessage[];
  stats: {
    totalClasses: number;
    todayClassesCount: number;
    totalStudents: number;
    pendingGradingSubmissions: number;
    averageRating: number;
    attendanceRate: number;
  };
}


