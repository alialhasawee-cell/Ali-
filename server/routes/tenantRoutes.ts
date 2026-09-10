import { Router, Response } from 'express';
import { tenantStore } from '../db/store';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';

export const tenantRouter = Router();

// 1. Dashboard Stats (Strictly Tenant Scoped)
tenantRouter.get('/dashboard/stats', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const stats = tenantStore.getDashboardStats(tenantId);
  res.json(stats);
});

// 2. Courses & LMS Engine (Strictly Tenant Scoped)
tenantRouter.get('/courses', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const filters = {
    search: req.query.search as string,
    level: req.query.level as string,
    category: req.query.category as string,
    status: req.query.status as string,
    pricingType: req.query.pricingType as string,
    teacherId: req.query.teacherId as string,
  };
  const courses = tenantStore.getCourses(tenantId, filters);
  res.json(courses);
});

tenantRouter.get('/courses/:id', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const course = tenantStore.getCourseById(tenantId, req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

tenantRouter.post(
  '/courses',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Course title is required' });
    }

    const newCourse = tenantStore.createCourse(tenantId, req.body);

    tenantStore.addAuditLog({
      organizationId: tenantId,
      userId: req.user?.id || 'unknown',
      userEmail: req.user?.email || 'admin',
      userRole: req.user?.role || 'ADMIN',
      action: 'CREATE_COURSE',
      resource: 'Course',
      details: `Created course: ${newCourse.title} (${newCourse.code})`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(201).json(newCourse);
  }
);

tenantRouter.patch(
  '/courses/:id',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const updated = tenantStore.updateCourse(tenantId, req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updated);
  }
);

tenantRouter.patch(
  '/courses/:id/status',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { status } = req.body;
    if (!status || !['published', 'draft', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (published, draft, archived)' });
    }
    const updated = tenantStore.updateCourseStatus(tenantId, req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updated);
  }
);

tenantRouter.delete(
  '/courses/:id',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const deleted = tenantStore.deleteCourse(tenantId, req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ success: true, message: 'Course deleted successfully' });
  }
);

// Module Endpoints
tenantRouter.post(
  '/courses/:id/modules',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Module title is required' });
    }
    const newModule = tenantStore.createModule(tenantId, req.params.id, req.body);
    if (!newModule) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(201).json(newModule);
  }
);

tenantRouter.patch(
  '/courses/:id/modules/:moduleId',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const updated = tenantStore.updateModule(tenantId, req.params.id, req.params.moduleId, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Module or course not found' });
    }
    res.json(updated);
  }
);

tenantRouter.delete(
  '/courses/:id/modules/:moduleId',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const deleted = tenantStore.deleteModule(tenantId, req.params.id, req.params.moduleId);
    if (!deleted) {
      return res.status(404).json({ error: 'Module or course not found' });
    }
    res.json({ success: true });
  }
);

tenantRouter.post(
  '/courses/:id/modules/reorder',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { moduleIds } = req.body;
    if (!Array.isArray(moduleIds)) {
      return res.status(400).json({ error: 'moduleIds array required' });
    }
    const updatedCourse = tenantStore.reorderModules(tenantId, req.params.id, moduleIds);
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updatedCourse);
  }
);

// Lesson Endpoints
tenantRouter.post(
  '/courses/:id/modules/:moduleId/lessons',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Lesson title is required' });
    }
    const newLesson = tenantStore.createLesson(tenantId, req.params.id, req.params.moduleId, req.body);
    if (!newLesson) {
      return res.status(404).json({ error: 'Course or module not found' });
    }
    res.status(201).json(newLesson);
  }
);

tenantRouter.patch(
  '/courses/:id/modules/:moduleId/lessons/:lessonId',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const updated = tenantStore.updateLesson(
      tenantId,
      req.params.id,
      req.params.moduleId,
      req.params.lessonId,
      req.body
    );
    if (!updated) {
      return res.status(404).json({ error: 'Lesson, module or course not found' });
    }
    res.json(updated);
  }
);

tenantRouter.delete(
  '/courses/:id/modules/:moduleId/lessons/:lessonId',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const deleted = tenantStore.deleteLesson(
      tenantId,
      req.params.id,
      req.params.moduleId,
      req.params.lessonId
    );
    if (!deleted) {
      return res.status(404).json({ error: 'Lesson, module or course not found' });
    }
    res.json({ success: true });
  }
);

