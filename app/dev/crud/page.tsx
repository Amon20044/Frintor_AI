
"use client"
import React, { useState, useEffect } from 'react';
import { User, UserPlus, Shield, GraduationCap, CheckCircle, AlertCircle, Database, Trash2, Eye } from 'lucide-react';
import { 
  createDevStudent, 
  createDevMentor, 
  createDevAdmin, 
  createDevSubAdmin,
  assignMentorToStudent,
  getAllDevData,
  cleanupTestData,
  type DevStudentData,
  type DevMentorData,
  type DevAdminData,
  type DevSubAdminData
} from '@/utils/devPanelUtils';

export default function DevCrudPanel() {
  const [activeTab, setActiveTab] = useState<'student' | 'mentor' | 'admin' | 'subadmin' | 'view'>('student');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [allData, setAllData] = useState<any>(null);

  const [studentData, setStudentData] = useState<DevStudentData>({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    password: '',
    age: '',
    gender: undefined,
    lvl: undefined,
    onboardingCompleted: false
  });

  const [mentorData, setMentorData] = useState<DevMentorData>({
    mentor_name: '',
    email: '',
    mobile_number: '',
    password: ''
  });

  const [adminData, setAdminData] = useState<DevAdminData>({
    user_id: '',
    name: '',
    mobile_number: '',
    password: ''
  });

  const [subAdminData, setSubAdminData] = useState<DevSubAdminData>({
    name: '',
    email: '',
    mobile_number: '',
    password: ''
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createDevStudent(studentData);
      
      if (result.success) {
        showMessage('success', result.message);
        setStudentData({
          first_name: '',
          last_name: '',
          email: '',
          mobile_number: '',
          password: '',
          age: '',
          gender: undefined,
          lvl: undefined,
          onboardingCompleted: false
        });
      } else {
        showMessage('error', result.message);
      }
    } catch (error) {
      showMessage('error', 'Error creating student');
    }
    
    setLoading(false);
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createDevMentor(mentorData);
      
      if (result.success) {
        showMessage('success', result.message);
        setMentorData({
          mentor_name: '',
          email: '',
          mobile_number: '',
          password: ''
        });
      } else {
        showMessage('error', result.message);
      }
    } catch (error) {
      showMessage('error', 'Error creating mentor');
    }
    
    setLoading(false);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createDevAdmin(adminData);
      
      if (result.success) {
        showMessage('success', result.message);
        setAdminData({
          user_id: '',
          name: '',
          mobile_number: '',
          password: ''
        });
      } else {
        showMessage('error', result.message);
      }
    } catch (error) {
      showMessage('error', 'Error creating admin');
    }
    
    setLoading(false);
  };

  const handleSubAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createDevSubAdmin(subAdminData);
      
      if (result.success) {
        showMessage('success', result.message);
        setSubAdminData({
          name: '',
          email: '',
          mobile_number: '',
          password: ''
        });
      } else {
        showMessage('error', result.message);
      }
    } catch (error) {
      showMessage('error', 'Error creating sub admin');
    }
    
    setLoading(false);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const result = await getAllDevData();
      if (result.success) {
        setAllData(result.data);
      } else {
        showMessage('error', 'Failed to load data');
      }
    } catch (error) {
      showMessage('error', 'Error loading data');
    }
    setLoading(false);
  };

  const handleCleanup = async () => {
    const confirmation = prompt('Type "DELETE_ALL_TEST_DATA" to confirm cleanup:');
    if (confirmation === 'DELETE_ALL_TEST_DATA') {
      setLoading(true);
      try {
        const result = await cleanupTestData(confirmation);
        if (result.success) {
          showMessage('success', result.message);
          setAllData(null);
        } else {
          showMessage('error', result.message);
        }
      } catch (error) {
        showMessage('error', 'Error during cleanup');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      loadAllData();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
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
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-6 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${
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
            className={`px-6 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${
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
            className={`px-6 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'admin' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="h-5 w-5" />
            Add Admin
          </button>
          <button
            onClick={() => setActiveTab('subadmin')}
            className={`px-6 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'subadmin' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="h-5 w-5" />
            Add Sub Admin
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'view' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="h-5 w-5" />
            View Data
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
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Age (optional)"
                value={studentData.age}
                onChange={(e) => setStudentData({ ...studentData, age: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <select
                value={studentData.gender || ''}
                onChange={(e) => setStudentData({ ...studentData, gender: e.target.value as any })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Gender (optional)</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <select
                value={studentData.lvl || ''}
                onChange={(e) => setStudentData({ ...studentData, lvl: e.target.value as any })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Level (optional)</option>
                <option value="MID_SCHOOL">Mid School</option>
                <option value="HIGH_SCHOOL">High School</option>
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="POSTGRADUATE">Postgraduate</option>
                <option value="WORKING_PROFESSIONAL">Working Professional</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={studentData.onboardingCompleted}
                  onChange={(e) => setStudentData({ ...studentData, onboardingCompleted: e.target.checked })}
                  className="rounded"
                />
                <span>Onboarding Completed</span>
              </label>
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
                placeholder="User ID (for login)"
                value={adminData.user_id}
                onChange={(e) => setAdminData({ ...adminData, user_id: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Admin Name"
                value={adminData.name}
                onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number (optional)"
                value={adminData.mobile_number}
                onChange={(e) => setAdminData({ ...adminData, mobile_number: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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

        {/* Sub Admin Form */}
        {activeTab === 'subadmin' && (
          <form onSubmit={handleSubAdminSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Add New Sub Admin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Sub Admin Name"
                value={subAdminData.name}
                onChange={(e) => setSubAdminData({ ...subAdminData, name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={subAdminData.email}
                onChange={(e) => setSubAdminData({ ...subAdminData, email: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number (optional)"
                value={subAdminData.mobile_number}
                onChange={(e) => setSubAdminData({ ...subAdminData, mobile_number: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={subAdminData.password}
                onChange={(e) => setSubAdminData({ ...subAdminData, password: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              {loading ? 'Adding...' : 'Add Sub Admin'}
            </button>
          </form>
        )}

        {/* View Data */}
        {activeTab === 'view' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Data
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
                <button
                  onClick={handleCleanup}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Cleanup
                </button>
              </div>
            </div>
            
            {allData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Students ({allData.students.length})</h3>
                  <div className="max-h-64 overflow-y-auto border rounded p-2">
                    {allData.students.map((student: any) => (
                      <div key={student.uuid} className="text-sm p-2 border-b">
                        <div>{student.first_name} {student.last_name}</div>
                        <div className="text-gray-500">{student.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Mentors ({allData.mentors.length})</h3>
                  <div className="max-h-64 overflow-y-auto border rounded p-2">
                    {allData.mentors.map((mentor: any) => (
                      <div key={mentor.uuid} className="text-sm p-2 border-b">
                        <div>{mentor.mentor_name}</div>
                        <div className="text-gray-500">{mentor.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Admins ({allData.admins.length})</h3>
                  <div className="max-h-64 overflow-y-auto border rounded p-2">
                    {allData.admins.map((admin: any) => (
                      <div key={admin.uuid} className="text-sm p-2 border-b">
                        <div>{admin.name}</div>
                        <div className="text-gray-500">{admin.user_id}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Sub Admins ({allData.subAdmins.length})</h3>
                  <div className="max-h-64 overflow-y-auto border rounded p-2">
                    {allData.subAdmins.map((subAdmin: any) => (
                      <div key={subAdmin.uuid} className="text-sm p-2 border-b">
                        <div>{subAdmin.name}</div>
                        <div className="text-gray-500">{subAdmin.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
