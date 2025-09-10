'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Save, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { QuestionType } from '../../types';
import { isPrivilegedTeacher } from '../../utils/permissions';

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  order: number;
}

export default function CreateQuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    attempts: 3,
    randomize: false,
    showResults: true,
    courseId: '1'
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not privileged
  if (!loading && !isPrivilegedTeacher(user)) {
    router.push('/quizzes');
    return null;
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: QuestionType.MULTIPLE_CHOICE,
      question: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      points: 5,
      order: questions.length + 1
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (!formData.title.trim() || questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create quiz
      const newQuiz = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        timeLimit: formData.timeLimit,
        attempts: formData.attempts,
        randomize: formData.randomize,
        showResults: formData.showResults,
        isPublished,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseId: formData.courseId,
        questions: questions.map(q => ({
          ...q,
          options: JSON.stringify(q.options),
          correctAnswer: JSON.stringify(q.correctAnswer),
          quizId: Date.now().toString()
        }))
      };

      // Store in localStorage
      const existing = JSON.parse(localStorage.getItem('lms_quizzes') || '[]');
      existing.push(newQuiz);
      localStorage.setItem('lms_quizzes', JSON.stringify(existing));

      // Broadcast update
      try {
        const { publish } = await import('../../utils/stream');
        publish({ type: 'quizzes:updated' });
      } catch {}

      router.push('/quizzes');
    } catch (error) {
      console.error('Failed to create quiz:', error);
      alert('Failed to create quiz. Please try again.');
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
              <Link href="/quizzes" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Quizzes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
            <p className="text-gray-600 mt-1">Set up a new quiz for your students.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Details</CardTitle>
                  <CardDescription>Configure the basic settings for your quiz.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Quiz Title *
                    </label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Chapter 1 Quiz"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this quiz covers..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                        Time Limit (minutes)
                      </label>
                      <Input
                        id="timeLimit"
                        type="number"
                        value={formData.timeLimit}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                        min="1"
                      />
                    </div>

                    <div>
                      <label htmlFor="attempts" className="block text-sm font-medium text-gray-700 mb-1">
                        Max Attempts
                      </label>
                      <Input
                        id="attempts"
                        type="number"
                        value={formData.attempts}
                        onChange={(e) => setFormData(prev => ({ ...prev, attempts: parseInt(e.target.value) }))}
                        min="1"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Options</label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.randomize}
                          onChange={(e) => setFormData(prev => ({ ...prev, randomize: e.target.checked }))}
                          className="mr-2"
                        />
                        Randomize questions
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.showResults}
                          onChange={(e) => setFormData(prev => ({ ...prev, showResults: e.target.checked }))}
                          className="mr-2"
                        />
                        Show results after completion
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Questions</CardTitle>
                      <CardDescription>Add questions to your quiz.</CardDescription>
                    </div>
                    <Button type="button" onClick={addQuestion} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No questions added yet. Click "Add Question" to get started.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question Text *
                              </label>
                              <Textarea
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                                placeholder="Enter your question..."
                                rows={2}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Points
                                </label>
                                <Input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) })}
                                  min="1"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Type
                                </label>
                                <select
                                  value={question.type}
                                  onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuestionType })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                                  <option value={QuestionType.TRUE_FALSE}>True/False</option>
                                  <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                                </select>
                              </div>
                            </div>

                            {question.type === QuestionType.MULTIPLE_CHOICE && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Answer Options
                                </label>
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                      <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={question.correctAnswer === option}
                                        onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                                      />
                                      <Input
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...question.options];
                                          newOptions[optionIndex] = e.target.value;
                                          updateQuestion(question.id, { options: newOptions });
                                        }}
                                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      Publish Quiz
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
