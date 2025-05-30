"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Award,
  Eye,
  UserPlus,
  Search,
  Filter
} from 'lucide-react';

interface Student {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  lvl: string;
  onboardingCompleted: boolean;
  assigned_mentor?: any[];
  tests?: any[];
  created_at: string;
}

interface DashboardStats {
  totalStudents: number;
  totalMentors: number;
  completedTests: number;
  activeMentorships: number;
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalMentors: 0,
    completedTests: 0,
    activeMentorships: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch students
      const studentsRes = await fetch('/api/admin/students');
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students);
      }

      // Fetch stats
      const statsRes = await fetch('/api/admin/dashboard-stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const assignMentor = async (studentId: string) => {
    // This would open a modal to select and assign mentor
    toast.info('Mentor assignment feature coming soon');
  };

  const allowViewResults = async (studentId: string) => {
    try {
      const res = await fetch('/admin/api/allow-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });

      if (res.ok) {
        toast.success('Student can now view test results');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'onboarded' && student.onboardingCompleted) ||
      (filterStatus === 'pending' && !student.onboardingCompleted) ||
      (filterStatus === 'with-mentor' && student.assigned_mentor && student.assigned_mentor.length > 0);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage students, mentors, and monitor progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Mentors</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalMentors}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completed Tests</p>
                <p className="text-3xl font-bold text-purple-600">{stats.completedTests}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Mentorships</p>
                <p className="text-3xl font-bold text-orange-600">{stats.activeMentorships}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="onboarded">Onboarded</option>
                <option value="pending">Pending Onboarding</option>
                <option value="with-mentor">With Mentor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.uuid} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {student.first_name?.[0]}{student.last_name?.[0]}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Level:</span>
                    <span className="font-medium">{student.lvl || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Onboarding:</span>
                    <span className={`font-medium ${student.onboardingCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                      {student.onboardingCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Test Status:</span>
                    <span className="font-medium">
                      {student.tests && student.tests.length > 0 ? 
                        student.tests[0].status : 'Not assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mentor:</span>
                    <span className="font-medium">
                      {student.assigned_mentor && student.assigned_mentor.length > 0 ? 
                        'Assigned' : 'Not assigned'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => assignMentor(student.uuid)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign Mentor
                  </button>
                  <button
                    onClick={() => allowViewResults(student.uuid)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    Allow Results
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}