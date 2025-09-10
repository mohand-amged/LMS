'use client';

import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react';
import { UserRole } from '../types';
import Link from 'next/link';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Badge variant="destructive">Administrator</Badge>;
      case UserRole.TEACHER:
        return <Badge variant="info">Teacher</Badge>;
      case UserRole.STUDENT:
        return <Badge variant="success">Student</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Account</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.fullName}
              </span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Information</h1>
                <p className="text-gray-600 mt-1">
                  View and manage your account details
                </p>
              </div>
              <Link href="/profile">
                <Button className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your account details and basic information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile Picture and Basic Info */}
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
                    <p className="text-gray-600">@{user.username}</p>
                    <div className="mt-2">
                      {getRoleBadge(user.role)}
                    </div>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Shield className="h-4 w-4 inline mr-2" />
                      Account Role
                    </label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                  </div>

                  {user.role === UserRole.STUDENT && user.grade && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level
                      </label>
                      <p className="text-gray-900">{user.grade} Grade</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Member Since
                    </label>
                    <p className="text-gray-900">{user.createdAt.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="pt-6 border-t">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {user.role === UserRole.TEACHER ? '3' : '4'}
                      </div>
                      <div className="text-sm text-blue-700">
                        {user.role === UserRole.TEACHER ? 'Courses Teaching' : 'Courses Enrolled'}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {user.role === UserRole.TEACHER ? '45' : '12'}
                      </div>
                      <div className="text-sm text-green-700">
                        {user.role === UserRole.TEACHER ? 'Assignments Created' : 'Assignments Completed'}
                      </div>
                    </div>

                    {user.role === UserRole.STUDENT && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">87%</div>
                        <div className="text-sm text-purple-700">Average Grade</div>
                      </div>
                    )}

                    {user.role === UserRole.TEACHER && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">156</div>
                        <div className="text-sm text-orange-700">Total Students</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/profile">
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" size="sm">
                        Notification Settings
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" size="sm">
                        Privacy Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
