'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType, LoginFormData, SignUpFormData } from '../types/user';
import { createDemoUsers } from '../utils/seedData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple password hashing function (in production, use bcrypt on server)
const simpleHash = (password: string): string => {
  return btoa(password + 'salt_key_lms_2024');
};

// Simple password validation
const validatePassword = (password: string, hash: string): boolean => {
  return simpleHash(password) === hash;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    // Create demo users if none exist
    createDemoUsers();
    
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt)
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('lms_user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (data: SignUpFormData): Promise<void> => {
    setLoading(true);
    
    // Validation
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (data.role === 'student' && !data.grade) {
      throw new Error('Grade is required for students');
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('lms_users') || '[]');
    const userExists = existingUsers.some((u: any) => 
      u.email === data.email || u.username === data.username
    );

    if (userExists) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      role: data.role,
      grade: data.grade,
      createdAt: new Date()
    };

    // Store user with hashed password
    const userWithPassword = {
      ...newUser,
      passwordHash: simpleHash(data.password)
    };

    existingUsers.push(userWithPassword);
    localStorage.setItem('lms_users', JSON.stringify(existingUsers));
    localStorage.setItem('lms_user', JSON.stringify(newUser));

    setUser(newUser);
    setLoading(false);
  };

  const login = async (data: LoginFormData): Promise<void> => {
    setLoading(true);

    const existingUsers = JSON.parse(localStorage.getItem('lms_users') || '[]');
    const userRecord = existingUsers.find((u: any) => 
      (u.email === data.emailOrUsername || u.username === data.emailOrUsername)
    );

    if (!userRecord || !validatePassword(data.password, userRecord.passwordHash)) {
      throw new Error('Invalid credentials');
    }

    const { passwordHash, ...userWithoutPassword } = userRecord;
    const userData: User = {
      ...userWithoutPassword,
      createdAt: new Date(userWithoutPassword.createdAt)
    };

    localStorage.setItem('lms_user', JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('lms_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
