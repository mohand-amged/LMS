'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Plus, Search, Bell, Megaphone, AlertTriangle, Info, CheckCircle, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { Announcement, Priority, UserRole, NotificationType, Notification } from '../types';

interface AnnouncementWithDetails extends Announcement {
  course?: {
    id: string;
    title: string;
    code: string;
  };
  isRead?: boolean;
}

export default function AnnouncementsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<AnnouncementWithDetails[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<AnnouncementWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'announcements' | 'notifications'>('announcements');

  // Mock data for announcements and notifications
  useEffect(() => {
    if (user) {
      const mockAnnouncements: AnnouncementWithDetails[] = [
        {
          id: '1',
          title: 'Midterm Exam Schedule Released',
          content: 'The midterm examination schedule has been posted. Please check your course page for specific dates and times. The exam period will run from March 15-22, 2024. Make sure to review the examination policies and bring valid ID to all exams.',
          priority: Priority.HIGH,
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
          courseId: '1',
          authorId: 'demo-teacher-1',
          isRead: false,
          course: {
            id: '1',
            title: 'Introduction to Mathematics',
            code: 'MATH101'
          }
        },
        {
          id: '2',
          title: 'System Maintenance Notice',
          content: 'The LMS will be undergoing scheduled maintenance on Saturday, January 27th from 2:00 AM to 6:00 AM EST. During this time, the system will be unavailable. Please plan your coursework accordingly.',
          priority: Priority.NORMAL,
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-18'),
          authorId: 'admin-1',
          isRead: true
        },
        {
          id: '3',
          title: 'Assignment Extension - Climate Change Essay',
          content: 'Due to the recent weather conditions, the Climate Change essay assignment deadline has been extended by 3 days. The new due date is February 1st, 2024 at 11:59 PM.',
          priority: Priority.URGENT,
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22'),
          courseId: '3',
          authorId: 'demo-teacher-1',
          isRead: false,
          course: {
            id: '3',
            title: 'Science Fundamentals',
            code: 'SCI101'
          }
        },
        {
          id: '4',
          title: 'New Study Materials Available',
          content: 'Additional study resources for the upcoming literature quiz have been uploaded to the course materials section. These include character analysis guides and theme summaries for chapters 1-10.',
          priority: Priority.LOW,
          createdAt: new Date('2024-01-19'),
          updatedAt: new Date('2024-01-19'),
          courseId: '2',
          authorId: 'demo-teacher-1',
          isRead: true,
          course: {
            id: '2',
            title: 'English Literature',
            code: 'ENG201'
          }
        }
      ];

      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New Assignment Posted',
          content: 'A new assignment "Math Problem Set 2" has been posted in Introduction to Mathematics',
          type: NotificationType.ASSIGNMENT,
          isRead: false,
          createdAt: new Date('2024-01-21T10:30:00'),
          userId: user.id
        },
        {
          id: '2',
          title: 'Grade Posted',
          content: 'Your grade for "Algebra Basics Quiz" has been posted: 85/100 (85%)',
          type: NotificationType.GRADE,
          isRead: false,
          createdAt: new Date('2024-01-20T16:45:00'),
          userId: user.id
        },
        {
          id: '3',
          title: 'Discussion Reply',
          content: 'John Smith replied to your post in "Algebra Help - Need help with linear equations"',
          type: NotificationType.DISCUSSION,
          isRead: true,
          createdAt: new Date('2024-01-19T14:20:00'),
          userId: user.id
        },
        {
          id: '4',
          title: 'Course Enrollment',
          content: 'You have been successfully enrolled in "Science Fundamentals"',
          type: NotificationType.SYSTEM,
          isRead: true,
          createdAt: new Date('2024-01-18T09:00:00'),
          userId: user.id
        }
      ];

      setAnnouncements(mockAnnouncements);
      if (user.role === UserRole.STUDENT) {
        setNotifications(mockNotifications);
      }
    }
  }, [user]);

  // Filter announcements based on search and filters
  useEffect(() => {
    let filtered = announcements;

    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(announcement => announcement.priority === priorityFilter);
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, priorityFilter]);

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

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return <Badge variant="destructive">Urgent</Badge>;
      case Priority.HIGH:
        return <Badge variant="warning">High</Badge>;
      case Priority.NORMAL:
        return <Badge variant="info">Normal</Badge>;
      case Priority.LOW:
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case Priority.HIGH:
        return <Megaphone className="h-5 w-5 text-orange-600" />;
      case Priority.NORMAL:
        return <Info className="h-5 w-5 text-blue-600" />;
      case Priority.LOW:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ASSIGNMENT:
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case NotificationType.GRADE:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case NotificationType.DISCUSSION:
        return <User className="h-4 w-4 text-purple-600" />;
      case NotificationType.SYSTEM:
        return <Bell className="h-4 w-4 text-gray-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const unreadAnnouncements = announcements.filter(a => !a.isRead).length;

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
              <span className="text-sm font-medium text-gray-900">Announcements</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Announcements & Notifications</h1>
              <p className="text-gray-600 mt-1">
                Stay up-to-date with important course announcements and system notifications
              </p>
            </div>
            {user.role === UserRole.TEACHER && (
              <Link href="/announcements/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'announcements'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Announcements
                {unreadAnnouncements > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {unreadAnnouncements}
                  </Badge>
                )}
              </button>
              {user.role === UserRole.STUDENT && (
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'notifications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Notifications
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </button>
              )}
            </nav>
          </div>

          {activeTab === 'announcements' && (
            <>
              {/* Search and Filters */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search announcements..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ALL">All Priorities</option>
                        <option value={Priority.URGENT}>Urgent</option>
                        <option value={Priority.HIGH}>High</option>
                        <option value={Priority.NORMAL}>Normal</option>
                        <option value={Priority.LOW}>Low</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Announcements List */}
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <Card 
                    key={announcement.id} 
                    className={`hover:shadow-lg transition-shadow ${!announcement.isRead ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            {getPriorityIcon(announcement.priority)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{announcement.title}</CardTitle>
                              {getPriorityBadge(announcement.priority)}
                              {!announcement.isRead && (
                                <Badge variant="info">New</Badge>
                              )}
                            </div>
                            <CardDescription className="text-sm text-gray-600 mb-2">
                              {announcement.course ? 
                                `${announcement.course.code} - ${announcement.course.title}` : 
                                'System Announcement'
                              }
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 mb-4">{announcement.content}</p>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{announcement.createdAt.toLocaleDateString()}</span>
                        <span>{announcement.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAnnouncements.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    {searchTerm || priorityFilter !== 'ALL'
                      ? 'No announcements match your search criteria.'
                      : 'No announcements available.'
                    }
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'notifications' && user.role === UserRole.STUDENT && (
            <>
              {/* Notifications List */}
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`hover:shadow-md transition-shadow cursor-pointer ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <span className="text-xs text-gray-500">
                                {notification.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-blue-800' : 'text-gray-600'}`}>
                            {notification.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">No notifications yet</div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
