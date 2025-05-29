'use client';

import { useState } from 'react';
import { Student } from '@/types/student.types';
import { toast } from 'sonner';
import { LogIn, AlertCircle, Shield } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const loginInfo = async (email: string, password: string) => {
    try {
      console.log('Initiating login request with email:', email);
      const res = await fetch('/student/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response from fetch:', res);
      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      const student = data.response;
      if (!student) {
        throw new Error('No student data in response');
      }

      const token = data.token;
      const uuid = student.uuid;
      if (token && uuid) {
        localStorage.setItem('token', token);
        localStorage.setItem('uuid', uuid);
        console.log('Stored token:', token);
        console.log('Stored UUID:', uuid);
      } else {
        console.warn('Token or UUID missing in response');
      }

      console.log('Student data:', student);
      return student as Student;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Error in loginInfo:', message);
      setError(message);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsPending(true);

    console.log('Submitting login form');
    const student = await loginInfo(email, password);

    if (!student) {
      console.log('No student data returned, aborting redirection');
      return;
    }
    console.log('Login successful, redirecting student:', student);
    toast('Student logged in successfully');
    if (student.onboardingcompleted) {
      window.location.href = '/student/dashboard';
    } else {
      window.location.href = '/student/onboarding';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-4 rounded-full shadow-xl border-2 border-purple-200">
                  <LogIn className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Student Login
            </h1>
            <p className="text-gray-600 mt-2">Access your account to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                required
                aria-describedby={error ? 'email-error' : undefined}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                required
                aria-describedby={error ? 'password-error' : undefined}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p id="form-error" className="text-red-700 text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-purple-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 ${
                isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Your credentials are secure</span>
            </div>
            <p className="text-xs">Don’t have an account? Register below</p>
          </div>
        </div>
      </div>
    </div>
  );
}