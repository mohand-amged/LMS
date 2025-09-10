'use client';

import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                LMS Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.fullName}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.fullName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'teacher' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'teacher' ? 'Teacher' : 'Student'}
                    </span>
                  </dd>
                </div>
                {user.role === 'student' && user.grade && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Grade</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.grade} Grade</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.createdAt.toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user.role === 'teacher' ? (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-blue-900">Create Course</h3>
                      <p className="text-sm text-blue-700 mt-1">Set up a new course for your students</p>
                      <Link href="/courses/create">
                        <Button className="mt-2" size="sm">Get Started</Button>
                      </Link>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-green-900">My Courses</h3>
                      <p className="text-sm text-green-700 mt-1">View and manage your courses</p>
                      <Link href="/courses">
                        <Button className="mt-2" size="sm" variant="outline">View Courses</Button>
                      </Link>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-purple-900">Assignments</h3>
                      <p className="text-sm text-purple-700 mt-1">Create and grade assignments</p>
                      <Link href="/assignments">
                        <Button className="mt-2" size="sm" variant="outline">Manage</Button>
                      </Link>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-indigo-900">Discussions</h3>
                      <p className="text-sm text-indigo-700 mt-1">Interact with your students</p>
                      <Link href="/discussions">
                        <Button className="mt-2" size="sm" variant="outline">Open Forum</Button>
                      </Link>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-red-900">Announcements</h3>
                      <p className="text-sm text-red-700 mt-1">Post important updates</p>
                      <Link href="/announcements">
                        <Button className="mt-2" size="sm" variant="outline">View All</Button>
                      </Link>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-orange-900">Quizzes</h3>
                      <p className="text-sm text-orange-700 mt-1">Create and manage quizzes</p>
                      <Link href="/quizzes">
                        <Button className="mt-2" size="sm" variant="outline">Manage</Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-blue-900">My Courses</h3>
                      <p className="text-sm text-blue-700 mt-1">View your enrolled courses</p>
                      <Link href="/courses">
                        <Button className="mt-2" size="sm">View Courses</Button>
                      </Link>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-green-900">Assignments</h3>
                      <p className="text-sm text-green-700 mt-1">Check pending assignments</p>
                      <Link href="/assignments">
                        <Button className="mt-2" size="sm" variant="outline">View Tasks</Button>
                      </Link>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-purple-900">Grades</h3>
                      <p className="text-sm text-purple-700 mt-1">View your academic progress</p>
                      <Link href="/grades">
                        <Button className="mt-2" size="sm" variant="outline">Check Grades</Button>
                      </Link>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-yellow-900">Quizzes</h3>
                      <p className="text-sm text-yellow-700 mt-1">Take quizzes and assessments</p>
                      <Link href="/quizzes">
                        <Button className="mt-2" size="sm" variant="outline">Take Quiz</Button>
                      </Link>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-indigo-900">Discussions</h3>
                      <p className="text-sm text-indigo-700 mt-1">Ask questions and collaborate</p>
                      <Link href="/discussions">
                        <Button className="mt-2" size="sm" variant="outline">Open Forum</Button>
                      </Link>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-red-900">Announcements</h3>
                      <p className="text-sm text-red-700 mt-1">Stay updated with news</p>
                      <Link href="/announcements">
                        <Button className="mt-2" size="sm" variant="outline">View All</Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
