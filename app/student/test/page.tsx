
"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Clock, CheckCircle, Eye, Lock, BookOpen, Play } from 'lucide-react';
import TestForm from '@/components/TestForm';

interface TestStatus {
  uuid: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  test_type: string;
  completed_at: string | null;
}

interface TestResult {
  uuid: string;
  marks: number;
  test_structure: any;
  evaluated_at: string;
}

export default function StudentTestPage() {
  const [testStatus, setTestStatus] = useState<TestStatus | null>(null);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [canViewResults, setCanViewResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTest, setShowTest] = useState(false);
  const [studentId, setStudentId] = useState<string>(''); // start empty

  useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    if (uuid) {
      console.log('Student ID:', uuid);
      setStudentId(uuid);
      checkTestStatus(uuid); // call with correct value
    }
  }, []);

  const checkTestStatus = async (studentId: string) => {
    try {
      setLoading(true);

      // Check test status
      const statusRes = await fetch(`/api/student/test-status/${studentId}`);
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setTestStatus(statusData.test);

        // If test is completed, check if student can view results
        if (statusData.test && statusData.test.status === 'COMPLETED') {
          const resultAccessRes = await fetch(`/api/student/can-view-results/${studentId}`);
          console.log('Checking if student can view results:', resultAccessRes);
          if (resultAccessRes.ok) {
            const accessData = await resultAccessRes.json();
            setCanViewResults(accessData.canView);

            // If they can view results, fetch them
            if (accessData.canView) {
              const resultsRes = await fetch(`api/student/test-results/${studentId}`);
              if (resultsRes.ok) {
                const resultsData = await resultsRes.json();
                setTestResults(resultsData.results);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking test status:', error);
      toast.error('Failed to load test information');
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setShowTest(true);
  };

  const handleTestCompletion = () => {
    setShowTest(false);
    if (studentId) {
      checkTestStatus(studentId);
    }
    toast.success('Test completed successfully! Your results will be available once reviewed by your mentor.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test information...</p>
        </div>
      </div>
    );
  }

  if (showTest) {
    return <TestForm onTestComplete={handleTestCompletion} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Psychometric Assessment
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover your potential through AI-powered psychometric analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!testStatus ? (
            // No test assigned yet
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Test Available</h3>
              <p className="text-gray-600 mb-6">
                Your psychometric test is being prepared. Please complete your onboarding process first.
              </p>
              <button
                onClick={() => window.location.href = '/student/onboarding'}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                Complete Onboarding
              </button>
            </div>
          ) : testStatus.status === 'PENDING' ? (
            // Test is pending - can start
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Begin</h3>
                <p className="text-gray-600 mb-6">
                  Your personalized psychometric test is ready. This assessment will take approximately 15-20 minutes.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100 mb-8">
                <h4 className="font-semibold text-purple-800 mb-3">What to Expect:</h4>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AI-powered personality analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Career aptitude assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Personalized recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Detailed insights and guidance
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={startTest}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  <Play className="h-6 w-6" />
                  Start Assessment
                </button>
              </div>
            </div>
          ) : testStatus.status === 'COMPLETED' ? (
            // Test completed - show results or waiting message
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Assessment Completed</h3>
                  <p className="text-gray-600">
                    Great job! You completed your psychometric assessment on{' '}
                    {testStatus.completed_at && new Date(testStatus.completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {canViewResults ? (
                // Can view results
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-800">Your Results</h3>
                  </div>

                  {testResults ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                          <h4 className="font-semibold text-gray-800 mb-2">Assessment Score</h4>
                          <p className="text-3xl font-bold text-blue-600">{testResults.marks}%</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                          <h4 className="font-semibold text-gray-800 mb-2">Evaluation Date</h4>
                          <p className="text-lg font-medium text-green-600">
                            {new Date(testResults.evaluated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Detailed Analysis</h4>
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(testResults.test_structure, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => window.location.href = '/student/horoscope'}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                        >
                          View Detailed Horoscope
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your results...</p>
                    </div>
                  )}
                </div>
              ) : (
                // Cannot view results yet
                <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Results Under Review</h3>
                    <p className="text-gray-600 mb-6">
                      Your mentor is reviewing your assessment results. You`ll be able to view detailed insights
                      after your mentoring session is completed.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                      <p className="text-orange-700 text-sm">
                        💡 <strong>Next Steps:</strong> Wait for your mentor to schedule a session with you.
                        You`ll receive detailed guidance and unlock your full results after the session.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Test in progress (shouldn't normally happen)
            <div className="bg-white rounded-2xl shadow-xl border border-yellow-100 p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Test In Progress</h3>
              <p className="text-gray-600">
                Your assessment is currently in progress. Please complete it to view your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
