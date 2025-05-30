
'use client'
import React, { useEffect, useState } from 'react';
import { 
  User, Star, Brain, Target, BookOpen, Building, MapPin, Globe, 
  DollarSign, GraduationCap, ExternalLink, ChevronDown, ChevronUp,
  Sparkles, Award, TrendingUp, Users, Lightbulb, Search, Filter,
  Calendar, Phone, Mail, Clock, CheckCircle, AlertCircle, Info,
  Briefcase, Heart, Eye, Zap, Shield, Crown, Compass, Moon, Sun,
  ArrowRight, Play, FileText, BarChart3, Menu, Bell, Settings
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

function Page() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
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

                  <a 
                    href="/student/horoscope"
                    className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium text-sm"
                  >
                    <Star className="h-4 w-4" />
                    View Horoscope
                  </a>
                </div>
              </div>
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
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-800">Assessment</p>
                  <p className="text-xs text-orange-600">Pending</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Mentorship</p>
                  <p className="text-xs text-gray-600">Not Started</p>
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
                  <span className="text-sm font-medium">View Results</span>
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
                <div className="flex items-center gap-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Profile updated</span>
                </div>
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
            Take the first step towards understanding yourself better. Complete both assessments 
            to get a comprehensive view of your personality and cosmic blueprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/student/test"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <Brain className="h-5 w-5" />
              Start Assessment
            </a>
            <a 
              href="/student/horoscope"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold backdrop-blur-sm border border-white/30"
            >
              <Moon className="h-5 w-5" />
              View Horoscope
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
