'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  User, 
  Calendar, 
  Clock,
  Star,
  Download,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { UserRole, Course, Assignment, Discussion } from '../types';

interface SearchResult {
  id: string;
  type: 'course' | 'lesson' | 'assignment' | 'discussion' | 'resource' | 'user';
  title: string;
  description: string;
  content?: string;
  url: string;
  author: string;
  course?: string;
  createdAt: Date;
  relevanceScore: number;
  metadata?: any;
}

interface SearchFilters {
  type: 'all' | 'course' | 'lesson' | 'assignment' | 'discussion' | 'resource' | 'user';
  dateRange: 'all' | 'week' | 'month' | '3months' | 'year';
  sortBy: 'relevance' | 'date' | 'title';
  author: string;
  course: string;
}

export default function SearchPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    dateRange: 'all',
    sortBy: 'relevance',
    author: '',
    course: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Perform initial search if query parameter is provided
  useEffect(() => {
    if (initialQuery && user) {
      performSearch(initialQuery);
    }
  }, [initialQuery, user]);

  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'course',
      title: 'Advanced Mathematics',
      description: 'Comprehensive course covering calculus, linear algebra, and differential equations.',
      url: '/courses/1',
      author: 'Prof. John Smith',
      createdAt: new Date(2023, 8, 1),
      relevanceScore: 0.95,
      metadata: { students: 45, lessons: 12 }
    },
    {
      id: '2',
      type: 'lesson',
      title: 'Introduction to Calculus',
      description: 'Learn the fundamentals of calculus including limits, derivatives, and basic integration.',
      content: 'Calculus is a branch of mathematics that deals with continuous change...',
      url: '/courses/1/lessons/2',
      author: 'Prof. John Smith',
      course: 'Advanced Mathematics',
      createdAt: new Date(2023, 9, 15),
      relevanceScore: 0.88,
      metadata: { duration: '45 minutes', type: 'video' }
    },
    {
      id: '3',
      type: 'assignment',
      title: 'Calculus Problem Set 1',
      description: 'Practice problems covering limits and basic derivatives.',
      url: '/assignments/3',
      author: 'Prof. John Smith',
      course: 'Advanced Mathematics',
      createdAt: new Date(2023, 9, 20),
      relevanceScore: 0.82,
      metadata: { dueDate: new Date(2023, 10, 5), points: 100 }
    },
    {
      id: '4',
      type: 'discussion',
      title: 'Help with Calculus Homework',
      description: 'Student asking for help understanding derivative calculations.',
      content: 'I\'m having trouble with problem 3 on the calculus assignment...',
      url: '/discussions/4',
      author: 'Emma Davis',
      course: 'Advanced Mathematics',
      createdAt: new Date(2023, 10, 2),
      relevanceScore: 0.75,
      metadata: { replies: 8, solved: true }
    },
    {
      id: '5',
      type: 'resource',
      title: 'Calculus Reference Sheet',
      description: 'Quick reference for common calculus formulas and rules.',
      url: '/resources/5',
      author: 'Prof. John Smith',
      course: 'Advanced Mathematics',
      createdAt: new Date(2023, 9, 10),
      relevanceScore: 0.78,
      metadata: { fileType: 'PDF', downloads: 234 }
    },
    {
      id: '6',
      type: 'user',
      title: 'Prof. John Smith',
      description: 'Mathematics Professor specializing in calculus and linear algebra.',
      url: '/users/6',
      author: 'System',
      createdAt: new Date(2023, 6, 1),
      relevanceScore: 0.70,
      metadata: { role: UserRole.TEACHER, courses: 3 }
    }
  ];

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Mock API call with filtering
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        (result.content && result.content.toLowerCase().includes(query.toLowerCase()))
      );

      // Apply filters
      if (filters.type !== 'all') {
        filteredResults = filteredResults.filter(result => result.type === filters.type);
      }

      if (filters.author) {
        filteredResults = filteredResults.filter(result => 
          result.author.toLowerCase().includes(filters.author.toLowerCase())
        );
      }

      if (filters.course) {
        filteredResults = filteredResults.filter(result => 
          result.course && result.course.toLowerCase().includes(filters.course.toLowerCase())
        );
      }

      if (filters.dateRange !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filters.dateRange) {
          case 'week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
          case '3months':
            cutoffDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        filteredResults = filteredResults.filter(result => result.createdAt >= cutoffDate);
      }

      // Sort results
      filteredResults.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          case 'relevance':
          default:
            return b.relevanceScore - a.relevanceScore;
        }
      });

      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case 'lesson':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'assignment':
        return <Calendar className="h-5 w-5 text-orange-600" />;
      case 'discussion':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      case 'resource':
        return <Download className="h-5 w-5 text-indigo-600" />;
      case 'user':
        return <User className="h-5 w-5 text-gray-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      course: 'bg-blue-100 text-blue-800',
      lesson: 'bg-green-100 text-green-800',
      assignment: 'bg-orange-100 text-orange-800',
      discussion: 'bg-purple-100 text-purple-800',
      resource: 'bg-indigo-100 text-indigo-800',
      user: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || colors.user}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

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
              <span className="text-sm font-medium text-gray-900">Search</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Search</h1>
            <p className="text-gray-600 mt-1">
              Find courses, lessons, assignments, discussions, and more
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch}>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search for courses, lessons, assignments, discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-lg"
                    />
                  </div>
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Filters */}
          {hasSearched && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="course">Courses</option>
                      <option value="lesson">Lessons</option>
                      <option value="assignment">Assignments</option>
                      <option value="discussion">Discussions</option>
                      <option value="resource">Resources</option>
                      <option value="user">Users</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                      <option value="3months">Past 3 Months</option>
                      <option value="year">Past Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <Input
                      placeholder="Filter by author..."
                      value={filters.author}
                      onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                      className="w-40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <Input
                      placeholder="Filter by course..."
                      value={filters.course}
                      onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                      className="w-40"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={() => performSearch(searchQuery)}
                      disabled={isSearching}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {hasSearched && (
            <div>
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="text-lg text-gray-600">Searching...</div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {results.length} result{results.length !== 1 ? 's' : ''} 
                      {searchQuery && ` for "${searchQuery}"`}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {results.map((result) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              {getResultIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Link
                                  href={result.url}
                                  className="text-lg font-semibold text-blue-600 hover:text-blue-800 truncate"
                                >
                                  {result.title}
                                </Link>
                                {getTypeBadge(result.type)}
                              </div>
                              
                              <p className="text-gray-600 mb-2">{result.description}</p>
                              
                              {result.content && (
                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                  {result.content}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {result.author}
                                </span>
                                
                                {result.course && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {result.course}
                                  </span>
                                )}
                                
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {result.createdAt.toLocaleDateString()}
                                </span>

                                {result.metadata && (
                                  <>
                                    {result.metadata.students && (
                                      <span>{result.metadata.students} students</span>
                                    )}
                                    {result.metadata.replies && (
                                      <span>{result.metadata.replies} replies</span>
                                    )}
                                    {result.metadata.downloads && (
                                      <span>{result.metadata.downloads} downloads</span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0 text-right">
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <Star className="h-3 w-3 fill-current text-yellow-400" />
                                {(result.relevanceScore * 100).toFixed(0)}%
                              </div>
                              <Link href={result.url}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {results.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                        <Button variant="outline" onClick={() => {
                          setFilters({
                            type: 'all',
                            dateRange: 'all',
                            sortBy: 'relevance',
                            author: '',
                            course: ''
                          });
                          performSearch(searchQuery);
                        }}>
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Empty State */}
          {!hasSearched && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search the Learning Platform</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Find courses, lessons, assignments, discussions, resources, and users across the entire platform.
                Use the search box above to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
