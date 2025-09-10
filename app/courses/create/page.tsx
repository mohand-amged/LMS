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
import { CreateCourseData, CourseStatus, UserRole } from '../../types';
import { isPrivilegedTeacher } from '../../utils/permissions';

export default function CreateCoursePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    code: '',
    imageUrl: '',
    category: '',
    startDate: undefined,
    endDate: undefined
  });
  const [errors, setErrors] = useState<Partial<CreateCourseData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not privileged email
  if (!loading && !isPrivilegedTeacher(user)) {
    router.push('/courses');
    return null;
  }

  const handleInputChange = (field: keyof CreateCourseData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCourseData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Course code is required';
    } else if (!/^[A-Z]{2,4}\d{2,3}$/.test(formData.code.toUpperCase())) {
      newErrors.code = 'Course code should be in format like "MATH101" or "ENG201"';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: CourseStatus) => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      const courseData = {
        ...formData,
        code: formData.code.toUpperCase(),
        status,
        teacherId: user!.id
      };

      console.log('Creating course:', courseData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for now
      const existingCourses = JSON.parse(localStorage.getItem('lms_courses') || '[]');
      const newCourse = {
        ...courseData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      existingCourses.push(newCourse);
      localStorage.setItem('lms_courses', JSON.stringify(existingCourses));

      // Redirect to courses page
      router.push('/courses');
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course. Please try again.');
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
              <Link href="/courses" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Courses
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.fullName}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600 mt-1">
              Set up a new course for your students with all the necessary details.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the essential details about your course.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Title *
                      </label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Introduction to Mathematics"
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Code *
                      </label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        placeholder="e.g., MATH101"
                        className={errors.code ? 'border-red-500' : ''}
                      />
                      {errors.code && (
                        <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Course Description *
                    </label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what students will learn in this course..."
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a category</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                        <option value="Geography">Geography</option>
                        <option value="Art">Art</option>
                        <option value="Physical Education">Physical Education</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Image URL
                      </label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/course-image.jpg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                  <CardDescription>
                    Set the duration for your course (optional).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </div>

                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                        className={errors.endDate ? 'border-red-500' : ''}
                      />
                      {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                      )}
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
                      onClick={() => handleSubmit(CourseStatus.DRAFT)}
                      disabled={isSubmitting}
                      className="sm:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmit(CourseStatus.PUBLISHED)}
                      disabled={isSubmitting}
                      className="sm:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Publish Course
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