tenantRouter.post(
  '/courses/:id/modules/:moduleId/lessons/reorder',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { lessonIds } = req.body;
    if (!Array.isArray(lessonIds)) {
      return res.status(400).json({ error: 'lessonIds array required' });
    }
    const updatedModule = tenantStore.reorderLessons(
      tenantId,
      req.params.id,
      req.params.moduleId,
      lessonIds
    );
    if (!updatedModule) {
      return res.status(404).json({ error: 'Module or course not found' });
    }
    res.json(updatedModule);
  }
);

// Material Endpoints
tenantRouter.post(
  '/courses/:id/modules/:moduleId/lessons/:lessonId/materials',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const newMaterial = tenantStore.createMaterial(
      tenantId,
      req.params.id,
      req.params.moduleId,
      req.params.lessonId,
      req.body
    );
    if (!newMaterial) {
      return res.status(404).json({ error: 'Lesson, module, or course not found' });
    }
    res.status(201).json(newMaterial);
  }
);

tenantRouter.patch(
  '/courses/:id/modules/:moduleId/lessons/:lessonId/materials/:materialId',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const updated = tenantStore.updateMaterial(
      tenantId,
      req.params.id,
      req.params.moduleId,
      req.params.lessonId,
      req.params.materialId,
      req.body
    );
    if (!updated) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(updated);
  }
);

tenantRouter.delete(
  '/courses/:id/modules/:moduleId/lessons/:lessonId/materials/:materialId',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const deleted = tenantStore.deleteMaterial(
      tenantId,
      req.params.id,
      req.params.moduleId,
      req.params.lessonId,
      req.params.materialId
    );
    if (!deleted) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json({ success: true });
  }
);

// Student Progress & Learning Interface Endpoints
tenantRouter.get('/courses/:id/progress', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const studentId = (req.query.studentId as string) || req.user?.id || 'usr_oxf_student1';
  const progress = tenantStore.getStudentCourseProgress(tenantId, studentId, req.params.id);
  res.json(progress);
});

tenantRouter.post('/courses/:id/lessons/:lessonId/progress', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const studentId = req.user?.id || (req.body.studentId as string) || 'usr_oxf_student1';
  const { completed, timeSpentSeconds } = req.body;

  const progress = tenantStore.updateLessonProgress(
    tenantId,
    studentId,
    req.params.id,
    req.params.lessonId,
    completed !== false,
    Number(timeSpentSeconds) || 60
  );
  res.json(progress);
});

tenantRouter.post(
  '/courses/:id/lessons/:lessonId/quizzes/:materialId/submit',
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const studentId = req.user?.id || (req.body.studentId as string) || 'usr_oxf_student1';
    const { answers, score, passed } = req.body;

    const progress = tenantStore.submitQuizProgress(
      tenantId,
      studentId,
      req.params.id,
      req.params.lessonId,
      req.params.materialId,
      answers || {},
      Number(score) || 0,
      !!passed
    );
    res.json(progress);
  }
);

tenantRouter.post(
  '/courses/:id/lessons/:lessonId/assignments/:materialId/submit',
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const studentId = req.user?.id || (req.body.studentId as string) || 'usr_oxf_student1';
    const { textSubmission, fileUrl } = req.body;

    if (!textSubmission && !fileUrl) {
      return res.status(400).json({ error: 'Text submission or file attachment is required' });
    }

    const progress = tenantStore.submitAssignmentProgress(
      tenantId,
      studentId,
      req.params.id,
      req.params.lessonId,
      req.params.materialId,
      textSubmission || '',
      fileUrl
    );
    res.json(progress);
  }
);

// 3. Students (Tenant Scoped & Filtered)
tenantRouter.get('/students', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';

  if (req.query.format === 'flat' || req.query.all === 'true') {
    const allUsers = tenantStore.getUsers(tenantId);
    const students = allUsers.filter((u) => u.role === 'STUDENT');
    return res.json(students);
  }

  const result = tenantStore.getStudents(tenantId, {
    search: req.query.search as string,
    level: req.query.level as string,
    status: req.query.status as string,
    courseId: req.query.courseId as string,
    paymentStatus: req.query.paymentStatus as string,
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 8,
  });

  res.json(result);
});

