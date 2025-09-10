'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, AlertCircle, Info, MessageSquare, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'ANNOUNCEMENT' | 'ASSIGNMENT' | 'GRADE' | 'DISCUSSION' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

interface NotificationSystemProps {
  userId: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'ANNOUNCEMENT':
      return Bell;
    case 'ASSIGNMENT':
      return MessageSquare;
    case 'GRADE':
      return Award;
    case 'DISCUSSION':
      return MessageSquare;
    case 'SYSTEM':
      return Info;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'ANNOUNCEMENT':
      return 'bg-blue-100 text-blue-600';
    case 'ASSIGNMENT':
      return 'bg-orange-100 text-orange-600';
    case 'GRADE':
      return 'bg-green-100 text-green-600';
    case 'DISCUSSION':
      return 'bg-purple-100 text-purple-600';
    case 'SYSTEM':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-blue-100 text-blue-600';
  }
};

export default function NotificationSystem({ userId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.filter(notification => notification.id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Set up real-time connection (mock implementation)
  useEffect(() => {
    fetchNotifications();

    // Mock real-time notifications
    const interval = setInterval(() => {
      // Simulate receiving new notifications
      const hasNewNotifications = Math.random() > 0.8;
      if (hasNewNotifications) {
        const mockNotification: Notification = {
          id: `mock-${Date.now()}`,
          title: 'New Assignment Posted',
          content: 'Check out the new assignment in Advanced Mathematics',
          type: 'ASSIGNMENT',
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [mockNotification, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Format time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className=\"relative\">
      {/* Notification Bell */}
      <Button
        variant=\"ghost\"
        size=\"sm\"
        onClick={() => setIsOpen(!isOpen)}
        className=\"relative p-2 rounded-full hover:bg-gray-100\"
      >
        <Bell className=\"h-5 w-5\" />
        {unreadCount > 0 && (
          <Badge
            className=\"absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white\"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className=\"fixed inset-0 z-40\"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <Card className=\"absolute right-0 mt-2 w-80 sm:w-96 max-h-96 z-50 shadow-lg border\">
            <CardHeader className=\"pb-3\">
              <div className=\"flex items-center justify-between\">
                <CardTitle className=\"text-lg\">Notifications</CardTitle>
                <div className=\"flex items-center space-x-2\">
                  {unreadCount > 0 && (
                    <Button
                      variant=\"ghost\"
                      size=\"sm\"
                      onClick={markAllAsRead}
                      className=\"text-xs text-blue-600 hover:text-blue-800\"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant=\"ghost\"
                    size=\"sm\"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className=\"h-4 w-4\" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className=\"p-0\">
              <div className=\"max-h-80 overflow-y-auto\">
                {loading ? (
                  <div className=\"p-4 text-center text-gray-500\">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className=\"p-4 text-center text-gray-500\">
                    <Bell className=\"h-8 w-8 mx-auto mb-2 text-gray-300\" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className=\"divide-y divide-gray-200\">
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const iconColor = getNotificationColor(notification.type);

                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className=\"flex items-start space-x-3\">
                            <div className={`p-2 rounded-full ${iconColor} flex-shrink-0`}>
                              <Icon className=\"h-4 w-4\" />
                            </div>
                            <div className=\"flex-1 min-w-0\">
                              <div className=\"flex items-start justify-between\">
                                <div className=\"flex-1\">
                                  <p className={`text-sm font-medium text-gray-900 ${
                                    !notification.isRead ? 'font-semibold' : ''
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className=\"text-sm text-gray-500 mt-1 line-clamp-2\">
                                    {notification.content}
                                  </p>
                                  <p className=\"text-xs text-gray-400 mt-2\">
                                    {getTimeAgo(notification.createdAt)}
                                  </p>
                                </div>
                                <div className=\"flex items-center space-x-1 ml-2\">
                                  {!notification.isRead && (
                                    <Button
                                      variant=\"ghost\"
                                      size=\"sm\"
                                      onClick={() => markAsRead(notification.id)}
                                      className=\"p-1 h-6 w-6\"
                                      title=\"Mark as read\"
                                    >
                                      <Check className=\"h-3 w-3\" />
                                    </Button>
                                  )}
                                  <Button
                                    variant=\"ghost\"
                                    size=\"sm\"
                                    onClick={() => deleteNotification(notification.id)}
                                    className=\"p-1 h-6 w-6 text-red-500 hover:text-red-700\"
                                    title=\"Delete\"
                                  >
                                    <X className=\"h-3 w-3\" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className=\"p-3 border-t bg-gray-50\">
                  <Button
                    variant=\"ghost\"
                    size=\"sm\"
                    className=\"w-full text-center text-blue-600 hover:text-blue-800\"
                    onClick={() => {
                      setIsOpen(false);
                      // Navigate to notifications page
                      window.location.href = '/notifications';
                    }}
                  >
                    View all notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
