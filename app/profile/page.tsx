'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { User, Mail, Calendar, Shield, Settings, Camera, Save, Lock, Bell, Palette, Globe } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '../types';

interface ProfileData {
  fullName: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: UserRole;
  grade?: string;
  joinDate: Date;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      announcements: boolean;
      grades: boolean;
      discussions: boolean;
    };
    appearance: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      timezone: string;
    };
    privacy: {
      profileVisible: boolean;
      showGrades: boolean;
      allowMessages: boolean;
    };
  };
  stats: {
    coursesEnrolled: number;
    assignmentsCompleted: number;
    discussionPosts: number;
    averageGrade: number;
  };
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'preferences'>('profile');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mock profile data
  useEffect(() => {
    if (user) {
      const mockProfile: ProfileData = {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        bio: user.role === UserRole.TEACHER 
          ? 'Passionate educator with 10+ years of experience in mathematics and science education. I believe in making learning engaging and accessible for all students.'
          : 'Dedicated student pursuing excellence in academics. Interested in mathematics, science, and technology.',
        avatar: undefined,
        role: user.role,
        grade: user.role === UserRole.STUDENT ? '2nd Grade' : undefined,
        joinDate: user.createdAt,
        preferences: {
          notifications: {
            email: true,
            push: true,
            announcements: true,
            grades: true,
            discussions: false
          },
          appearance: {
            theme: 'system',
            language: 'en',
            timezone: 'America/New_York'
          },
          privacy: {
            profileVisible: true,
            showGrades: user.role === UserRole.STUDENT,
            allowMessages: true
          }
        },
        stats: {
          coursesEnrolled: user.role === UserRole.TEACHER ? 3 : 4,
          assignmentsCompleted: user.role === UserRole.TEACHER ? 45 : 12,
          discussionPosts: user.role === UserRole.TEACHER ? 78 : 23,
          averageGrade: user.role === UserRole.TEACHER ? 0 : 84.5
        }
      };

      setProfileData(mockProfile);
    }
  }, [user]);

  const handleSave = async () => {
    if (!profileData) return;

    setIsSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = (category: keyof ProfileData['preferences'], key: string, value: any) => {
    if (!profileData) return;

    setProfileData(prev => ({
      ...prev!,
      preferences: {
        ...prev!.preferences,
        [category]: {
          ...prev!.preferences[category],
          [key]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !profileData) {
    return null;
  }

  const getRoleBadge = (role: UserRole) => {
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
              <span className="text-sm font-medium text-gray-900">Profile</span>
            </div>
            <div className="flex items-center space-x-4">
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
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        {profileData.avatar ? (
                          <img src={profileData.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 text-gray-600" />
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700">
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-lg">{profileData.fullName}</h3>
                    <p className="text-gray-600 text-sm">@{profileData.username}</p>
                    <div className="mt-2 flex justify-center">
                      {getRoleBadge(profileData.role)}
                    </div>
                    {profileData.grade && (
                      <p className="text-sm text-gray-600 mt-2">{profileData.grade}</p>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{profileData.stats.coursesEnrolled}</p>
                        <p className="text-xs text-gray-600">
                          {user.role === UserRole.TEACHER ? 'Courses Teaching' : 'Courses Enrolled'}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{profileData.stats.assignmentsCompleted}</p>
                        <p className="text-xs text-gray-600">
                          {user.role === UserRole.TEACHER ? 'Assignments Created' : 'Assignments Done'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{profileData.stats.discussionPosts}</p>
                        <p className="text-xs text-gray-600">Discussion Posts</p>
                      </div>
                      {user.role === UserRole.STUDENT && (
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{profileData.stats.averageGrade.toFixed(1)}%</p>
                          <p className="text-xs text-gray-600">Average Grade</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Navigation */}
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === 'profile'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile Info
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === 'settings'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => setActiveTab('preferences')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === 'preferences'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Palette className="h-4 w-4 mr-3" />
                      Preferences
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal information and bio</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                              <Save className="h-4 w-4 mr-2" />
                              {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => setIsEditing(true)}>
                            Edit Profile
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <Input
                            value={profileData.fullName}
                            onChange={(e) => setProfileData(prev => ({ ...prev!, fullName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                          </label>
                          <Input
                            value={profileData.username}
                            onChange={(e) => setProfileData(prev => ({ ...prev!, username: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev!, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <Textarea
                          value={profileData.bio || ''}
                          onChange={(e) => setProfileData(prev => ({ ...prev!, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Tell others about yourself..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                          </label>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-gray-500 mr-2" />
                            {getRoleBadge(profileData.role)}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Member Since
                          </label>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">
                              {profileData.joinDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Button variant="outline" className="w-full justify-start">
                            <Lock className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            Last changed: {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Privacy Settings
                      </CardTitle>
                      <CardDescription>Control your privacy and data sharing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Profile Visibility</h4>
                            <p className="text-xs text-gray-500">Allow others to view your profile</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.preferences.privacy.profileVisible}
                            onChange={(e) => handlePreferenceChange('privacy', 'profileVisible', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </div>
                        {user.role === UserRole.STUDENT && (
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">Show Grades</h4>
                              <p className="text-xs text-gray-500">Display your grades on your profile</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={profileData.preferences.privacy.showGrades}
                              onChange={(e) => handlePreferenceChange('privacy', 'showGrades', e.target.checked)}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Allow Messages</h4>
                            <p className="text-xs text-gray-500">Let other users send you messages</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.preferences.privacy.allowMessages}
                            onChange={(e) => handlePreferenceChange('privacy', 'allowMessages', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription>Choose what notifications you want to receive</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Email Notifications</h4>
                            <p className="text-xs text-gray-500">Receive notifications via email</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.preferences.notifications.email}
                            onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Announcements</h4>
                            <p className="text-xs text-gray-500">Important announcements from teachers</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.preferences.notifications.announcements}
                            onChange={(e) => handlePreferenceChange('notifications', 'announcements', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Grade Updates</h4>
                            <p className="text-xs text-gray-500">When new grades are posted</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.preferences.notifications.grades}
                            onChange={(e) => handlePreferenceChange('notifications', 'grades', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Discussion Replies</h4>
                            <p className="text-xs text-gray-500">When someone replies to your posts</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.preferences.notifications.discussions}
                            onChange={(e) => handlePreferenceChange('notifications', 'discussions', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Appearance & Language
                      </CardTitle>
                      <CardDescription>Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <select
                            value={profileData.preferences.appearance.theme}
                            onChange={(e) => handlePreferenceChange('appearance', 'theme', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={profileData.preferences.appearance.language}
                            onChange={(e) => handlePreferenceChange('appearance', 'language', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={profileData.preferences.appearance.timezone}
                            onChange={(e) => handlePreferenceChange('appearance', 'timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="UTC">UTC</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