tenantRouter.get('/students/stats', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const stats = tenantStore.getStudentStats(tenantId);
  res.json(stats);
});

tenantRouter.get('/students/:id', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const student = tenantStore.getStudentById(tenantId, req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found in this organization' });
  }
  res.json(student);
});

tenantRouter.post('/students', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { fullName, email, phone, cefrLevel } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: 'Student full name is required' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Student email is required' });
  }

  const existing = tenantStore.getUserByEmail(email.trim());
  if (existing) {
    return res.status(400).json({ error: 'A user or student with this email address already exists' });
  }

  const performerName = req.user?.fullName || req.user?.email || 'Administrator';
  const newStudent = tenantStore.createStudent(tenantId, req.body, performerName);

  res.status(201).json(newStudent);
});

tenantRouter.patch('/students/:id', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const performerName = req.user?.fullName || req.user?.email || 'Administrator';

  const updated = tenantStore.updateStudent(tenantId, req.params.id, req.body, performerName);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found in this organization' });
  }

  res.json(updated);
});

tenantRouter.patch('/students/:id/status', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { status } = req.body;

  if (!status || !['active', 'inactive', 'graduated', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (active, inactive, graduated, suspended)' });
  }

  const performerName = req.user?.fullName || req.user?.email || 'Administrator';
  const updated = tenantStore.setStudentStatus(tenantId, req.params.id, status, performerName);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(updated);
});

tenantRouter.delete('/students/:id', requireRole(['ORGANIZATION_OWNER', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const performerName = req.user?.fullName || req.user?.email || 'Administrator';

  const deleted = tenantStore.deleteStudent(tenantId, req.params.id, performerName);
  if (!deleted) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json({ success: true, message: 'Student record permanently removed' });
});

tenantRouter.post('/students/:id/enroll', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { courseId, classId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required for enrollment' });
  }

  const performerName = req.user?.fullName || req.user?.email || 'Administrator';
  const updated = tenantStore.enrollStudent(tenantId, req.params.id, courseId, classId, performerName);
  if (!updated) {
    return res.status(404).json({ error: 'Student or course not found in this organization' });
  }

  res.json(updated);
});

tenantRouter.post('/students/:id/withdraw', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { courseId, classId, reason } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  const performerName = req.user?.fullName || req.user?.email || 'Administrator';
  const updated = tenantStore.withdrawStudent(tenantId, req.params.id, courseId, classId, reason, performerName);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(updated);
});

tenantRouter.post('/students/:id/payments', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { title, amount } = req.body;

  if (!title || amount === undefined || amount === null) {
    return res.status(400).json({ error: 'Payment title and valid numeric amount are required' });
  }

  const performerName = req.user?.fullName || req.user?.email || 'Finance';
  const updated = tenantStore.addStudentPayment(tenantId, req.params.id, req.body, performerName);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(updated);
});

tenantRouter.post('/students/:id/notes', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { content, category } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Note content cannot be empty' });
  }

  const authorName = req.user?.fullName || req.user?.email || 'Staff';
  const authorRole = req.user?.role || 'Staff';
  const updated = tenantStore.addStudentNote(tenantId, req.params.id, { content, category }, authorName, authorRole);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(updated);
});

tenantRouter.post('/students/:id/exams', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { examTitle, score } = req.body;

  if (!examTitle || score === undefined) {
    return res.status(400).json({ error: 'Exam title and score are required' });
  }

  const performerName = req.user?.fullName || req.user?.email || 'Examiner';
  const updated = tenantStore.addStudentExam(tenantId, req.params.id, req.body, performerName);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(updated);
});

// 4. Teachers (Tenant Scoped)
tenantRouter.get('/teachers', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const allUsers = tenantStore.getUsers(tenantId);
  const teachers = allUsers.filter((u) => u.role === 'TEACHER' || u.role === 'ORGANIZATION_OWNER');
  res.json(teachers);
});

// 5. Classes & Schedules (Tenant Scoped)
tenantRouter.get('/classes', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const classes = tenantStore.getClasses(tenantId);
  res.json(classes);
});

