'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { AssignmentType } from '../../types';
import { isPrivilegedTeacher } from '../../utils/permissions';

export default function CreateAssignmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: AssignmentType.ESSAY,
    maxPoints: 100,
    dueDate: '',
    courseId: '1'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not privileged
  if (!loading && !isPrivilegedTeacher(user)) {
    router.push('/assignments');
    return null;
  }

  const handleSubmit = async (isPublished: boolean) => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create assignment
      const newAssignment = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        maxPoints: formData.maxPoints,
        dueDate: new Date(formData.dueDate).toISOString(),
        isPublished,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseId: formData.courseId,
        teacherId: user!.id
      };

      // Store in localStorage
      const existing = JSON.parse(localStorage.getItem('lms_assignments') || '[]');
      existing.push(newAssignment);
      localStorage.setItem('lms_assignments', JSON.stringify(existing));

      // Broadcast update
      try {
        const { publish } = await import('../../utils/stream');
        publish({ type: 'assignments:updated' });
      } catch {}

      router.push('/assignments');
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Failed to create assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <Link href="/assignments" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Assignments
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
            <p className="text-gray-600 mt-1">Set up a new assignment for your students.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                  <CardDescription>Provide the essential information about the assignment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Assignment Title *
                    </label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Essay on Climate Change"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what students need to do..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssignmentType }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={AssignmentType.ESSAY}>Essay</option>
                        <option value={AssignmentType.MULTIPLE_CHOICE}>Multiple Choice</option>
                        <option value={AssignmentType.PROJECT}>Project</option>
                        <option value={AssignmentType.PRESENTATION}>Presentation</option>
                        <option value={AssignmentType.LAB}>Lab</option>
                        <option value={AssignmentType.OTHER}>Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="maxPoints" className="block text-sm font-medium text-gray-700 mb-1">
                        Max Points
                      </label>
                      <Input
                        id="maxPoints"
                        type="number"
                        value={formData.maxPoints}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: parseInt(e.target.value) }))}
                        min="1"
                      />
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <Input
                        id="dueDate"
                        type="datetime-local"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSubmit(false)}
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmit(true)}
                      disabled={isSubmitting}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Publish Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
