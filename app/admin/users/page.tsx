'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  User, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Shield, 
  UserPlus, 
  Mail, 
  Calendar,
  MoreVertical,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '../../types';

interface UserData {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  enrolledCourses: number;
  averageGrade?: number;
}

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Mock users data
  useEffect(() => {
    if (user && user.role === UserRole.ADMIN) {
      const mockUsers: UserData[] = [
        {
          id: '1',
          fullName: 'John Smith',
          username: 'jsmith',
          email: 'john.smith@school.edu',
          role: UserRole.TEACHER,
          isActive: true,
          lastLogin: new Date(2024, 0, 15),
          createdAt: new Date(2023, 8, 1),
          enrolledCourses: 3,
          averageGrade: undefined
        },
        {
          id: '2',
          fullName: 'Sarah Johnson',
          username: 'sjohnson',
          email: 'sarah.johnson@school.edu',
          role: UserRole.TEACHER,
          isActive: true,
          lastLogin: new Date(2024, 0, 14),
          createdAt: new Date(2023, 7, 15),
          enrolledCourses: 2,
          averageGrade: undefined
        },
        {
          id: '3',
          fullName: 'Emma Davis',
          username: 'edavis',
          email: 'emma.davis@student.edu',
          role: UserRole.STUDENT,
          isActive: true,
          lastLogin: new Date(2024, 0, 16),
          createdAt: new Date(2023, 8, 10),
          enrolledCourses: 5,
          averageGrade: 87.5
        },
        {
          id: '4',
          fullName: 'Michael Brown',
          username: 'mbrown',
          email: 'michael.brown@student.edu',
          role: UserRole.STUDENT,
          isActive: true,
          lastLogin: new Date(2024, 0, 13),
          createdAt: new Date(2023, 8, 12),
          enrolledCourses: 4,
          averageGrade: 92.3
        },
        {
          id: '5',
          fullName: 'Lisa Wilson',
          username: 'lwilson',
          email: 'lisa.wilson@student.edu',
          role: UserRole.STUDENT,
          isActive: false,
          lastLogin: new Date(2023, 11, 20),
          createdAt: new Date(2023, 8, 5),
          enrolledCourses: 3,
          averageGrade: 75.8
        },
        {
          id: '6',
          fullName: 'David Miller',
          username: 'dmiller',
          email: 'david.miller@school.edu',
          role: UserRole.ADMIN,
          isActive: true,
          lastLogin: new Date(2024, 0, 16),
          createdAt: new Date(2023, 6, 1),
          enrolledCourses: 0,
          averageGrade: undefined
        }
      ];

      setUsers(mockUsers);
      setIsLoading(false);
    }
  }, [user]);

  const filteredUsers = users.filter(userData => {
    const matchesSearch = userData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || userData.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && userData.isActive) ||
                         (statusFilter === 'inactive' && !userData.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge variant="success">Active</Badge>
      : <Badge variant="outline">Inactive</Badge>;
  };

  const handleActivateUser = async (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: true } : u
    ));
    alert('User activated successfully');
  };

  const handleDeactivateUser = async (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: false } : u
    ));
    alert('User deactivated successfully');
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('User deleted successfully');
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    alert(`User role updated to ${newRole}`);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== UserRole.ADMIN) {
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
              <span className="text-sm font-medium text-gray-900">User Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Admin: {user.fullName}
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
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">
                  Manage users, roles, and permissions across the platform
                </p>
              </div>
              <Button onClick={() => setShowAddUser(true)} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.isActive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Teachers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === UserRole.TEACHER).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === UserRole.STUDENT).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users by name, username, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value={UserRole.ADMIN}>Administrators</option>
                    <option value={UserRole.TEACHER}>Teachers</option>
                    <option value={UserRole.STUDENT}>Students</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Courses</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((userData) => (
                      <tr key={userData.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{userData.fullName}</p>
                              <p className="text-sm text-gray-500">@{userData.username}</p>
                              <p className="text-sm text-gray-500">{userData.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={userData.role}
                            onChange={(e) => handleRoleChange(userData.id, e.target.value as UserRole)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={UserRole.ADMIN}>Administrator</option>
                            <option value={UserRole.TEACHER}>Teacher</option>
                            <option value={UserRole.STUDENT}>Student</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(userData.isActive)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{userData.enrolledCourses} courses</p>
                            {userData.averageGrade && (
                              <p className="text-gray-500">Avg: {userData.averageGrade.toFixed(1)}%</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {userData.lastLogin ? userData.lastLogin.toLocaleDateString() : 'Never'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {userData.isActive ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateUser(userData.id)}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActivateUser(userData.id)}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(userData)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            {userData.id !== user.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(userData.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No users found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add User Modal Placeholder */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <p className="text-gray-600 mb-4">
              This would open a form to create a new user account with role selection.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                alert('User creation form would be implemented here');
                setShowAddUser(false);
              }}>
                Create User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