tenantRouter.post('/classes', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { name, courseId, teacherId, scheduleDay, scheduleTime, roomOrMeetingLink, maxCapacity } = req.body;

  const course = tenantStore.getCourses(tenantId).find((c) => c.id === courseId);
  const teacher = tenantStore.getUserById(teacherId);

  const newClass = tenantStore.createClass(tenantId, {
    name,
    courseId,
    courseTitle: course?.title || 'General Course',
    teacherId,
    teacherName: teacher?.fullName || 'Instructor',
    scheduleDay,
    scheduleTime,
    roomOrMeetingLink,
    maxCapacity: Number(maxCapacity) || 16,
  });

  res.status(201).json(newClass);
});

// 6. Attendance (Tenant Scoped)
tenantRouter.get('/attendance', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const classId = req.query.classId as string;
  const records = tenantStore.getAttendance(tenantId, classId);
  res.json(records);
});

tenantRouter.post('/attendance', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { classId, className, date, entries } = req.body;

  if (!classId || !entries) {
    return res.status(400).json({ error: 'Class ID and attendance entries are required' });
  }

  const record = tenantStore.saveAttendance(tenantId, {
    classId,
    className: className || 'English Class',
    date: date || new Date().toISOString().split('T')[0],
    entries,
    takenByTeacherId: req.user?.id || 'teacher',
  });

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'unknown',
    userEmail: req.user?.email || 'teacher',
    userRole: req.user?.role || 'TEACHER',
    action: 'RECORD_ATTENDANCE',
    resource: 'Attendance',
    details: `Attendance recorded for ${className} on ${record.date} (${entries.length} students)`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json(record);
});

// 7. Assignments & Submissions
tenantRouter.get('/assignments', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const assignments = tenantStore.getAssignments(tenantId);
  res.json(assignments);
});

tenantRouter.post('/assignments', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { courseId, courseTitle, title, description, dueDate, maxScore } = req.body;

  const newAsg = tenantStore.createAssignment(tenantId, {
    courseId,
    courseTitle,
    title,
    description,
    dueDate,
    maxScore: Number(maxScore) || 100,
  });

  res.status(201).json(newAsg);
});

tenantRouter.post('/assignments/:id/grade', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;
  const { studentId, score, feedback } = req.body;

  const updated = tenantStore.submitAssignmentGrade(tenantId, id, studentId, Number(score), feedback);
  if (!updated) {
    return res.status(404).json({ error: 'Assignment or student submission not found in this tenant' });
  }

  res.json(updated);
});

// 8. Quizzes & Exams
tenantRouter.get('/quizzes', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const quizzes = tenantStore.getQuizzes(tenantId);
  res.json(quizzes);
});

tenantRouter.post('/quizzes', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { courseId, courseTitle, title, type, durationMinutes, passingScore, questions } = req.body;

  const quiz = tenantStore.createQuiz(tenantId, {
    courseId,
    courseTitle,
    title,
    type: type || 'quiz',
    durationMinutes: Number(durationMinutes) || 30,
    passingScore: Number(passingScore) || 70,
    questions: questions || [],
  });

  res.status(201).json(quiz);
});

// 9. Certificates (Tenant scoped list + issuance)
tenantRouter.get('/certificates', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const certs = tenantStore.getCertificates(tenantId);
  res.json(certs);
});

