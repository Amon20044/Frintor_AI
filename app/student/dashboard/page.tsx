'use client'
import React, { useEffect, useState } from 'react';
import { 
  User, Star, Brain, Target, BookOpen, Building, MapPin, Globe, 
  DollarSign, GraduationCap, ExternalLink, ChevronDown, ChevronUp,
  Sparkles, Award, TrendingUp, Users, Lightbulb, Search, Filter,
  Calendar, Phone, Mail, Clock, CheckCircle, AlertCircle, Info,
  Briefcase, Heart, Eye, Zap, Shield, Crown, Compass, Moon, Sun,
  ArrowRight, Play, FileText, BarChart3, Menu, Bell, Settings,
  UserCheck, MessageCircle, Video
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentProfile {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  lvl: string;
  onboardingcompleted: boolean;
}

interface AssignedMentor {
  uuid: string;
  student_id: string;
  mentor_id: string;
  status: string;
  meeting_status: string;
  meeting_link: string;
  assigned_at: string;
  mentor: {
    uuid: string;
    mentor_name: string;
    email: string;
    mobile_number: string;
  };
}

interface HoroscopeStatus {
  exists: boolean;
  verified: boolean;
}

interface TestStatus {
  exists: boolean;
  status: string;
}

function Page() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [assignedMentor, setAssignedMentor] = useState<AssignedMentor | null>(null);
  const [horoscopeStatus, setHoroscopeStatus] = useState<HoroscopeStatus>({ exists: false, verified: false });
  const [testStatus, setTestStatus] = useState<TestStatus>({ exists: false, status: 'PENDING' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/student/auth';
        return;
      }

      const response = await fetch('/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);

        // Fetch mentor assignment status
        await fetchAssignedMentor(data.student.uuid);

        // Fetch horoscope verification status
        await fetchHoroscopeStatus(data.student.uuid);

        // Fetch test status
        await fetchTestStatus(data.student.uuid);

        toast.success(`Welcome ${data.student.first_name}! Ready to explore your potential?`);
      } else {
        window.location.href = '/student/auth';
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      window.location.href = '/student/auth';
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedMentor = async (studentId: string) => {
    try {
      const res = await fetch(`/api/student/mentor-assignment/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.mentor) {
          setAssignedMentor(data.mentor);
        } else {
          setAssignedMentor(null);
        }
      }
    } catch (error) {
      console.error('Error fetching assigned mentor:', error);
      setAssignedMentor(null);
    }
  };

  const fetchHoroscopeStatus = async (studentId: string) => {
    try {
      const response = await fetch(`/api/student/horoscope-status/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHoroscopeStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching horoscope status:', error);
    }
  };

  const fetchTestStatus = async (studentId: string) => {
    try {
      const response = await fetch(`/api/student/test-status/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.test) {
          setTestStatus({ exists: true, status: data.test.status });
        } else {
          setTestStatus({ exists: false, status: 'PENDING' });
        }
      }
    } catch (error) {
      console.error('Error fetching test status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm">{student?.first_name} {student?.last_name}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Welcome {student?.first_name}!</h2>
                <p className="text-blue-100">Ready to unlock your cosmic potential?</p>
              </div>
            </div>
            <p className="text-lg text-blue-50 leading-relaxed">
              Here you can explore your AI-powered psychometric analysis and discover your personalized horoscope insights. 
              Each assessment is designed to help you understand your unique strengths and guide your career journey.
            </p>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Psychometric Test Card */}
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg text-white">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Psychometric Test</h3>
                      <p className="text-sm text-gray-600">AI-Powered Analysis</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Personality analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Career recommendations</span>
                    </div>
                  </div>

                  <a 
                    href="/student/test"
                    className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm"
                  >
                    <Play className="h-4 w-4" />
                    Take Test
                  </a>
                </div>
              </div>

              {/* Horoscope Card */}
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg text-white">
                      <Moon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Horoscope</h3>
                      <p className="text-sm text-gray-600">Cosmic Insights</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Vedic astrology</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>College matching</span>
                    </div>
                  </div>

                  {horoscopeStatus.exists && horoscopeStatus.verified ? (
                    <a 
                      href="/student/horoscope"
                      className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium text-sm"
                    >
                      <Star className="h-4 w-4" />
                      View Horoscope
                    </a>
                  ) : horoscopeStatus.exists && !horoscopeStatus.verified ? (
                    <div className="w-full px-4 py-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-center text-sm">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Verification of Horoscope is Pending
                    </div>
                  ) : (
                    <button 
                      className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium text-sm"
                      onClick={() => toast.info('Complete your psychometric test to generate horoscope')}
                    >
                      <Star className="h-4 w-4" />
                      Generate Horoscope
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Test Status Section */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Psychometric Analysis
              </h3>

              {testStatus.exists && testStatus.status === 'COMPLETED' ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Psychometric Analysis Assignment Done</h4>
                      <p className="text-sm text-gray-600">Your test has been completed successfully</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          COMPLETED
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a 
                      href="/student/test-results"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Results
                    </a>
                  </div>
                </div>
              ) : testStatus.exists ? (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Test In Progress</h4>
                      <p className="text-sm text-gray-600">Complete your psychometric test</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                          {testStatus.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a 
                      href="/student/test"
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      Continue Test
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                  <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No test started yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Take your psychometric test to unlock personalized insights.
                  </p>
                  <div className="mt-4">
                    <a 
                      href="/student/test"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Start Test
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Mentor Assignment Section */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Mentor Assignment
              </h3>

              {assignedMentor ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{assignedMentor.mentor.mentor_name}</h4>
                      <p className="text-sm text-gray-600">{assignedMentor.mentor.email}</p>
                      <p className="text-sm text-gray-600">{assignedMentor.mentor.mobile_number}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assignedMentor.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {assignedMentor.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assignedMentor.meeting_status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          Meeting: {assignedMentor.meeting_status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Contact Mentor
                    </button>
                    {assignedMentor.meeting_link && (
                      <a 
                        href={assignedMentor.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No Mentor Assigned Yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    A mentor will be assigned to you soon. You'll receive guidance and support for your career journey.
                  </p>
                </div>
              )}
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Profile Setup</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
                <div className={`text-center p-4 rounded-lg ${
                  testStatus.exists && testStatus.status === 'COMPLETED' ? 'bg-green-50' : 'bg-orange-50'
                }`}>
                  {testStatus.exists && testStatus.status === 'COMPLETED' ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  ) : (
                    <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  )}
                  <p className={`text-sm font-medium ${
                    testStatus.exists && testStatus.status === 'COMPLETED' ? 'text-green-800' : 'text-orange-800'
                  }`}>Psychometric Test</p>
                  <p className={`text-xs ${
                    testStatus.exists && testStatus.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'
                  }`}>{testStatus.exists && testStatus.status === 'COMPLETED' ? 'Completed' : 'Pending'}</p>
                </div>
                <div className={`text-center p-4 rounded-lg ${
                  horoscopeStatus.verified ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  {horoscopeStatus.verified ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  ) : (
                    <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  )}
                  <p className={`text-sm font-medium ${
                    horoscopeStatus.verified ? 'text-green-800' : 'text-gray-800'
                  }`}>Horoscope</p>
                  <p className={`text-xs ${
                    horoscopeStatus.verified ? 'text-green-600' : 'text-gray-600'
                  }`}>{horoscopeStatus.verified ? 'Verified' : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level:</span>
                  <span className="text-sm font-medium">{student?.lvl || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Onboarding:</span>
                  <span className={`text-sm font-medium ${student?.onboardingcompleted ? 'text-green-600' : 'text-orange-600'}`}>
                    {student?.onboardingcompleted ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-800">{student?.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">View Test History</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Schedule Meeting</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Contact Support</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Account created</span>
                </div>
                {testStatus.exists && testStatus.status === 'COMPLETED' && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Psychometric test completed</span>
                  </div>
                )}
                {horoscopeStatus.exists && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      {horoscopeStatus.verified ? 'Horoscope verified' : 'Horoscope generated'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Crown className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">Ready to Discover Your Potential?</h3>
          <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
            Take the first step towards understanding yourself better. Complete your assessments 
            and connect with your mentor for comprehensive guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/student/test"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <Brain className="h-5 w-5" />
              Start Assessment
            </a>
            {testStatus.exists && testStatus.status === 'COMPLETED' ? (
              <a 
                href="/student/test-results"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold backdrop-blur-sm border border-white/30"
              >
                <BarChart3 className="h-5 w-5" />
                View Results
              </a>
            ) : (
              <a 
                href="/student/test"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold backdrop-blur-sm border border-white/30"
              >
                <Brain className="h-5 w-5" />
                Continue Test
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;