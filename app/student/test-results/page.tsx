
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, CheckCircle, AlertCircle, ArrowLeft, BarChart3, TrendingUp, Target, Star, Award, Eye, Shield, Lightbulb, BookOpen, User, Trophy } from 'lucide-react';

interface TestResult {
  uuid: string;
  marks: number;
  test_structure: any;
  evaluated_at: string;
}

export default function TestResultsPage() {
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        const studentUuid = localStorage.getItem('uuid');
        const token = localStorage.getItem('token');
        
        if (!studentUuid || !token) {
          router.push('/student/auth');
          return;
        }
        
        const res = await fetch(`/api/student/test-results/${studentUuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          setError('Access denied. Complete mentor session to view results.');
          return;
        }

        if (res.status === 404) {
          setError('No test results found. Please complete your assessment first.');
          return;
        }

        const data = await res.json();
        
        if (res.ok && data.results) {
          setTestResults(data.results);
        } else {
          throw new Error(data.message || 'Failed to fetch test results');
        }
      } catch (err) {
        console.error('Failed to load test results:', err);
        setError('Failed to load test results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-blue-200">
              <BarChart3 className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading your results...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Results</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/student/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-full shadow-xl border-2 border-green-200">
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Your Assessment Results
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover your personality insights and career recommendations
          </p>
        </header>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <button
            onClick={() => router.push('/student/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        {testResults && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Score Overview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Assessment Complete!</h2>
                    <p className="text-green-100">Your psychometric analysis is ready</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Overall Score</h3>
                    <p className="text-3xl font-bold text-green-600">{testResults.marks}%</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Evaluation Date</h3>
                    <p className="text-lg font-medium text-blue-600">
                      {new Date(testResults.evaluated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Status</h3>
                    <p className="text-lg font-medium text-purple-600">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            {testResults.test_structure && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg text-white">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Detailed Analysis</h3>
                      <p className="text-gray-600">Your personality traits and responses</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-purple-600" />
                        Response Analysis
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Below is the detailed breakdown of your assessment responses and personality insights.
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(testResults.test_structure, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Lightbulb className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">What's Next?</h3>
              <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
                Your results have been analyzed! Connect with your mentor to discuss your personality insights 
                and get personalized career guidance based on your assessment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/student/dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <User className="h-5 w-5" />
                  View Dashboard
                </button>
                <button 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold backdrop-blur-sm border border-white/30"
                >
                  <BookOpen className="h-5 w-5" />
                  Career Guidance
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Understanding Your Results</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Your assessment reveals key personality traits and preferences</li>
                    <li>• Results are used to match you with suitable career paths</li>
                    <li>• Discuss insights with your mentor for personalized guidance</li>
                    <li>• Use these insights to make informed educational decisions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Your results are confidential and secure</span>
          </div>
          <p className="text-xs">
            These results are designed to help you understand your personality and guide your career decisions.
          </p>
        </footer>
      </div>
    </div>
  );
}