tenantRouter.post('/certificates/issue', requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { studentId, studentName, courseId, courseTitle, grade, instructorName, directorName } = req.body;

  const cert = tenantStore.issueCertificate(tenantId, {
    studentId,
    studentName,
    courseId,
    courseTitle,
    grade,
    instructorName,
    directorName,
  });

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'unknown',
    userEmail: req.user?.email || 'admin',
    userRole: req.user?.role || 'ADMIN',
    action: 'ISSUE_CERTIFICATE',
    resource: 'Certificate',
    details: `Issued certificate ${cert.verificationCode} to ${cert.studentName} for ${cert.courseTitle}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json(cert);
});

// Public Verification endpoint (accessible without auth to verify credentials!)
tenantRouter.get('/certificates/verify/:code', (req: AuthenticatedRequest, res: Response) => {
  const { code } = req.params;
  const cert = tenantStore.getCertificateByCode(code);
  if (!cert) {
    return res.status(404).json({
      valid: false,
      message: 'Certificate verification failed: No authentic credential found with this verification ID.',
    });
  }

  res.json({
    valid: true,
    certificate: cert,
    verifiedAt: new Date().toISOString(),
    securitySeal: 'VERIFIED_MR_FLUENCY_SAAS_DIGITAL_REGISTRY',
  });
});

// 10. Organizations / Tenants
tenantRouter.get('/organizations', (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role === 'SUPER_ADMIN') {
    return res.json(tenantStore.getOrganizations());
  }
  const currentOrg = tenantStore.getOrganizationById(req.tenantId || 'org_oxford');
  res.json(currentOrg ? [currentOrg] : []);
});

tenantRouter.get('/organization/current', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const org = tenantStore.getOrganizationById(tenantId);
  if (!org) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(org);
});

tenantRouter.patch('/organization/settings', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const {
    name,
    nameAr,
    contactEmail,
    phone,
    emergencyPhone,
    websiteUrl,
    country,
    timezone,
    currency,
    customDomain,
    brandColor,
    logoUrl,
    address,
    socialLinks,
    branding,
    academicSettings,
    certificateSettings,
  } = req.body;

  const updated = tenantStore.updateOrganization(tenantId, {
    name,
    nameAr,
    contactEmail,
    phone,
    emergencyPhone,
    websiteUrl,
    country,
    timezone,
    currency,
    customDomain,
    brandColor,
    logoUrl,
    address,
    socialLinks,
    branding,
    academicSettings,
    certificateSettings,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'usr_owner',
    userEmail: req.user?.email || 'admin',
    userRole: req.user?.role || 'ORGANIZATION_OWNER',
    action: 'UPDATE_ORGANIZATION_SETTINGS',
    resource: 'Organization',
    details: `Updated settings for ${updated.name}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json(updated);
});

// 10b. Organization User Management (Search, Filter, Pagination, Role Assignment, Status toggle)
tenantRouter.get('/users', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const search = req.query.search as string | undefined;
  const role = req.query.role as string | undefined;
  const status = req.query.status as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const result = tenantStore.getPagedUsers(tenantId, {
    search,
    role,
    status,
    page,
    limit,
  });

  res.json(result);
});

tenantRouter.post('/users', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { fullName, fullNameAr, email, phone, role, status, studentDetails, teacherDetails } = req.body;

  if (!fullName || !email || !role) {
    return res.status(400).json({ error: 'Full name, email, and role are required' });
  }

  // Check if email already registered in system
  const existing = tenantStore.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email address already exists' });
  }

  const newUser = tenantStore.createUser({
    organizationId: tenantId,
    email,
    fullName,
    fullNameAr,
    phone,
    role,
    status: status || 'active',
    studentDetails,
    teacherDetails,
  });

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'usr_admin',
    userEmail: req.user?.email || 'admin',
    userRole: req.user?.role || 'ADMIN',
    action: 'CREATE_USER',
    resource: 'User',
    details: `Created new user ${newUser.fullName} (${newUser.email}) with role ${newUser.role}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json(newUser);
});

tenantRouter.patch('/users/:id', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;
  const updates = req.body;

  const updated = tenantStore.updateUser(tenantId, id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'User not found in this organization' });
  }

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'usr_admin',
    userEmail: req.user?.email || 'admin',
    userRole: req.user?.role || 'ADMIN',
    action: 'UPDATE_USER',
    resource: 'User',
    details: `Updated user profile for ${updated.fullName} (${updated.email})`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json(updated);
});

tenantRouter.patch('/users/:id/status', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'inactive', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const updated = tenantStore.setUserStatus(tenantId, id, status);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'usr_admin',
    userEmail: req.user?.email || 'admin',
    userRole: req.user?.role || 'ADMIN',
    action: 'CHANGE_USER_STATUS',
    resource: 'User',
    details: `Changed status of ${updated.fullName} to ${status}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json(updated);
});

