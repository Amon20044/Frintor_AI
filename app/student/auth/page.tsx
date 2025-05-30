
'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/Login';
import RegisterForm from '@/components/Register';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';

export default function StudentAuth() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const postData = async () => {
      try {
        const res = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: 'Amon' })
        });

        const data = await res.json();
        console.log('Response:', data);
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    postData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.location.href = '/'}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Home
      </button>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          {/* Header */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Portal</h1>
            <p className="text-gray-600">Access your learning dashboard</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-purple-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 p-4 text-center font-semibold transition-all duration-200 ${activeTab === 'login'
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-900 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-purple-50/30'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                Login
              </div>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 p-4 text-center font-semibold transition-all duration-200 ${activeTab === 'register'
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-900 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-purple-50/30'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="h-5 w-5" />
                Register
              </div>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
