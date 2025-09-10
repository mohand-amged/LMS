export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type GradeLevel = 'FIRST' | 'SECOND' | 'THIRD';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  grade?: GradeLevel;
  createdAt: Date;
}

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

export interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignUpFormData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
