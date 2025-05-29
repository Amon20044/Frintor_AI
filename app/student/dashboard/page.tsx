'use client'
import React, { useEffect } from 'react';
import { 
  User, Star, Brain, Target, BookOpen, Building, MapPin, Globe, 
  DollarSign, GraduationCap, ExternalLink, ChevronDown, ChevronUp,
  Sparkles, Award, TrendingUp, Users, Lightbulb, Search, Filter,
  Calendar, Phone, Mail, Clock, CheckCircle, AlertCircle, Info,
  Briefcase, Heart, Eye, Zap, Shield, Crown, Compass, Moon, Sun,
  ArrowRight, Play, FileText, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

function Page() {
  useEffect(() => {
    // Simulate toast notification
    toast.success('Welcome to the Student Dashboard! Explore your personalized insights and assessments.')  
  }, []);   

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-blue-200">
                <div className="text-4xl text-blue-600">
                  <Star className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Student Dashboard
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Welcome to your personalized learning journey. Discover your potential through AI-powered insights.
          </p>
        </header>

        {/* Welcome Message */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl border border-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome Back!</h2>
                <p className="text-blue-100">Ready to unlock your cosmic potential?</p>
              </div>
            </div>
            <p className="text-lg text-blue-50 leading-relaxed">
              Here you can explore your AI-powered psychometric analysis and discover your personalized horoscope insights. 
              Each assessment is designed to help you understand your unique strengths and guide your career journey.
            </p>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Psychometric Test Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI-Powered Psychometric Test</h3>
                  <p className="text-gray-600">Discover your personality traits</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Comprehensive personality analysis</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Career aptitude assessment</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Personalized insights & recommendations</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 mb-6">
                <div className="flex items-center gap-2 text-purple-800 mb-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-semibold text-sm">Assessment Details</span>
                </div>
                <p className="text-purple-700 text-sm">
                  Our advanced AI analyzes your responses across multiple personality dimensions to provide 
                  accurate insights into your strengths, preferences, and ideal career paths.
                </p>
              </div>

              <a 
                href="/student/test"
                className="inline-flex items-center gap-3 w-full justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
              >
                <Play className="h-5 w-5" />
                Take Psychometric Test
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Horoscope Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Moon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI-Powered Horoscope</h3>
                  <p className="text-gray-600">Unlock your cosmic blueprint</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Vedic astrology insights</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Planetary influence analysis</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>College & career recommendations</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 mb-6">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Compass className="h-4 w-4" />
                  <span className="font-semibold text-sm">Cosmic Guidance</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Combine ancient Vedic wisdom with modern AI to understand your life path, 
                  strengths, and the best educational institutions aligned with your destiny.
                </p>
              </div>

              <a 
                href="/student/horoscope"
                className="inline-flex items-center gap-3 w-full justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
              >
                <Star className="h-5 w-5" />
                View Your Horoscope
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Personalized Insights</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Get tailored recommendations based on your unique personality profile and cosmic alignment.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">AI-Driven Analysis</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Advanced algorithms analyze patterns in your responses to provide accurate career guidance.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">College Matching</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Discover the best educational institutions that align with your strengths and aspirations.
            </p>
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

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <p className="text-sm">Powered by AI & Ancient Wisdom</p>
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-xs">
            Your journey to self-discovery starts here. Unlock your potential with personalized insights.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Page;