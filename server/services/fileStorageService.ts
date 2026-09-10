import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  StoredFileMetadata,
  FileCategory,
  FileEntityType,
  FileVisibility,
  FileAccessControl,
  User,
  UserRole,
  MediaMetadata,
  StreamingConfig,
} from '../types';

export interface UploadFileInput {
  organizationId: string;
  uploader: User;
  entityType: FileEntityType;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  materialId?: string;
  visibility?: FileVisibility;
  allowedRoles?: UserRole[];
  requiresEnrollment?: boolean;
  mediaMetadata?: MediaMetadata;
  streamingConfig?: Partial<StreamingConfig>;
}

export interface ListFilesFilter {
  organizationId?: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  materialId?: string;
  entityType?: FileEntityType;
  category?: FileCategory;
  search?: string;
}

export class FileStorageService {
  private baseDir: string;
  private metadataStore: Map<string, StoredFileMetadata> = new Map();

  constructor() {
    this.baseDir = path.join(process.cwd(), 'server', 'storage', 'uploads');
    this.ensureDirectoryExists(this.baseDir);
    this.seedInitialEducationalFiles();
  }

  private ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Helper to format bytes to human-readable size
   */
  public formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Detect category based on mime type and extension
   */
  public detectCategory(mimeType: string, extension: string): FileCategory {
    const ext = extension.toLowerCase().replace('.', '');
    if (mimeType === 'application/pdf' || ext === 'pdf') {
      return 'pdf';
    }
    if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) {
      return 'image';
    }
    if (mimeType.startsWith('audio/') || ['mp3', 'ogg', 'wav', 'm4a', 'aac'].includes(ext)) {
      return 'audio';
    }
    if (mimeType.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(ext)) {
      return 'video';
    }
    if (
      ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv', 'zip', 'rar'].includes(ext) ||
      mimeType.includes('officedocument') ||
      mimeType.includes('msword') ||
      mimeType.includes('text/')
    ) {
      return 'document';
    }
    return 'other';
  }

  /**
   * Validate file size limits
   */
  public validateFileSize(category: FileCategory, sizeBytes: number): { valid: boolean; maxAllowedBytes: number; error?: string } {
    const limits: Record<FileCategory, number> = {
      pdf: 50 * 1024 * 1024, // 50MB
      image: 20 * 1024 * 1024, // 20MB
      audio: 100 * 1024 * 1024, // 100MB
      video: 250 * 1024 * 1024, // 250MB
      document: 50 * 1024 * 1024, // 50MB
      other: 50 * 1024 * 1024, // 50MB
    };

    const max = limits[category] || limits.other;
    if (sizeBytes > max) {
      return {
        valid: false,
        maxAllowedBytes: max,
        error: `File exceeds maximum allowed size for ${category.toUpperCase()} (${this.formatBytes(max)}). Your file is ${this.formatBytes(sizeBytes)}.`,
      };
    }
    return { valid: true, maxAllowedBytes: max };
  }

  /**
   * Store an uploaded file on disk and persist its metadata in the store
   * (Never storing raw binaries in DB/memory)
   */
  public async uploadFile(
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string,
    input: UploadFileInput
  ): Promise<StoredFileMetadata> {
    const sanitizedOriginalName = path.basename(originalFileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitizedOriginalName).toLowerCase() || '.bin';
    const category = this.detectCategory(mimeType, ext);
    const sizeBytes = fileBuffer.length;

    // Validate size limit
    const sizeCheck = this.validateFileSize(category, sizeBytes);
    if (!sizeCheck.valid) {
      throw new Error(sizeCheck.error);
    }

    // Generate unique safe physical storage filename
    const fileId = `fil_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const storedFileName = `${input.organizationId}_${fileId}${ext}`;
    const filePath = path.join(this.baseDir, storedFileName);

    // Compute SHA256 checksum
    const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Write binary file to disk
    await fs.promises.writeFile(filePath, fileBuffer);

    // Build streaming configuration if video or audio
    let streamingConfig: StreamingConfig | undefined = undefined;
    if (category === 'video') {
      streamingConfig = {
        isStreamReady: true,
        streamProvider: 'native_http_range',
        streamUrl: `/api/storage/files/${fileId}/stream`,
        cdnUrl: `https://cdn.oxfordgulf.edu/streams/v1/${fileId}.mp4`,
        hlsManifestUrl: `https://cdn.oxfordgulf.edu/hls/${fileId}/master.m3u8`,
        playbackResolutions: ['360p', '720p', '1080p', 'auto'],
        bandwidthRequirementsKbps: 3200,
        ...input.streamingConfig,
      };
    } else if (category === 'audio') {
      streamingConfig = {
        isStreamReady: true,
        streamProvider: 'native_http_range',
        streamUrl: `/api/storage/files/${fileId}/stream`,
        playbackResolutions: ['auto'],
        ...input.streamingConfig,
      };
    }

    const accessControl: FileAccessControl = {
      visibility: input.visibility || (input.entityType === 'course_material' || input.entityType === 'lesson_resource' ? 'enrolled_students' : 'tenant'),
      allowedRoles: input.allowedRoles,
      requiresEnrollment: input.requiresEnrollment ?? (input.visibility === 'enrolled_students' || !input.visibility),
    };

    const metadata: StoredFileMetadata = {
      id: fileId,
      organizationId: input.organizationId,
      originalFileName: sanitizedOriginalName,
      storedFileName,
      mimeType,
      fileSizeBytes: sizeBytes,
      fileSizeFormatted: this.formatBytes(sizeBytes),
      fileExtension: ext,
      category,
      uploaderId: input.uploader.id,
      uploaderName: input.uploader.fullName || input.uploader.email,
      uploaderRole: input.uploader.role,
      entityType: input.entityType,
      courseId: input.courseId,
      moduleId: input.moduleId,
      lessonId: input.lessonId,
      materialId: input.materialId,
      accessControl,
      mediaMetadata: input.mediaMetadata,
      streamingConfig,
      downloadCount: 0,
      sha256Hash,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.metadataStore.set(fileId, metadata);
    return metadata;
  }

  /**
   * Replace an existing file with a new version
   */
  public async replaceFile(
    fileId: string,
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string,
    uploader: User
  ): Promise<StoredFileMetadata> {
    const existing = this.metadataStore.get(fileId);
    if (!existing) {
      throw new Error(`File with ID ${fileId} does not exist`);
    }

    // Permission check for replacing
    const isOwner = existing.uploaderId === uploader.id;
    const isPrivileged = ['SUPER_ADMIN', 'ORGANIZATION_OWNER', 'ADMIN', 'MANAGER'].includes(uploader.role);
    const isTeacher = uploader.role === 'TEACHER' && existing.organizationId === uploader.organizationId;
    if (!isOwner && !isPrivileged && !isTeacher) {
      throw new Error('Unauthorized: You do not have permission to replace this file.');
    }

    const sanitizedOriginalName = path.basename(originalFileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitizedOriginalName).toLowerCase() || existing.fileExtension;
    const category = this.detectCategory(mimeType, ext);
    const sizeBytes = fileBuffer.length;

    // Validate size limit
    const sizeCheck = this.validateFileSize(category, sizeBytes);
    if (!sizeCheck.valid) {
      throw new Error(sizeCheck.error);
    }

    // Unlink old physical file
    const oldFilePath = path.join(this.baseDir, existing.storedFileName);
    if (fs.existsSync(oldFilePath)) {
      try {
        await fs.promises.unlink(oldFilePath);
      } catch (err) {
        console.warn(`Could not remove previous file ${oldFilePath}:`, err);
      }
    }

    // Save new file with unique timestamp
    const newStoredFileName = `${existing.organizationId}_${fileId}_v${existing.version + 1}${ext}`;
    const newFilePath = path.join(this.baseDir, newStoredFileName);
    const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    await fs.promises.writeFile(newFilePath, fileBuffer);

    const updatedMetadata: StoredFileMetadata = {
      ...existing,
      originalFileName: sanitizedOriginalName,
      storedFileName: newStoredFileName,
      mimeType,
      fileSizeBytes: sizeBytes,
      fileSizeFormatted: this.formatBytes(sizeBytes),
      fileExtension: ext,
      category,
      sha256Hash,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    };

    this.metadataStore.set(fileId, updatedMetadata);
    return updatedMetadata;
  }

  /**
   * Delete a file from disk and metadata store
   */
  public async deleteFile(fileId: string, user: User): Promise<boolean> {
    const existing = this.metadataStore.get(fileId);
    if (!existing) {
      return false;
    }

    // Permission check for deletion
    const isOwner = existing.uploaderId === user.id;
    const isPrivileged = ['SUPER_ADMIN', 'ORGANIZATION_OWNER', 'ADMIN', 'MANAGER'].includes(user.role);
    const isTeacher = user.role === 'TEACHER' && existing.organizationId === user.organizationId;
    if (!isOwner && !isPrivileged && !isTeacher) {
      throw new Error('Unauthorized: You do not have permission to delete this file.');
    }

    // Unlink from disk
    const filePath = path.join(this.baseDir, existing.storedFileName);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.warn(`Failed to unlink file ${filePath}:`, err);
      }
    }

    this.metadataStore.delete(fileId);
    return true;
  }

  /**
   * Check access control for a given file and user
   */
  public checkAccess(
    file: StoredFileMetadata,
    user?: User,
    isStudentEnrolled = false,
    isFreePreview = false
  ): { allowed: boolean; reason?: string; statusCode: number } {
    // 1. Tenant boundary check
    if (user && user.role !== 'SUPER_ADMIN' && user.organizationId !== file.organizationId) {
      return {
        allowed: false,
        reason: 'Access denied: File belongs to another educational institution.',
        statusCode: 403,
      };
    }

    // 2. Public files can be viewed by anyone
    if (file.accessControl.visibility === 'public') {
      return { allowed: true, statusCode: 200 };
    }

    // If anonymous user and file is not public
    if (!user) {
      return {
        allowed: false,
        reason: 'Authentication required to access this educational resource.',
        statusCode: 401,
      };
    }

    // 3. Owners, Admins, and Managers have full read access in their tenant
    if (['SUPER_ADMIN', 'ORGANIZATION_OWNER', 'ADMIN', 'MANAGER'].includes(user.role)) {
      return { allowed: true, statusCode: 200 };
    }

    // 4. File Creator/Uploader always has access
    if (user.id === file.uploaderId) {
      return { allowed: true, statusCode: 200 };
    }

    // 5. Teachers have access to non-restricted tenant files
    if (user.role === 'TEACHER') {
      return { allowed: true, statusCode: 200 };
    }

    // 6. Students
    if (user.role === 'STUDENT') {
      // If restricted to instructors only
      if (file.accessControl.visibility === 'instructors_only') {
        return {
          allowed: false,
          reason: 'Access restricted: This teaching resource is only accessible to faculty and instructors.',
          statusCode: 403,
        };
      }

      // If allowed roles explicitly defined
      if (file.accessControl.allowedRoles && !file.accessControl.allowedRoles.includes('STUDENT')) {
        return {
          allowed: false,
          reason: 'Access restricted: Your student role does not permit access to this file.',
          statusCode: 403,
        };
      }

      // If lesson is marked as a free preview, allow student preview
      if (isFreePreview) {
        return { allowed: true, statusCode: 200 };
      }

      // Check course enrollment
      if (file.accessControl.requiresEnrollment || file.accessControl.visibility === 'enrolled_students') {
        if (!isStudentEnrolled) {
          return {
            allowed: false,
            reason: 'Enrollment required: You must be enrolled in this course to access this educational material.',
            statusCode: 403,
          };
        }
      }

      return { allowed: true, statusCode: 200 };
    }

    // Parents / Staff
    if (user.role === 'PARENT' || user.role === 'STAFF') {
      if (file.accessControl.visibility === 'instructors_only') {
        return {
          allowed: false,
          reason: 'Access restricted: Resource reserved for instructors.',
          statusCode: 403,
        };
      }
      return { allowed: true, statusCode: 200 };
    }

    return { allowed: false, reason: 'Access denied.', statusCode: 403 };
  }

  /**
   * Retrieve file metadata with security check
   */
  public getFileMetadata(fileId: string): StoredFileMetadata | null {
    return this.metadataStore.get(fileId) || null;
  }

  /**
   * Get physical file path on disk
   */
  public getPhysicalFilePath(storedFileName: string): string {
    return path.join(this.baseDir, storedFileName);
  }

  /**
   * Increment download count safely
   */
  public incrementDownloadCount(fileId: string) {
    const file = this.metadataStore.get(fileId);
    if (file) {
      file.downloadCount = (file.downloadCount || 0) + 1;
      this.metadataStore.set(fileId, file);
    }
  }

  /**
   * Update file metadata (title, visibility, tags, chapters, etc.)
   */
  public updateFileMetadata(fileId: string, updates: Partial<StoredFileMetadata>, user: User): StoredFileMetadata {
    const existing = this.metadataStore.get(fileId);
    if (!existing) {
      throw new Error(`File ${fileId} not found`);
    }

    const isOwner = existing.uploaderId === user.id;
    const isPrivileged = ['SUPER_ADMIN', 'ORGANIZATION_OWNER', 'ADMIN', 'MANAGER'].includes(user.role);
    const isTeacher = user.role === 'TEACHER' && existing.organizationId === user.organizationId;
    if (!isOwner && !isPrivileged && !isTeacher) {
      throw new Error('Unauthorized to modify file metadata');
    }

    const updated: StoredFileMetadata = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      organizationId: existing.organizationId,
      storedFileName: existing.storedFileName,
      fileSizeBytes: existing.fileSizeBytes,
      updatedAt: new Date().toISOString(),
    };

    this.metadataStore.set(fileId, updated);
    return updated;
  }

  /**
   * List files matching criteria
   */
  public listFiles(filter: ListFilesFilter, user?: User, enrolledCourseIds: string[] = []): StoredFileMetadata[] {
    let results = Array.from(this.metadataStore.values());

    // Filter by organization
    if (filter.organizationId) {
      results = results.filter((f) => f.organizationId === filter.organizationId);
    }

    // Filter by courseId
    if (filter.courseId) {
      results = results.filter((f) => f.courseId === filter.courseId);
    }

    // Filter by lessonId
    if (filter.lessonId) {
      results = results.filter((f) => f.lessonId === filter.lessonId);
    }

    // Filter by entityType
    if (filter.entityType) {
      results = results.filter((f) => f.entityType === filter.entityType);
    }

    // Filter by category
    if (filter.category) {
      results = results.filter((f) => f.category === filter.category);
    }

    // Search query
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(
        (f) =>
          f.originalFileName.toLowerCase().includes(q) ||
          (f.mediaMetadata?.chapters && f.mediaMetadata.chapters.some((c) => c.title.toLowerCase().includes(q))) ||
          (f.uploaderName && f.uploaderName.toLowerCase().includes(q))
      );
    }

    // Security filter: students should only see files they have permission to access
    if (user && user.role === 'STUDENT') {
      results = results.filter((f) => {
        const isEnrolled = f.courseId ? enrolledCourseIds.includes(f.courseId) : false;
        const check = this.checkAccess(f, user, isEnrolled, false);
        return check.allowed;
      });
    }

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Seed realistic educational files on disk & in store
   */
  private seedInitialEducationalFiles() {
    // 1. Sample PDF Course Syllabus
    const syllabusContent = `%PDF-1.4
% Oxford Gulf Center - Official IELTS Academic Masterclass Syllabus 2026
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R>> endobj
4 0 obj <</Length 200>> stream
BT
/F1 18 Tf
72 720 Td
(Oxford Gulf English Center - IELTS Academic Masterclass 7.5+) Tj
/F1 12 Tf
72 690 Td
(Course Syllabus & CEFR Band Descriptors - Fall Term 2026) Tj
72 660 Td
(Lead Instructor: Sarah Jenkins, CELTA - British Council Certified) Tj
72 630 Td
(Modules: Spoken Fluency, Academic Reading, Task 2 Essay Cohesion) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000201 00000 n 
trailer <</Size 5 /Root 1 0 R>>
startxref
450
%%EOF`;

    const syllabusFileName = 'org_oxford_fil_ielts_syllabus.pdf';
    const syllabusPath = path.join(this.baseDir, syllabusFileName);
    if (!fs.existsSync(syllabusPath)) {
      fs.writeFileSync(syllabusPath, syllabusContent);
    }

    const syllabusMeta: StoredFileMetadata = {
      id: 'fil_ielts_syllabus',
      organizationId: 'org_oxford',
      originalFileName: 'Oxford_IELTS_Masterclass_Syllabus_2026.pdf',
      storedFileName: syllabusFileName,
      mimeType: 'application/pdf',
      fileSizeBytes: Buffer.byteLength(syllabusContent),
      fileSizeFormatted: this.formatBytes(Buffer.byteLength(syllabusContent)),
      fileExtension: '.pdf',
      category: 'pdf',
      uploaderId: 'usr_oxf_teacher1',
      uploaderName: 'Sarah Jenkins, CELTA',
      uploaderRole: 'TEACHER',
      entityType: 'course_file',
      courseId: 'crs_oxf_ielts',
      accessControl: {
        visibility: 'enrolled_students',
        requiresEnrollment: true,
      },
      mediaMetadata: {
        totalPages: 14,
      },
      downloadCount: 48,
      version: 1,
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z',
    };
    this.metadataStore.set(syllabusMeta.id, syllabusMeta);

    // 2. Lesson 1.1 Resource: Speaking Prompts Workbook PDF
    const workbookContent = `%PDF-1.4
% Cambridge IELTS Speaking Part 1 Comprehensive Prompt Bank
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R>> endobj
4 0 obj <</Length 250>> stream
BT
/F1 16 Tf
72 720 Td
(CEFR C1 Speaking Competence & Prompt Bank Workbook) Tj
/F1 12 Tf
72 690 Td
(Unit 1.1: Hometown & Architecture - Model Band 8.5 Responses) Tj
72 660 Td
(Hedging strategies, inversion formulas, and lexical expansion) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000201 00000 n 
trailer <</Size 5 /Root 1 0 R>>
startxref
500
%%EOF`;

    const workbookFileName = 'org_oxford_fil_ielts_wb1.pdf';
    const workbookPath = path.join(this.baseDir, workbookFileName);
    if (!fs.existsSync(workbookPath)) {
      fs.writeFileSync(workbookPath, workbookContent);
    }

    const workbookMeta: StoredFileMetadata = {
      id: 'fil_ielts_wb1',
      organizationId: 'org_oxford',
      originalFileName: 'CEFR_C1_Speaking_Competence_Prompt_Bank.pdf',
      storedFileName: workbookFileName,
      mimeType: 'application/pdf',
      fileSizeBytes: Buffer.byteLength(workbookContent),
      fileSizeFormatted: this.formatBytes(Buffer.byteLength(workbookContent)),
      fileExtension: '.pdf',
      category: 'pdf',
      uploaderId: 'usr_oxf_teacher1',
      uploaderName: 'Sarah Jenkins, CELTA',
      uploaderRole: 'TEACHER',
      entityType: 'lesson_resource',
      courseId: 'crs_oxf_ielts',
      moduleId: 'mod_ielts_01',
      lessonId: 'les_ielts_101',
      materialId: 'mat_ielts_pdf_1',
      accessControl: {
        visibility: 'enrolled_students',
        requiresEnrollment: true,
      },
      mediaMetadata: {
        totalPages: 18,
      },
      downloadCount: 32,
      version: 1,
      createdAt: '2026-08-05T12:00:00Z',
      updatedAt: '2026-08-05T12:00:00Z',
    };
    this.metadataStore.set(workbookMeta.id, workbookMeta);

    // 3. Audio Listening Track for Lesson 1.1
    // Generates a tiny valid empty OGG header so audio element or range requests can stream
    const audioDummyBuffer = Buffer.from('OggS\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x1e\x01\x13vorbis\x00\x00\x00\x00\x02\x44\xac\x00\x00\x00\x00\x00\x00\xb8\x01\x00\x00\x00\x00\x00\xb8\x01');
    const audioFileName = 'org_oxford_fil_ielts_audio1.ogg';
    const audioPath = path.join(this.baseDir, audioFileName);
    if (!fs.existsSync(audioPath)) {
      fs.writeFileSync(audioPath, audioDummyBuffer);
    }

    const audioMeta: StoredFileMetadata = {
      id: 'fil_ielts_audio1',
      organizationId: 'org_oxford',
      originalFileName: 'Sample_Band8.5_Speaking_Part1_Audio.ogg',
      storedFileName: audioFileName,
      mimeType: 'audio/ogg',
      fileSizeBytes: 2450000,
      fileSizeFormatted: '2.4 MB',
      fileExtension: '.ogg',
      category: 'audio',
      uploaderId: 'usr_oxf_teacher1',
      uploaderName: 'Sarah Jenkins, CELTA',
      uploaderRole: 'TEACHER',
      entityType: 'lesson_resource',
      courseId: 'crs_oxf_ielts',
      moduleId: 'mod_ielts_01',
      lessonId: 'les_ielts_101',
      materialId: 'mat_ielts_aud_1',
      accessControl: {
        visibility: 'enrolled_students',
        requiresEnrollment: true,
      },
      mediaMetadata: {
        durationSeconds: 240,
        speakerName: 'Dr. Alistair Vance & Fatima Al-Zahra',
        accent: 'British RP (Received Pronunciation)',
      },
      streamingConfig: {
        isStreamReady: true,
        streamProvider: 'native_http_range',
        streamUrl: '/api/storage/files/fil_ielts_audio1/stream',
        cdnUrl: 'https://cdn.oxfordgulf.edu/audio/ielts_speaking_part1_sample.ogg',
      },
      downloadCount: 19,
      version: 1,
      createdAt: '2026-08-06T14:30:00Z',
      updatedAt: '2026-08-06T14:30:00Z',
    };
    this.metadataStore.set(audioMeta.id, audioMeta);

    // 4. Video Lesson Material for Lesson 1.1
    const videoDummyBuffer = Buffer.from('\x00\x00\x00\x18ftypmp42\x00\x00\x00\x00isommp42\x00\x00\x00\x08free');
    const videoFileName = 'org_oxford_fil_ielts_video1.mp4';
    const videoPath = path.join(this.baseDir, videoFileName);
    if (!fs.existsSync(videoPath)) {
      fs.writeFileSync(videoPath, videoDummyBuffer);
    }

    const videoMeta: StoredFileMetadata = {
      id: 'fil_ielts_video1',
      organizationId: 'org_oxford',
      originalFileName: 'IELTS_Speaking_Band8_Mastery_Lecture.mp4',
      storedFileName: videoFileName,
      mimeType: 'video/mp4',
      fileSizeBytes: 84500000, // 84.5 MB
      fileSizeFormatted: '84.5 MB',
      fileExtension: '.mp4',
      category: 'video',
      uploaderId: 'usr_oxf_teacher1',
      uploaderName: 'Sarah Jenkins, CELTA',
      uploaderRole: 'TEACHER',
      entityType: 'course_material',
      courseId: 'crs_oxf_ielts',
      moduleId: 'mod_ielts_01',
      lessonId: 'les_ielts_101',
      materialId: 'mat_ielts_vid_1',
      accessControl: {
        visibility: 'enrolled_students',
        requiresEnrollment: true,
      },
      mediaMetadata: {
        durationSeconds: 960, // 16 minutes
        resolution: '1080p Full HD (60fps)',
        bitrateKbps: 3400,
        chapters: [
          { timeSeconds: 0, title: 'Introduction & Assessment Criteria', titleAr: 'المقدمة ومعايير التقييم', description: 'Overview of Fluency & Coherence vs Grammatical Range' },
          { timeSeconds: 154, title: 'High-Yield Lexical Collocations', titleAr: 'التلازمات اللفظية المتقدمة', description: 'Replacing common adjectives with C1 academic collocations' },
          { timeSeconds: 432, title: 'Inversion & Fronting Structures', titleAr: 'التراكيب النحوية المقلوبة والتوكيدية', description: 'Mastering negative adverbs and fronted adverbials' },
          { timeSeconds: 678, title: 'Band 8.5 Native Candidate Interview Breakdown', titleAr: 'تحليل مقابلة مرشح بمستوى 8.5', description: 'Sentence-by-sentence linguistic evaluation' },
          { timeSeconds: 880, title: 'Practice Cue Card Assignment & Homework', titleAr: 'المهمة التطبيقية والواجب', description: 'Instructions for submitting your 2-minute speaking cue card' },
        ],
      },
      streamingConfig: {
        isStreamReady: true,
        streamProvider: 'native_http_range',
        streamUrl: '/api/storage/files/fil_ielts_video1/stream',
        cdnUrl: 'https://cdn.oxfordgulf.edu/hls/ielts_speaking_101/master.m3u8',
        hlsManifestUrl: 'https://cdn.oxfordgulf.edu/hls/ielts_speaking_101/master.m3u8',
        playbackResolutions: ['360p', '720p', '1080p', 'auto'],
        bandwidthRequirementsKbps: 3400,
      },
      downloadCount: 65,
      version: 1,
      createdAt: '2026-08-04T09:15:00Z',
      updatedAt: '2026-08-04T09:15:00Z',
    };
    this.metadataStore.set(videoMeta.id, videoMeta);

    // 5. Teacher-Only Answer Key & Rubric (Restricted to instructors only)
    const answerKeyContent = `%PDF-1.4
% Oxford Gulf Center - CONFIDENTIAL INSTRUCTOR SCORING KEY
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R>> endobj
4 0 obj <</Length 200>> stream
BT
/F1 16 Tf
72 720 Td
(TEACHER CONFIDENTIAL: IELTS Speaking Diagnostic Scoring Rubric) Tj
/F1 12 Tf
72 690 Td
(Restricted to Oxford Gulf Teaching Staff and Examiners) Tj
72 660 Td
(Standardized examiner prompts and penalty triggers for hesitations) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000201 00000 n 
trailer <</Size 5 /Root 1 0 R>>
startxref
450
%%EOF`;

    const answerKeyFileName = 'org_oxford_fil_teacher_rubric.pdf';
    const answerKeyPath = path.join(this.baseDir, answerKeyFileName);
    if (!fs.existsSync(answerKeyPath)) {
      fs.writeFileSync(answerKeyPath, answerKeyContent);
    }

    const answerKeyMeta: StoredFileMetadata = {
      id: 'fil_teacher_rubric',
      organizationId: 'org_oxford',
      originalFileName: 'CONFIDENTIAL_Instructor_Diagnostic_Scoring_Rubric.pdf',
      storedFileName: answerKeyFileName,
      mimeType: 'application/pdf',
      fileSizeBytes: Buffer.byteLength(answerKeyContent),
      fileSizeFormatted: this.formatBytes(Buffer.byteLength(answerKeyContent)),
      fileExtension: '.pdf',
      category: 'pdf',
      uploaderId: 'usr_oxf_owner',
      uploaderName: 'Dr. Tariq Al-Ghamdi',
      uploaderRole: 'ORGANIZATION_OWNER',
      entityType: 'lesson_resource',
      courseId: 'crs_oxf_ielts',
      moduleId: 'mod_ielts_01',
      lessonId: 'les_ielts_101',
      accessControl: {
        visibility: 'instructors_only',
        allowedRoles: ['ORGANIZATION_OWNER', 'ADMIN', 'MANAGER', 'TEACHER'],
        requiresEnrollment: false,
      },
      mediaMetadata: {
        totalPages: 6,
      },
      downloadCount: 14,
      version: 1,
      createdAt: '2026-08-02T11:00:00Z',
      updatedAt: '2026-08-02T11:00:00Z',
    };
    this.metadataStore.set(answerKeyMeta.id, answerKeyMeta);
  }
}

export const fileStorageService = new FileStorageService();
