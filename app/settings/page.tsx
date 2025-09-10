'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Shield, 
  Globe, 
  Monitor, 
  Moon, 
  Sun,
  Volume2,
  Mail,
  Smartphone,
  Eye,
  Lock,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '../types';

interface AppSettings {
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  notifications: {
    desktop: boolean;
    email: boolean;
    sound: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
    dataSharing: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'accessibility'>('general');
  const [settings, setSettings] = useState<AppSettings>({
    appearance: {
      theme: 'system',
      language: 'en',
      timezone: 'America/New_York',
      fontSize: 'medium'
    },
    notifications: {
      desktop: true,
      email: true,
      sound: false,
      weeklyDigest: true
    },
    privacy: {
      analytics: true,
      crashReporting: true,
      dataSharing: false
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
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

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'accessibility', name: 'Accessibility', icon: Eye },
  ] as const;

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
              <span className="text-sm font-medium text-gray-900">Settings</span>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">
                  Customize your application preferences and behavior
                </p>
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                            activeTab === tab.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Appearance Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Appearance
                      </CardTitle>
                      <CardDescription>Customize the look and feel of the application</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: 'light', icon: Sun, label: 'Light' },
                              { value: 'dark', icon: Moon, label: 'Dark' },
                              { value: 'system', icon: Monitor, label: 'System' }
                            ].map((option) => {
                              const Icon = option.icon;
                              return (
                                <button
                                  key={option.value}
                                  onClick={() => updateSetting('appearance', 'theme', option.value)}
                                  className={`flex items-center justify-center p-3 rounded-lg border-2 ${
                                    settings.appearance.theme === option.value
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <Icon className="h-5 w-5 mr-2" />
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Size
                          </label>
                          <select
                            value={settings.appearance.fontSize}
                            onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={settings.appearance.language}
                            onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            value={settings.appearance.timezone}
                            onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Configure how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Monitor className="h-5 w-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-medium">Desktop Notifications</h4>
                            <p className="text-xs text-gray-500">Show notifications in your browser</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.desktop}
                          onChange={(e) => updateSetting('notifications', 'desktop', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-medium">Email Notifications</h4>
                            <p className="text-xs text-gray-500">Receive notifications via email</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Volume2 className="h-5 w-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-medium">Sound Alerts</h4>
                            <p className="text-xs text-gray-500">Play sounds for notifications</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.sound}
                          onChange={(e) => updateSetting('notifications', 'sound', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-medium">Weekly Digest</h4>
                            <p className="text-xs text-gray-500">Receive a weekly summary email</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.weeklyDigest}
                          onChange={(e) => updateSetting('notifications', 'weeklyDigest', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'privacy' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Analytics & Usage Data</h4>
                          <p className="text-xs text-gray-500">Help improve the platform by sharing usage data</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.analytics}
                          onChange={(e) => updateSetting('privacy', 'analytics', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Crash Reporting</h4>
                          <p className="text-xs text-gray-500">Send error reports to help fix issues</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.crashReporting}
                          onChange={(e) => updateSetting('privacy', 'crashReporting', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Data Sharing</h4>
                          <p className="text-xs text-gray-500">Share anonymized data with third parties</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.dataSharing}
                          onChange={(e) => updateSetting('privacy', 'dataSharing', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <hr className="my-6" />

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Data Management</h4>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export My Data
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'accessibility' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Accessibility
                    </CardTitle>
                    <CardDescription>Configure accessibility features to enhance usability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">High Contrast Mode</h4>
                          <p className="text-xs text-gray-500">Increase contrast for better visibility</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.accessibility.highContrast}
                          onChange={(e) => updateSetting('accessibility', 'highContrast', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Reduced Motion</h4>
                          <p className="text-xs text-gray-500">Minimize animations and transitions</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.accessibility.reducedMotion}
                          onChange={(e) => updateSetting('accessibility', 'reducedMotion', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Screen Reader Support</h4>
                          <p className="text-xs text-gray-500">Optimize for screen reading software</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.accessibility.screenReader}
                          onChange={(e) => updateSetting('accessibility', 'screenReader', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
