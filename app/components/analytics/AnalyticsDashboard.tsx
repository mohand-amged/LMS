'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Activity,
  Download,
  Filter,
  Calendar,
  BarChart3,
} from 'lucide-react';

interface AnalyticsData {
  totalCourses: number;
  totalStudents: number;
  totalAssignments: number;
  averageGrade: number;
  completionRate: number;
  activityData: Array<{
    date: string;
    assignments?: number;
    grades?: number;
    announcements?: number;
    submissions?: number;
    quizzes?: number;
    discussions?: number;
    total: number;
  }>;
  performanceTrends?: Array<{
    period: string;
    average: number;
    completion: number;
  }>;
}

interface AnalyticsDashboardProps {
  userRole: 'TEACHER' | 'STUDENT' | 'ADMIN';
  userId: string;
  courseId?: string;
  type?: 'overview' | 'course' | 'student' | 'leaderboard';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function AnalyticsDashboard({
  userRole,
  userId,
  courseId,
  type = 'overview'
}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [type, courseId, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type,
        period: timeRange,
      });
      
      if (courseId) params.append('courseId', courseId);
      
      const response = await fetch(`/api/analytics?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
      
      if (type === 'leaderboard') {
        setLeaderboardData(data.analytics);
      } else {
        setAnalyticsData(data.analytics);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const dataToExport = analyticsData || leaderboardData;
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className=\"flex items-center justify-center h-64\">
        <div className=\"text-lg text-gray-600\">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className=\"pt-6\">
          <div className=\"text-center text-red-600\">
            <p>Error loading analytics: {error}</p>
            <Button onClick={fetchAnalyticsData} className=\"mt-4\">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'leaderboard' && leaderboardData) {
    return <LeaderboardView data={leaderboardData} onExport={exportData} />;
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className=\"pt-6\">
          <div className=\"text-center text-gray-600\">
            No analytics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className=\"space-y-6\">
      {/* Header Controls */}
      <div className=\"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4\">
        <div>
          <h2 className=\"text-2xl font-bold text-gray-900\">Analytics Dashboard</h2>
          <p className=\"text-gray-600\">Track performance and engagement metrics</p>
        </div>
        <div className=\"flex items-center gap-3\">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className=\"px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
          >
            <option value=\"7\">Last 7 days</option>
            <option value=\"30\">Last 30 days</option>
            <option value=\"90\">Last 3 months</option>
          </select>
          <Button onClick={exportData} variant=\"outline\" size=\"sm\">
            <Download className=\"h-4 w-4 mr-2\" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        <MetricCard
          title={userRole === 'TEACHER' ? 'Teaching Courses' : 'Enrolled Courses'}
          value={analyticsData.totalCourses}
          icon={BookOpen}
          color=\"bg-blue-100 text-blue-600\"
        />
        {userRole === 'TEACHER' && (
          <MetricCard
            title=\"Total Students\"
            value={analyticsData.totalStudents}
            icon={Users}
            color=\"bg-green-100 text-green-600\"
          />
        )}
        <MetricCard
          title=\"Assignments\"
          value={analyticsData.totalAssignments}
          icon={Activity}
          color=\"bg-purple-100 text-purple-600\"
        />
        <MetricCard
          title=\"Average Grade\"
          value={`${analyticsData.averageGrade}%`}
          icon={Award}
          color=\"bg-yellow-100 text-yellow-600\"
          trend={analyticsData.averageGrade >= 80 ? 'up' : 'down'}
        />
      </div>

      {/* Activity Chart */}
      {analyticsData.activityData && analyticsData.activityData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Daily activity for the last {timeRange} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"h-80\">
              <ResponsiveContainer width=\"100%\" height=\"100%\">
                <AreaChart data={analyticsData.activityData}>
                  <CartesianGrid strokeDasharray=\"3 3\" />
                  <XAxis 
                    dataKey=\"date\" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                    }}
                  />
                  {userRole === 'TEACHER' ? (
                    <>
                      <Area 
                        type=\"monotone\" 
                        dataKey=\"assignments\" 
                        stackId=\"1\"
                        stroke={COLORS[0]} 
                        fill={COLORS[0]} 
                        name=\"Assignments\"
                      />
                      <Area 
                        type=\"monotone\" 
                        dataKey=\"grades\" 
                        stackId=\"1\"
                        stroke={COLORS[1]} 
                        fill={COLORS[1]} 
                        name=\"Grades\"
                      />
                      <Area 
                        type=\"monotone\" 
                        dataKey=\"announcements\" 
                        stackId=\"1\"
                        stroke={COLORS[2]} 
                        fill={COLORS[2]} 
                        name=\"Announcements\"
                      />
                    </>
                  ) : (
                    <>
                      <Area 
                        type=\"monotone\" 
                        dataKey=\"submissions\" 
                        stackId=\"1\"
                        stroke={COLORS[0]} 
                        fill={COLORS[0]} 
                        name=\"Submissions\"
                      />
                      <Area 
                        type=\"monotone\" 
                        dataKey=\"quizzes\" 
                        stackId=\"1\"
                        stroke={COLORS[1]} 
                        fill={COLORS[1]} 
                        name=\"Quizzes\"
                      />
                      <Area 
                        type=\"monotone\" 
                        dataKey=\"discussions\" 
                        stackId=\"1\"
                        stroke={COLORS[2]} 
                        fill={COLORS[2]} 
                        name=\"Discussions\"
                      />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Rate */}
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
            <CardDescription>
              Overall {userRole === 'TEACHER' ? 'grading' : 'assignment'} completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              <div className=\"flex items-center justify-between\">
                <span className=\"text-2xl font-bold\">
                  {Math.round(analyticsData.completionRate)}%
                </span>
                {analyticsData.completionRate >= 80 ? (
                  <Badge className=\"bg-green-100 text-green-800\">Excellent</Badge>
                ) : analyticsData.completionRate >= 60 ? (
                  <Badge className=\"bg-yellow-100 text-yellow-800\">Good</Badge>
                ) : (
                  <Badge className=\"bg-red-100 text-red-800\">Needs Improvement</Badge>
                )}
              </div>
              <div className=\"w-full bg-gray-200 rounded-full h-3\">
                <div 
                  className=\"bg-blue-600 h-3 rounded-full transition-all duration-300\"
                  style={{ width: `${analyticsData.completionRate}%` }}
                ></div>
              </div>
              <p className=\"text-sm text-gray-600\">
                {userRole === 'TEACHER' 
                  ? 'Percentage of assignments graded' 
                  : 'Percentage of assignments completed'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Grade average over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"h-64\">
              <ResponsiveContainer width=\"100%\" height=\"100%\">
                <LineChart data={analyticsData.performanceTrends || []}>
                  <CartesianGrid strokeDasharray=\"3 3\" />
                  <XAxis dataKey=\"period\" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type=\"monotone\" 
                    dataKey=\"average\" 
                    stroke={COLORS[0]}
                    strokeWidth={3}
                    dot={{ fill: COLORS[0], strokeWidth: 2, r: 6 }}
                    name=\"Average Grade\"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string; 
  trend?: 'up' | 'down';
}) {
  return (
    <Card>
      <CardContent className=\"pt-6\">
        <div className=\"flex items-center justify-between\">
          <div>
            <p className=\"text-sm font-medium text-gray-600\">{title}</p>
            <div className=\"flex items-center gap-2\">
              <p className=\"text-2xl font-bold text-gray-900\">{value}</p>
              {trend && (
                trend === 'up' ? (
                  <TrendingUp className=\"h-4 w-4 text-green-500\" />
                ) : (
                  <TrendingDown className=\"h-4 w-4 text-red-500\" />
                )
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className=\"h-6 w-6\" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardView({ data, onExport }: { data: any; onExport: () => void }) {
  return (
    <div className=\"space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h2 className=\"text-2xl font-bold text-gray-900\">Course Leaderboard</h2>
          <p className=\"text-gray-600\">{data.courseInfo.title} ({data.courseInfo.code})</p>
        </div>
        <Button onClick={onExport} variant=\"outline\" size=\"sm\">
          <Download className=\"h-4 w-4 mr-2\" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className=\"pt-6\">
          <div className=\"space-y-4\">
            {data.leaderboard.map((student: any, index: number) => (
              <div 
                key={student.studentId}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  index === 0 ? 'bg-yellow-50 border-yellow-200' :
                  index === 1 ? 'bg-gray-50 border-gray-200' :
                  index === 2 ? 'bg-orange-50 border-orange-200' :
                  'bg-white border-gray-200'
                }`}
              >
                <div className=\"flex items-center space-x-4\">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-500 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {student.rank}
                  </div>
                  <div>
                    <h3 className=\"font-semibold text-gray-900\">{student.name}</h3>
                    <div className=\"flex space-x-4 text-sm text-gray-600\">
                      <span>Assignments: {student.assignmentAverage}%</span>
                      <span>Quizzes: {student.quizAverage}%</span>
                      <span>Attendance: {student.attendanceRate}%</span>
                    </div>
                  </div>
                </div>
                <div className=\"text-right\">
                  <div className=\"text-2xl font-bold text-blue-600\">
                    {student.overallScore}%
                  </div>
                  <div className=\"text-sm text-gray-500\">
                    {student.participationPoints} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
