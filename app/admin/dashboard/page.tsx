"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Users, GraduationCap, UserCheck, TrendingUp, 
  Search, Filter, Eye, ArrowLeft, AlertCircle,
  CheckCircle, Calendar, Mail, Phone, MapPin, Award,
  Shield, Bell, Settings, Plus, BookOpen, BarChart3, Clock
} from "lucide-react";
import { StudentProfile, StudentProfileData } from "@/src/components/shared/StudentProfile";

interface Student {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  lvl: string;
  onboardingcompleted: boolean;
  assigned_mentor?: any[];
  tests?: any[];
  created_at: string;
}

interface AdminProfile {
  uuid: string;
  name: string;
  user_id: string;
}

interface DashboardStats {
  totalStudents: number;
  totalMentors: number;
  completedTests: number;
  activeMentorships: number;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
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
    fetchAdminProfile();
    fetchDashboardData();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        window.location.href = '/admin/auth';
        return;
      }

      const response = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        toast.success(`Welcome ${data.admin.name}! Ready to manage your platform?`);
      } else {
        window.location.href = '/admin/auth';
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      window.location.href = '/admin/auth';
    }
  };

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
    toast.info('Mentor assignment feature coming soon');
  };

  const allowViewResults = async (studentId: string) => {
    try {
      const res = await fetch('/api/admin/allow-results', {
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
      (filterStatus === 'onboarded' && student.onboardingcompleted) ||
      (filterStatus === 'pending' && !student.onboardingcompleted) ||
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
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Portal</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-600">
                <Shield className="h-4 w-4" />
                <span className="text-sm">{admin?.name}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Welcome {admin?.name}!</h2>
                <p className="text-orange-100">Manage your platform and oversee all operations</p>
              </div>
            </div>
          </div>
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
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+12% from last month</span>
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
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">All active</span>
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
            <div className="mt-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">85% completion rate</span>
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
            <div className="mt-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">In progress</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Students</option>
                  <option value="onboarded">Onboarded</option>
                  <option value="pending">Pending</option>
                  <option value="with-mentor">With Mentor</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalStudents}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
            <p className="text-gray-600 text-sm">Registered students in the system</p>
            <button 
              onClick={() => window.location.href = '/admin/assign-mentor'}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <UserCheck className="h-4 w-4" />
              Manage Assignments
            </button>
          </div>
          {filteredStudents.map((student) => (
                <StudentProfile
                  key={student.uuid}
                  student={student as StudentProfileData}
                  variant="card"
                  showActions={true}
                  onAssignMentor={() => window.location.href = '/admin/assign-mentor'}
                  onEdit={() => console.log('Edit student:', student.uuid)}
                  onViewHoroscope={() => console.log('View horoscope:', student.uuid)}
                />
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