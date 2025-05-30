
"use client"
import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Play } from 'lucide-react';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  statusCode?: number;
}

export default function RouteTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const testData = {
    student: {
      register: {
        first_name: 'Test',
        last_name: 'Student',
        email: 'test.student@example.com',
        mobile_number: '1234567890',
        password: 'test123',
        final_pass: 'test123'
      },
      login: {
        email: 'test.student@example.com',
        password: 'test123'
      }
    },
    mentor: {
      register: {
        mentor_name: 'Test Mentor',
        email: 'test.mentor@example.com',
        mobile_number: '1234567891',
        password: 'test123'
      },
      login: {
        email: 'test.mentor@example.com',
        password: 'test123'
      }
    },
    admin: {
      register: {
        name: 'Test Admin',
        user_id: 'testadmin',
        mobile_number: '1234567892',
        password: 'test123'
      },
      login: {
        user_id: 'testadmin',
        password: 'test123'
      }
    }
  };

  const testEndpoint = async (endpoint: string, method: string, data: any) => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      return {
        endpoint,
        status: response.ok ? 'success' : 'error',
        message: responseData.message || 'No message',
        statusCode: response.status
      } as TestResult;
    } catch (error) {
      return {
        endpoint,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 0
      } as TestResult;
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults([]);
    
    const testCases = [
      // Student routes
      { endpoint: '/api/student/register', method: 'POST', data: testData.student.register },
      { endpoint: '/api/student/login', method: 'POST', data: testData.student.login },
      
      // Mentor routes
      { endpoint: '/api/mentor/register', method: 'POST', data: testData.mentor.register },
      { endpoint: '/api/mentor/login', method: 'POST', data: testData.mentor.login },
      
      // Admin routes
      { endpoint: '/api/admin/register', method: 'POST', data: testData.admin.register },
      { endpoint: '/api/admin/login', method: 'POST', data: testData.admin.login },
    ];

    const testResults: TestResult[] = [];
    
    for (const testCase of testCases) {
      const result = await testEndpoint(testCase.endpoint, testCase.method, testCase.data);
      testResults.push(result);
      setResults([...testResults]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
    }
    
    setTesting(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Route Testing Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={runAllTests}
            disabled={testing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            {testing ? 'Testing Routes...' : 'Test All Authentication Routes'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {result.endpoint}
                        {result.statusCode && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({result.statusCode})
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Data Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Student</h3>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(testData.student, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mentor</h3>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(testData.mentor, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Admin</h3>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(testData.admin, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
