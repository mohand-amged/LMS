import { User } from '../types/user';

// Simple password hashing function (same as in AuthContext)
const simpleHash = (password: string): string => {
  return btoa(password + 'salt_key_lms_2024');
};

export const createDemoUsers = () => {
  const demoUsers = [
    {
      id: 'demo-teacher-1',
      fullName: 'John Smith',
      username: 'jsmith',
      email: 'teacher@example.com',
      role: 'teacher' as const,
      createdAt: new Date('2024-01-01'),
      passwordHash: simpleHash('password123')
    },
    {
      id: 'demo-student-1',
      fullName: 'Alice Johnson',
      username: 'ajohnson',
      email: 'student@example.com',
      role: 'student' as const,
      grade: '2nd' as const,
      createdAt: new Date('2024-01-15'),
      passwordHash: simpleHash('password123')
    },
    {
      id: 'demo-student-2',
      fullName: 'Bob Wilson',
      username: 'bwilson',
      email: 'bob.wilson@example.com',
      role: 'student' as const,
      grade: '1st' as const,
      createdAt: new Date('2024-01-20'),
      passwordHash: simpleHash('password123')
    },
    {
      id: 'demo-student-3',
      fullName: 'Emma Davis',
      username: 'edavis',
      email: 'emma.davis@example.com',
      role: 'student' as const,
      grade: '3rd' as const,
      createdAt: new Date('2024-02-01'),
      passwordHash: simpleHash('password123')
    }
  ];

  // Check if demo users already exist
  const existingUsers = JSON.parse(localStorage.getItem('lms_users') || '[]');
  
  // Only add demo users if no users exist
  if (existingUsers.length === 0) {
    localStorage.setItem('lms_users', JSON.stringify(demoUsers));
    console.log('Demo users created successfully!');
    return true;
  }
  
  return false;
};

export const listAllUsers = () => {
  const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
  return users.map((user: any) => ({
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    grade: user.grade
  }));
};