tenantRouter.patch('/users/:id/role', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;
  const { role } = req.body;

  const updated = tenantStore.setUserRole(tenantId, id, role);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'usr_admin',
    userEmail: req.user?.email || 'admin',
    userRole: req.user?.role || 'ADMIN',
    action: 'REASSIGN_USER_ROLE',
    resource: 'User',
    details: `Reassigned role for ${updated.fullName} to ${role}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json(updated);
});

tenantRouter.delete('/users/:id', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;

  const user = tenantStore.getUserById(id);
  const deleted = tenantStore.deleteUser(tenantId, id);
  if (!deleted) {
    return res.status(404).json({ error: 'User could not be deleted or not found' });
  }

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || 'usr_admin',
    userEmail: req.user?.email || 'admin',
    userRole: req.user?.role || 'ADMIN',
    action: 'DELETE_USER',
    resource: 'User',
    details: `Deleted user ${user?.fullName || id}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: 'User deleted successfully' });
});

// 10c. Customer Demonstration Tools (Seed Showcase Data & Reset to Empty State)
tenantRouter.post('/demo/seed', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  tenantStore.seedOrganizationDemoData(tenantId);
  const updatedStats = tenantStore.getDashboardStats(tenantId);
  res.json({
    success: true,
    message: 'Demonstration dataset loaded successfully into organization',
    stats: updatedStats,
  });
});

