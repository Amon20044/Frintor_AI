
"use client"
import React, { useState } from 'react';
import { User, UserPlus, Shield, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';

interface Student {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  password: string;
}

interface Mentor {
  mentor_name: string;
  email: string;
  mobile_number: string;
  password: string;
}

interface Admin {
  name: string;
  user_id: string;
  mobile_number: string;
  password: string;
}

export default function DevCrudPanel() {
  const [activeTab, setActiveTab] = useState<'student' | 'mentor' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [studentData, setStudentData] = useState<Student>({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    password: ''
  });

  const [mentorData, setMentorData] = useState<Mentor>({
    mentor_name: '',
    email: '',
    mobile_number: '',
    password: ''
  });

  const [adminData, setAdminData] = useState<Admin>({
    name: '',
    user_id: '',
    mobile_number: '',
    password: ''
  });

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/student/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Student added successfully!' });
        setStudentData({ first_name: '', last_name: '', email: '', mobile_number: '', password: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add student' });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setMessage({ type: 'error', text: 'Error adding student' });
    }
    setLoading(false);
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/mentor/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mentorData)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Mentor added successfully!' });
        setMentorData({ mentor_name: '', email: '', mobile_number: '', password: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add mentor' });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setMessage({ type: 'error', text: 'Error adding mentor' });
    }
    setLoading(false);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/admin/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Admin added successfully!' });
        setAdminData({ name: '', user_id: '', mobile_number: '', password: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add admin' });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setMessage({ type: 'error', text: 'Error adding admin' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dev CRUD Panel</h1>
        
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === 'student' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            Add Student
          </button>
          <button
            onClick={() => setActiveTab('mentor')}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === 'mentor' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="h-5 w-5" />
            Add Mentor
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === 'admin' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="h-5 w-5" />
            Add Admin
          </button>
        </div>

        {/* Student Form */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Add New Student
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={studentData.first_name}
                onChange={(e) => setStudentData({ ...studentData, first_name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={studentData.last_name}
                onChange={(e) => setStudentData({ ...studentData, last_name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={studentData.email}
                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={studentData.mobile_number}
                onChange={(e) => setStudentData({ ...studentData, mobile_number: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={studentData.password}
                onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 md:col-span-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </form>
        )}

        {/* Mentor Form */}
        {activeTab === 'mentor' && (
          <form onSubmit={handleMentorSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Add New Mentor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Mentor Name"
                value={mentorData.mentor_name}
                onChange={(e) => setMentorData({ ...mentorData, mentor_name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={mentorData.email}
                onChange={(e) => setMentorData({ ...mentorData, email: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mentorData.mobile_number}
                onChange={(e) => setMentorData({ ...mentorData, mobile_number: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={mentorData.password}
                onChange={(e) => setMentorData({ ...mentorData, password: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              {loading ? 'Adding...' : 'Add Mentor'}
            </button>
          </form>
        )}

        {/* Admin Form */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Add New Admin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Admin Name"
                value={adminData.name}
                onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="User ID"
                value={adminData.user_id}
                onChange={(e) => setAdminData({ ...adminData, user_id: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={adminData.mobile_number}
                onChange={(e) => setAdminData({ ...adminData, mobile_number: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={adminData.password}
                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              {loading ? 'Adding...' : 'Add Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
