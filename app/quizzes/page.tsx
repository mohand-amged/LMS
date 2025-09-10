'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Plus, Search, Clock, Users, CheckCircle, AlertCircle, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Quiz, UserRole, QuizAttempt, AttemptStatus } from '../types';
import { isPrivilegedTeacher } from '../utils/permissions';
import { useToast } from '../components/ui/toast';

interface QuizWithAttempt extends Quiz {
  attemptCount?: number;
  bestScore?: number;
  lastAttempt?: QuizAttempt;
}

export default function QuizzesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizWithAttempt[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizWithAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'completed' | 'draft'>('all');

  const { addToast } = useToast();

  // Load quizzes from localStorage
  const loadQuizzes = () => {
    const stored = localStorage.getItem('lms_quizzes');
    let allQuizzes: QuizWithAttempt[] = [];
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any[];
        allQuizzes = parsed.map(q => ({
          ...q,
          createdAt: new Date(q.createdAt),
          updatedAt: new Date(q.updatedAt),
          lastAttempt: q.lastAttempt ? {
            ...q.lastAttempt,
            startedAt: new Date(q.lastAttempt.startedAt),
            completedAt: q.lastAttempt.completedAt ? new Date(q.lastAttempt.completedAt) : undefined
          } : undefined
        }));
      } catch {}
    }
    
    // Seed if empty
    if (allQuizzes.length === 0 && user) {
      allQuizzes = [
        {
          id: '1',
          title: 'Algebra Basics Quiz',
          description: 'Test your understanding of basic algebraic concepts and operations.',
          timeLimit: 30,
          attempts: 3,
          randomize: false,
          showResults: true,
          isPublished: true,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05'),
          courseId: '1',
          questions: [
            {
              id: '1',
              type: 'MULTIPLE_CHOICE' as any,
              question: 'What is 2x + 3 = 11?',
              options: JSON.stringify(['x = 4', 'x = 5', 'x = 6', 'x = 7']),
              correctAnswer: JSON.stringify('x = 4'),
              points: 5,
              order: 1,
              quizId: '1'
            }
          ],
          attemptCount: user.role === UserRole.STUDENT ? 2 : 0,
          bestScore: user.role === UserRole.STUDENT ? 7 : undefined
        },
        {
          id: '2',
          title: 'Literature Analysis Quiz',
          description: 'Multiple choice questions about character analysis and themes in classic literature.',
          timeLimit: 45,
          attempts: 2,
          randomize: true,
          showResults: false,
          isPublished: true,
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-12'),
          courseId: '2',
          questions: [],
          attemptCount: user.role === UserRole.STUDENT ? 1 : 0,
          bestScore: user.role === UserRole.STUDENT ? 12 : undefined
        }
      ];
      localStorage.setItem('lms_quizzes', JSON.stringify(allQuizzes));
    }
    
    return allQuizzes;
  };

  useEffect(() => {
    if (!user) return;
    const allQuizzes = loadQuizzes();
    
    // Filter quizzes based on user role
    if (isPrivilegedTeacher(user)) {
      setQuizzes(allQuizzes);
    } else if (user.role === UserRole.TEACHER) {
      setQuizzes(allQuizzes);
    } else {
      setQuizzes(allQuizzes.filter(quiz => quiz.isPublished));
    }
  }, [user]);

  // Listen for quiz updates
  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const { subscribe } = await import('../utils/stream');
        unsub = subscribe((evt) => {
          if (evt.type === 'quizzes:updated' && user) {
            const allQuizzes = loadQuizzes();
            
            if (isPrivilegedTeacher(user)) {
              setQuizzes(allQuizzes);
            } else if (user.role === UserRole.TEACHER) {
              setQuizzes(allQuizzes);
            } else {
              setQuizzes(allQuizzes.filter(quiz => quiz.isPublished));
              // Show toast for students
              addToast({
                type: 'info',
                title: 'New Quiz Available',
                description: 'A new quiz has been published. Test your knowledge!',
                duration: 6000
              });
            }
          }
        });
      } catch {}
    })();
    return () => { try { unsub && unsub(); } catch {} };
  }, [user, addToast]);

  // Filter quizzes based on search and filters
  useEffect(() => {
    let filtered = quizzes;

    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(quiz => {
        switch (statusFilter) {
          case 'available':
            return quiz.isPublished && (!quiz.attemptCount || quiz.attemptCount < quiz.attempts);
          case 'completed':
            return quiz.attemptCount && quiz.attemptCount > 0;
          case 'draft':
            return !quiz.isPublished;
          default:
            return true;
        }
      });
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm, statusFilter]);

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

  const getStatusBadge = (quiz: QuizWithAttempt) => {
    if (!quiz.isPublished && user.role === UserRole.TEACHER) {
      return <Badge variant="warning">Draft</Badge>;
    }
    
    if (user.role === UserRole.STUDENT) {
      if (quiz.attemptCount === 0) {
        return <Badge variant="info">Not Started</Badge>;
      }
      if (quiz.attemptCount >= quiz.attempts) {
        return <Badge variant="secondary">Completed</Badge>;
      }
      return <Badge variant="success">In Progress</Badge>;
    }
    
    return <Badge variant="success">Published</Badge>;
  };

  const getScoreDisplay = (quiz: QuizWithAttempt) => {
    if (user.role === UserRole.TEACHER || !quiz.bestScore) return null;
    
    const percentage = quiz.lastAttempt ? 
      Math.round((quiz.lastAttempt.score / quiz.lastAttempt.maxScore) * 100) : 0;
    
    return (
      <div className="text-sm text-gray-600">
        Best Score: {quiz.bestScore} points ({percentage}%)
      </div>
    );
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
              <span className="text-sm font-medium text-gray-900">Quizzes</span>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.role === UserRole.TEACHER ? 'Quiz Management' : 'Quizzes'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === UserRole.TEACHER 
                  ? 'Create and manage quizzes and assessments for your courses'
                  : 'Take quizzes and track your progress'
                }
              </p>
            </div>
            {isPrivilegedTeacher(user) && (
              <Link href="/quizzes/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </Link>
            )}
          </div>

          {/* Summary Cards */}
          {user.role === UserRole.STUDENT && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quizzes.filter(q => q.isPublished).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quizzes.filter(q => q.attemptCount && q.attemptCount > 0).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Score</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quizzes.filter(q => q.bestScore).length > 0 
                          ? Math.round(quizzes.reduce((sum, q) => sum + (q.bestScore || 0), 0) / quizzes.filter(q => q.bestScore).length)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quizzes.filter(q => q.isPublished && (!q.attemptCount || q.attemptCount < q.attempts)).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    {user.role === UserRole.TEACHER ? (
                      <>
                        <option value="draft">Draft</option>
                        <option value="available">Published</option>
                      </>
                    ) : (
                      <>
                        <option value="available">Available</option>
                        <option value="completed">Completed</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {quiz.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(quiz)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{quiz.timeLimit} minutes</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{quiz.attempts} attempts</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{quiz.questions?.length || 0} questions</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span>{quiz.randomize ? 'Randomized' : 'Fixed order'}</span>
                      </div>
                    </div>

                    {user.role === UserRole.STUDENT && quiz.attemptCount !== undefined && (
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            Attempts: {quiz.attemptCount}/{quiz.attempts}
                          </span>
                          {quiz.lastAttempt && (
                            <span className="text-gray-600">
                              Last: {quiz.lastAttempt.completedAt?.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {getScoreDisplay(quiz)}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Created: {quiz.createdAt.toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/quizzes/${quiz.id}`}>
                          <Button variant="outline" size="sm">
                            {user.role === UserRole.TEACHER ? 'Manage' : 'View Details'}
                          </Button>
                        </Link>
                    {isPrivilegedTeacher(user) ? (
                          <Link href={`/quizzes/${quiz.id}/edit`}>
                            <Button size="sm">Edit</Button>
                          </Link>
                        ) : quiz.isPublished && (!quiz.attemptCount || quiz.attemptCount < quiz.attempts) ? (
                          <Link href={`/quizzes/${quiz.id}/take`}>
                            <Button size="sm">
                              {quiz.attemptCount === 0 ? 'Start Quiz' : 'Retake'}
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" disabled>
                            {quiz.attemptCount >= quiz.attempts ? 'Completed' : 'Unavailable'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'No quizzes match your search criteria.'
                  : user.role === UserRole.TEACHER
                    ? 'You haven\'t created any quizzes yet.'
                    : 'No quizzes are available at the moment.'
                }
              </div>
              {isPrivilegedTeacher(user) && !searchTerm && statusFilter === 'all' && (
                <Link href="/quizzes/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Quiz
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