tenantRouter.post('/demo/reset', requireRole(['ORGANIZATION_OWNER', 'SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  tenantStore.resetOrganizationData(tenantId);
  const updatedStats = tenantStore.getDashboardStats(tenantId);
  res.json({
    success: true,
    message: 'Organization data reset back to clean initial state',
    stats: updatedStats,
  });
});

// 11. Audit Logs (Tenant Scoped or Platform-wide for Super Admin)
tenantRouter.get('/audit-logs', (req: AuthenticatedRequest, res: Response) => {
  const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
  const tenantId = req.tenantId || 'org_oxford';
  const logs = tenantStore.getAuditLogs(tenantId, isSuperAdmin);
  res.json(logs);
});

// 12. Public Commercial Contact & Inquiry
tenantRouter.post('/contact', (req: AuthenticatedRequest, res: Response) => {
  const { fullName, email, phone, institutionName, institutionType, interestedIn, message } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  const ticketId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

  tenantStore.addAuditLog({
    organizationId: req.tenantId || 'public_inquiry',
    userId: 'anonymous_visitor',
    userEmail: email,
    userRole: 'STAFF',
    action: 'PUBLIC_INQUIRY',
    resource: 'Contact',
    details: `Inquiry ticket ${ticketId} from ${fullName} (${institutionName || 'Independent'}) - ${interestedIn || 'General Demo'}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    success: true,
    ticketId,
    receivedAt: new Date().toISOString(),
    message: 'Thank you for reaching out to MR. FLUENCY (أستاذ علي). Our educational enterprise team will respond within 4 business hours.',
  });
});

// 13. Teacher Management & Teacher Workspace Routes (Tenant Scoped & Authorized)

// List Teachers (Tenant Scoped, with Search, Filter & Pagination)
tenantRouter.get('/teachers', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';

  // Unauthorized organization access check for teachers
  if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
    return res.status(403).json({ error: 'Access denied: You cannot view teachers from another organization' });
  }

  const { search, status, specialization, page, limit, format } = req.query;

  if (format === 'flat' || req.query.all === 'true') {
    const list = tenantStore.getTeachers(tenantId, {
      search: search as string,
      status: status as string,
      specialization: specialization as string,
    });
    return res.json(list);
  }

  const result = tenantStore.getPagedTeachers(tenantId, {
    search: search as string,
    status: status as string,
    specialization: specialization as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  res.json(result);
});

// Get Single Teacher Profile
tenantRouter.get('/teachers/:id', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;

  if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
    return res.status(403).json({ error: 'Access denied: You cannot view faculty from another organization' });
  }

  const teacher = tenantStore.getTeacherById(tenantId, id);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found in this academy' });
  }

  res.json(teacher);
});

// Add Teacher (Admin / Owner / Manager)
tenantRouter.post(
  '/teachers',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const {
      fullName,
      fullNameAr,
      email,
      phone,
      employeeId,
      specialization,
      qualification,
      bio,
      status,
      contractType,
      hourlyRate,
      currency,
      assignedCourseIds,
      assignedClassIds,
      availability,
      notes,
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const newTeacher = tenantStore.createTeacher(tenantId, {
      fullName,
      fullNameAr,
      email,
      phone,
      employeeId,
      specialization,
      qualification,
      bio,
      status,
      contractType,
      hourlyRate: Number(hourlyRate) || 150,
      currency: currency || 'SAR',
      assignedCourseIds: assignedCourseIds || [],
      assignedClassIds: assignedClassIds || [],
      availability,
      notes,
    });

    tenantStore.addAuditLog({
      organizationId: tenantId,
      userId: req.user?.id || 'admin',
      userEmail: req.user?.email || 'admin@academy.edu',
      userRole: req.user?.role || 'ADMIN',
      action: 'ADD_TEACHER',
      resource: 'Faculty',
      details: `Added new teacher: ${newTeacher.fullName} (${newTeacher.employeeId})`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(201).json(newTeacher);
  }
);

// Edit Teacher (Admin / Owner / Manager, or Teacher updating self)
tenantRouter.put('/teachers/:id', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;

  // Authorization check: Teacher can only update their own profile; admins can update any teacher in their org
  const isSelf = req.user?.id === id;
  const isAuthorizedManager =
    req.user?.role === 'ORGANIZATION_OWNER' ||
    req.user?.role === 'ADMIN' ||
    req.user?.role === 'SUPER_ADMIN' ||
    req.user?.role === 'MANAGER';

  if (!isSelf && !isAuthorizedManager) {
    return res.status(403).json({ error: 'Permission denied: Cannot edit another teacher' });
  }

  if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
    return res.status(403).json({ error: 'Permission denied: Cross-organization modification blocked' });
  }

  const updated = tenantStore.updateTeacher(tenantId, id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Teacher not found in this academy' });
  }

  tenantStore.addAuditLog({
    organizationId: tenantId,
    userId: req.user?.id || id,
    userEmail: req.user?.email || updated.email,
    userRole: req.user?.role || 'TEACHER',
    action: 'UPDATE_TEACHER',
    resource: 'Faculty',
    details: `Updated teacher profile: ${updated.fullName} (${updated.employeeId})`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json(updated);
});

// Delete Teacher (Admin / Owner)
tenantRouter.delete(
  '/teachers/:id',
  requireRole(['ORGANIZATION_OWNER', 'ADMIN', 'SUPER_ADMIN']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { id } = req.params;

    const teacher = tenantStore.getTeacherById(tenantId, id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found in this academy' });
    }

    const success = tenantStore.deleteTeacher(tenantId, id);
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete teacher' });
    }

    tenantStore.addAuditLog({
      organizationId: tenantId,
      userId: req.user?.id || 'admin',
      userEmail: req.user?.email || 'admin@academy.edu',
      userRole: req.user?.role || 'ADMIN',
      action: 'DELETE_TEACHER',
      resource: 'Faculty',
      details: `Removed teacher: ${teacher.fullName} (${teacher.employeeId})`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({ success: true, message: 'Teacher deleted successfully' });
  }
);

// Update Teacher Availability
tenantRouter.put('/teachers/:id/availability', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;
  const { availability } = req.body;

  if (!availability || !Array.isArray(availability)) {
    return res.status(400).json({ error: 'Availability schedule array is required' });
  }

  if (req.user?.role === 'TEACHER' && req.user.id !== id) {
    return res.status(403).json({ error: 'Cannot modify availability of another teacher' });
  }

  const updated = tenantStore.updateTeacherAvailability(tenantId, id, availability);
  if (!updated) {
    return res.status(404).json({ error: 'Teacher not found' });
  }

  res.json(updated);
});

// Get Teacher Dashboard (Data-rich hub for teacher workspace)
tenantRouter.get('/teachers/:id/dashboard', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;

  if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
    return res.status(403).json({ error: 'Access denied: Cross-organization data access forbidden' });
  }

  const dashboardData = tenantStore.getTeacherDashboard(tenantId, id);
  res.json(dashboardData);
});

// Teacher Workflow: Record Attendance
tenantRouter.post(
  '/teachers/:id/attendance',
  requireRole(['TEACHER', 'ADMIN', 'ORGANIZATION_OWNER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { id } = req.params;
    const { classId, date, entries } = req.body;

    if (!classId || !entries || !Array.isArray(entries)) {
      return res.status(400).json({ error: 'Class ID and attendance entries are required' });
    }

    if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
      return res.status(403).json({ error: 'Cannot record attendance in an unauthorized organization' });
    }

    const record = tenantStore.recordTeacherAttendance(
      tenantId,
      id,
      classId,
      date || new Date().toISOString().split('T')[0],
      entries
    );

    res.status(201).json(record);
  }
);

// Teacher Workflow: Create Homework
tenantRouter.post(
  '/teachers/:id/homework',
  requireRole(['TEACHER', 'ADMIN', 'ORGANIZATION_OWNER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { id } = req.params;
    const { courseId, courseTitle, title, description, dueDate, maxScore } = req.body;

    if (!title || !courseId || !dueDate) {
      return res.status(400).json({ error: 'Title, course, and due date are required' });
    }

    if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
      return res.status(403).json({ error: 'Access denied: Organization mismatch' });
    }

    const course = tenantStore.getCourses(tenantId).find((c) => c.id === courseId);
    const asg = tenantStore.createTeacherHomework(tenantId, id, {
      courseId,
      courseTitle: courseTitle || course?.title || 'Academic Course',
      title,
      description: description || '',
      dueDate,
      maxScore: Number(maxScore) || 100,
    });

    res.status(201).json(asg);
  }
);

// Teacher Workflow: Create Quiz
tenantRouter.post(
  '/teachers/:id/quizzes',
  requireRole(['TEACHER', 'ADMIN', 'ORGANIZATION_OWNER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { id } = req.params;
    const { courseId, courseTitle, title, type, durationMinutes, passingScore, questions } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ error: 'Title and course are required' });
    }

    if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
      return res.status(403).json({ error: 'Access denied: Organization mismatch' });
    }

    const course = tenantStore.getCourses(tenantId).find((c) => c.id === courseId);
    const quiz = tenantStore.createTeacherQuiz(tenantId, id, {
      courseId,
      courseTitle: courseTitle || course?.title || 'English Course',
      title,
      type: type || 'quiz',
      durationMinutes: Number(durationMinutes) || 30,
      passingScore: Number(passingScore) || 70,
      questions: questions || [],
    });

    res.status(201).json(quiz);
  }
);

// Teacher Workflow: Record Result (Exam/Quiz Result for student)
tenantRouter.post(
  '/teachers/:id/results',
  requireRole(['TEACHER', 'ADMIN', 'ORGANIZATION_OWNER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { id } = req.params;
    const { studentId, examTitle, examType, date, score, maxScore, bandScore, passed, skills, examinerFeedback } =
      req.body;

    if (!studentId || !examTitle || score === undefined) {
      return res.status(400).json({ error: 'Student ID, exam title, and score are required' });
    }

    if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
      return res.status(403).json({ error: 'Access denied: Organization mismatch' });
    }

    const result = tenantStore.recordTeacherExamResult(tenantId, id, studentId, {
      examTitle,
      examType: examType || 'CEFR Assessment',
      date: date || new Date().toISOString().split('T')[0],
      score: Number(score),
      maxScore: Number(maxScore) || 100,
      bandScore,
      passed,
      skills,
      examinerFeedback,
    });

    res.status(201).json(result);
  }
);

// Teacher Workflow: Send Communication (Message student or class broadcast)
tenantRouter.post(
  '/teachers/:id/messages',
  requireRole(['TEACHER', 'ADMIN', 'ORGANIZATION_OWNER']),
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.tenantId || 'org_oxford';
    const { id } = req.params;
    const { recipientType, recipientId, recipientName, subject, content, priority } = req.body;

    if (!subject || !content || !recipientName) {
      return res.status(400).json({ error: 'Subject, content, and recipient name are required' });
    }

    if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
      return res.status(403).json({ error: 'Access denied: Organization mismatch' });
    }

    const msg = tenantStore.sendTeacherMessage(tenantId, id, {
      recipientType: recipientType || 'student',
      recipientId,
      recipientName,
      subject,
      content,
      priority: priority || 'normal',
    });

    res.status(201).json(msg);
  }
);

// Get Messages sent by Teacher
tenantRouter.get('/teachers/:id/messages', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId || 'org_oxford';
  const { id } = req.params;

  if (req.user?.role === 'TEACHER' && req.user.organizationId !== tenantId) {
    return res.status(403).json({ error: 'Access denied: Organization mismatch' });
  }

  const messages = tenantStore.getTeacherMessages(tenantId, id);
  res.json(messages);
});

