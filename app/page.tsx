
'use client';

import { useState } from 'react';
import { Users, UserCheck, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor' | 'admin' | null>(null);

  const handleRoleSelection = (role: 'student' | 'mentor' | 'admin') => {
    setSelectedRole(role);
    // Redirect to appropriate login page
    window.location.href = `/${role}/auth`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4">
            Career Counselling Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to access the platform and start your journey towards better career guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
               onClick={() => handleRoleSelection('student')}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-blue-200">
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Student</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access your personalized dashboard, take career assessments, and connect with mentors to guide your career journey.
              </p>
              <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                Login as Student
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </div>

          {/* Mentor Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
               onClick={() => handleRoleSelection('mentor')}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-green-200">
                    <UserCheck className="h-12 w-12 text-green-600" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mentor</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Guide assigned students, review their progress, schedule meetings, and help shape their career paths.
              </p>
              <div className="flex items-center justify-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                Login as Mentor
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
               onClick={() => handleRoleSelection('admin')}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-orange-200">
                    <Shield className="h-12 w-12 text-orange-600" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage the entire platform, oversee students and mentors, and access comprehensive analytics and reports.
              </p>
              <div className="flex items-center justify-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                Login as Admin
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            New to the platform? Contact your administrator for account setup.
          </p>
        </div>
      </div>
    </div>
  );
}
