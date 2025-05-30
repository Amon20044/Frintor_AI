'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, CheckCircle, AlertCircle, Send, Lightbulb, Shield, Target, ArrowLeft, ArrowRight, BarChart3, TrendingUp } from 'lucide-react';

interface Question {
  question_ID: string;
  question: string;
  trait_measured: string;
  options: string[];
  userResponse?: string;
}

export default function TestForm({ params }: { params: { uuid: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testId, setTestId] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`api/student/getTest/${params.uuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        const json = await res.json();
        console.log('Fetched test data:', json.data.uuid);
        if (json.data?.test_structure) {
          setQuestions(json.data.test_structure);
          setTestId(json.data.uuid);
        } else {
          throw new Error('No test structure found');
        }
      } catch (err) {
        console.error('Failed to load test:', err);
        setError('Failed to load test. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [params.uuid]);

  const handleOptionChange = (selectedOption: string) => {
    setQuestions((prev) =>
      prev.map((q, index) =>
        index === currentQuestionIndex ? { ...q, userResponse: selectedOption } : q
      )
    );
    setError(null); // Clear error on user interaction
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const validateResponses = (): boolean => {
    const unansweredQuestions = questions.filter((q) => !q.userResponse);
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateResponses()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const resultPayload = {
      uuid: testId,
      test_id: testId,
      marks: 0,
      evaluated_at: new Date().toISOString(),
      test_structure: questions.map(({ userResponse, ...rest }) => ({
        ...rest,
        userResponse,
      })),
    };
    console.log('Submitting test result:', resultPayload);
    try {
      const res = await fetch(`/api/student/addStudentResponse/${testId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(resultPayload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Test submitted successfully!');
        router.push('/thank-you');
      } else {
        console.error('Submission failed:', data);
        alert('Failed to submit test.');
        setError('Failed to submit test. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Something went wrong.');
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    const answeredQuestions = questions.filter((q) => q.userResponse).length;
    return questions.length > 0 ? (answeredQuestions / questions.length) * 100 : 0;
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-blue-200">
              <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading your assessment...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Test</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-full shadow-xl border-2 border-purple-200">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Psychometric Assessment
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover your personality traits and unlock your career potential
          </p>
        </header>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="text-sm font-medium text-purple-600">
                {Math.round(getProgressPercentage())}% Complete
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden mb-8">
            <div className="p-8">
              {/* Trait Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                  <Target className="h-4 w-4 inline mr-2" />
                  {currentQuestion?.trait_measured}
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed mb-4">
                  {currentQuestion?.question}
                </h2>
                <p className="text-gray-600">
                  Select the option that best describes how you feel about this statement.
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion?.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      currentQuestion?.userResponse === option
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-400 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name={currentQuestion?.question_ID}
                        value={option}
                        checked={currentQuestion?.userResponse === option}
                        onChange={() => handleOptionChange(option)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <span
                        className={`text-lg font-medium ${
                          currentQuestion?.userResponse === option ? 'text-purple-900' : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentQuestionIndex
                          ? 'bg-purple-600 scale-125'
                          : questions[index]?.userResponse
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !currentQuestion?.userResponse}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                      submitting || !currentQuestion?.userResponse
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Test
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!currentQuestion?.userResponse}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      !currentQuestion?.userResponse
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold text-gray-900">Completed</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {questions.filter((q) => q.userResponse).length}
              </p>
              <p className="text-sm text-gray-600">out of {questions.length} questions</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Progress</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(getProgressPercentage())}%
              </p>
              <p className="text-sm text-gray-600">assessment complete</p>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-purple-100 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment Tips</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Answer honestly based on your natural tendencies</li>
                  <li>• Dont overthink your responses</li>
                  <li>• Choose the option that feels most authentic to you</li>
                  <li>• Ensure all questions are answered before submitting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 text-gray-600">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Your responses are confidential and secure</span>
            </div>
            <p className="text-xs">
              This assessment is designed to help you understand your personality traits and career preferences.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}