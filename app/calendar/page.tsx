'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CalendarDays, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '../types';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'assignment' | 'quiz' | 'lesson' | 'announcement' | 'exam';
  courseId?: string;
  courseName?: string;
  isCompleted?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mock calendar events
  useEffect(() => {
    if (user) {
      const now = new Date();
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Math Assignment Due',
          description: 'Complete algebra problem set chapter 2',
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          type: 'assignment',
          courseId: '1',
          courseName: 'Introduction to Mathematics',
          priority: 'high',
          isCompleted: false
        },
        {
          id: '2',
          title: 'Literature Quiz',
          description: 'Quiz on chapters 1-5 of To Kill a Mockingbird',
          date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          type: 'quiz',
          courseId: '2',
          courseName: 'English Literature',
          priority: 'medium',
          isCompleted: false
        },
        {
          id: '3',
          title: 'Science Lab Session',
          description: 'Photosynthesis experiment in Lab Room 203',
          date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          type: 'lesson',
          courseId: '3',
          courseName: 'Science Fundamentals',
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Midterm Exam Period Begins',
          description: 'First day of midterm examinations',
          date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          type: 'exam',
          priority: 'high'
        },
        {
          id: '5',
          title: 'Assignment: Climate Change Essay',
          description: 'Extended deadline - submit your 500-word essay',
          date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          type: 'assignment',
          courseId: '3',
          courseName: 'Science Fundamentals',
          priority: 'high',
          isCompleted: false
        }
      ];

      setEvents(mockEvents);
    }
  }, [user]);

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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'assignment': return 'bg-red-100 text-red-800 border-red-200';
      case 'quiz': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lesson': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'announcement': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="warning">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return null;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
              <span className="text-sm font-medium text-gray-900">Calendar</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
              <p className="text-gray-600 mt-1">
                Keep track of assignments, quizzes, and important dates
              </p>
            </div>
            {user.role === UserRole.TEACHER && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Today
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderMonthView()}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.length === 0 ? (
                      <p className="text-gray-500 text-sm">No upcoming events</p>
                    ) : (
                      upcomingEvents.map(event => (
                        <div key={event.id} className="border-l-4 pl-3 py-2" style={{
                          borderLeftColor: event.type === 'assignment' ? '#ef4444' :
                            event.type === 'quiz' ? '#f59e0b' :
                            event.type === 'lesson' ? '#3b82f6' : '#8b5cf6'
                        }}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {event.courseName && (
                                <p className="text-xs text-gray-500 mt-1">{event.courseName}</p>
                              )}
                            </div>
                            {getPriorityBadge(event.priority)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Details */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).length === 0 ? (
                        <p className="text-gray-500 text-sm">No events scheduled</p>
                      ) : (
                        getEventsForDate(selectedDate).map(event => (
                          <div key={event.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                            </div>
                            {event.description && (
                              <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {event.courseName && (
                                <>
                                  <span>•</span>
                                  <span>{event.courseName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assignments Due</span>
                      <span className="font-medium">
                        {events.filter(e => 
                          e.type === 'assignment' && 
                          new Date(e.date) >= new Date() && 
                          new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quizzes</span>
                      <span className="font-medium">
                        {events.filter(e => 
                          e.type === 'quiz' && 
                          new Date(e.date) >= new Date() && 
                          new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Classes</span>
                      <span className="font-medium">
                        {events.filter(e => 
                          e.type === 'lesson' && 
                          new Date(e.date) >= new Date() && 
                          new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
