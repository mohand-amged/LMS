// Export existing user types
export * from './user';

// Core enums matching Prisma schema
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum GradeLevel {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED'
}

export enum LessonType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PRESENTATION = 'PRESENTATION',
  INTERACTIVE = 'INTERACTIVE'
}

export enum AssignmentType {
  ESSAY = 'ESSAY',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  PROJECT = 'PROJECT',
  PRESENTATION = 'PRESENTATION',
  LAB = 'LAB',
  OTHER = 'OTHER'
}

export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  RETURNED = 'RETURNED'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
  FILL_IN_BLANK = 'FILL_IN_BLANK'
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ASSIGNMENT = 'ASSIGNMENT',
  GRADE = 'GRADE',
  DISCUSSION = 'DISCUSSION',
  SYSTEM = 'SYSTEM'
}

export enum ResourceType {
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  ARCHIVE = 'ARCHIVE',
  OTHER = 'OTHER'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED'
}

// Course interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  imageUrl?: string;
  category?: string;
  status: CourseStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  teacherId: string;
  teacher?: User;
  enrollments?: Enrollment[];
  lessons?: Lesson[];
  assignments?: Assignment[];
  quizzes?: Quiz[];
  discussions?: Discussion[];
  announcements?: Announcement[];
  resources?: Resource[];
  attendance?: Attendance[];
}

export interface CreateCourseData {
  title: string;
  description: string;
  code: string;
  imageUrl?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: CourseStatus;
}

// Enrollment interfaces
export interface Enrollment {
  id: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
  userId: string;
  courseId: string;
  user?: User;
  course?: Course;
}

// Lesson interfaces
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string; // JSON content
  type: LessonType;
  order: number;
  duration?: number;
  videoUrl?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  course?: Course;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  content: string;
  type: LessonType;
  order: number;
  duration?: number;
  videoUrl?: string;
  courseId: string;
}

export interface LessonContent {
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  data: string;
  caption?: string;
}

// Assignment interfaces
export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  maxPoints: number;
  dueDate: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  teacherId: string;
  course?: Course;
  teacher?: User;
  submissions?: Submission[];
}

export interface CreateAssignmentData {
  title: string;
  description: string;
  type: AssignmentType;
  maxPoints: number;
  dueDate: Date;
  courseId: string;
}

// Submission interfaces
export interface Submission {
  id: string;
  content: string; // JSON content
  attachments?: string; // JSON array of file URLs
  status: SubmissionStatus;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignmentId: string;
  studentId: string;
  assignment?: Assignment;
  student?: User;
  grade?: Grade;
}

export interface CreateSubmissionData {
  content: string;
  attachments?: string[];
  assignmentId: string;
}

// Quiz interfaces
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  attempts: number;
  randomize: boolean;
  showResults: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  course?: Course;
  questions?: Question[];
  quizAttempts?: QuizAttempt[];
}

export interface CreateQuizData {
  title: string;
  description?: string;
  timeLimit?: number;
  attempts: number;
  randomize: boolean;
  showResults: boolean;
  courseId: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string; // JSON array
  correctAnswer: string; // JSON
  points: number;
  order: number;
  quizId: string;
  quiz?: Quiz;
  answers?: Answer[];
}

export interface CreateQuestionData {
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  points: number;
  order: number;
}

export interface QuizAttempt {
  id: string;
  score?: number;
  maxScore: number;
  timeSpent?: number;
  status: AttemptStatus;
  startedAt: Date;
  completedAt?: Date;
  quizId: string;
  studentId: string;
  quiz?: Quiz;
  student?: User;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  answer: string; // JSON
  isCorrect?: boolean;
  points: number;
  questionId: string;
  attemptId: string;
  question?: Question;
  attempt?: QuizAttempt;
}

// Grade interfaces
export interface Grade {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback?: string;
  gradedAt: Date;
  submissionId?: string;
  studentId: string;
  submission?: Submission;
  student?: User;
}

export interface CreateGradeData {
  score: number;
  maxScore: number;
  feedback?: string;
  submissionId?: string;
  studentId: string;
}

// Discussion interfaces
export interface Discussion {
  id: string;
  title: string;
  description?: string;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  course?: Course;
  posts?: DiscussionPost[];
}

export interface DiscussionPost {
  id: string;
  content: string;
  isSticky: boolean;
  createdAt: Date;
  updatedAt: Date;
  discussionId: string;
  authorId: string;
  discussion?: Discussion;
  author?: User;
  replies?: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  authorId: string;
  post?: DiscussionPost;
  author?: User;
}

export interface CreateDiscussionData {
  title: string;
  description?: string;
  courseId: string;
}

export interface CreatePostData {
  content: string;
  discussionId: string;
}

export interface CreateReplyData {
  content: string;
  postId: string;
}

// Announcement interfaces
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  courseId?: string;
  authorId: string;
  course?: Course;
  author?: User;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  priority: Priority;
  courseId?: string;
}

// Notification interfaces
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  user?: User;
}

// Resource interfaces
export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  size?: number;
  mimeType?: string;
  createdAt: Date;
  courseId: string;
  course?: Course;
}

export interface CreateResourceData {
  title: string;
  type: ResourceType;
  url: string;
  size?: number;
  mimeType?: string;
  courseId: string;
}

// Attendance interfaces
export interface Attendance {
  id: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
  courseId: string;
  studentId: string;
  course?: Course;
  student?: User;
}

export interface CreateAttendanceData {
  date: Date;
  status: AttendanceStatus;
  notes?: string;
  courseId: string;
  studentId: string;
}

// Extended User interface
export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  grade?: GradeLevel;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  coursesCreated?: Course[];
  enrollments?: Enrollment[];
  assignments?: Assignment[];
  submissions?: Submission[];
  quizAttempts?: QuizAttempt[];
  discussionPosts?: DiscussionPost[];
  discussionReplies?: DiscussionReply[];
  announcements?: Announcement[];
  notifications?: Notification[];
  grades?: Grade[];
  attendanceRecords?: Attendance[];
}

// Form data interfaces
export interface SignUpFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  grade?: GradeLevel;
}

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

// Context interfaces
export interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignUpFormData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search interfaces
export interface CourseFilter {
  category?: string;
  status?: CourseStatus;
  teacherId?: string;
  search?: string;
}

export interface AssignmentFilter {
  courseId?: string;
  status?: 'upcoming' | 'overdue' | 'completed';
  type?: AssignmentType;
}

export interface GradeFilter {
  courseId?: string;
  studentId?: string;
  assignmentId?: string;
}

// Dashboard data interfaces
export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalAssignments: number;
  averageGrade: number;
}

export interface StudentProgress {
  courseId: string;
  courseName: string;
  completedLessons: number;
  totalLessons: number;
  completedAssignments: number;
  totalAssignments: number;
  averageGrade: number;
}

export interface TeacherOverview {
  totalCourses: number;
  totalStudents: number;
  pendingSubmissions: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
  }>;
}
