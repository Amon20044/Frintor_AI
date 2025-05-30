"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock,
  Video,
  Eye,
  EyeOff,
  GraduationCap,
  UserCheck,
  Bell,
  Settings,
  Menu,
  TrendingUp,
  Award,
  Star,
  MessageSquare
} from 'lucide-react';

interface AssignedStudent {
  uuid: string;
  student_id: string;
  mentor_id: string;
  status: string;
  meeting_status: string;
  meeting_link: string;
  assigned_at: string;
  student: {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    lvl: string;
    onboardingcompleted: boolean;
  };
}

interface MentorProfile {
  uuid: string;
  mentor_name: string;
  email: string;
}

export default function MentorDashboard() {
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorProfile();
  }, []);

  const fetchMentorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/mentor/auth';
        return;
      }

      const response = await fetch('/api/mentor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMentor(data.mentor);

        // Fetch assigned students using mentor UUID
        await fetchAssignedStudents(data.mentor.uuid);

        toast.success(`Welcome ${data.mentor.mentor_name}! Ready to guide your students?`);
      } else {
        window.location.href = '/mentor/auth';
      }
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
      window.location.href = '/mentor/auth';
    }
  };

  const fetchAssignedStudents = async (mentorId: string) => {
    try {
      const res = await fetch(`/api/mentor/students/${mentorId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setAssignedStudents(data.students || []);
      } else {
        console.error('Failed to fetch assigned students');
      }
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      toast.error('Failed to load assigned students');
    } finally {
      setLoading(false);
    }
  };

  const verifyHoroscope = async (studentId: string) => {
    try {
      const res = await fetch('/api/mentor/verify-horoscope', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mentorToken')}`
        },
        body: JSON.stringify({ studentId, mentorId: mentor?.uuid })
      });

      if (res.ok) {
        toast.success('Horoscope verified successfully');
        if (mentor?.uuid) fetchAssignedStudents(mentor.uuid);
      } else {
        toast.error('Failed to verify horoscope');
      }
    } catch (error) {
      toast.error('Failed to verify horoscope');
    }
  };

  const scheduleMeeting = async (assignmentId: string) => {
    toast.info('Meeting scheduling feature coming soon');
  };

  const markMeetingCompleted = async (assignmentId: string) => {
    try {
      const res = await fetch('/api/mentor/complete-meeting', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mentorToken')}`
        },
        body: JSON.stringify({ assignmentId })
      });

      if (res.ok) {
        toast.success('Meeting marked as completed');
        if (mentor?.uuid) fetchAssignedStudents(mentor.uuid);
      }
    } catch (error) {
      toast.error('Failed to update meeting status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mentor Portal</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-600">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm">{mentor?.mentor_name}</span>
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
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <UserCheck className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Welcome {mentor?.mentor_name}!</h2>
                <p className="text-green-100">Guide your assigned students and shape their futures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Assigned Students</p>
                <p className="text-3xl font-bold text-green-600">{assignedStudents.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Active mentorships</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completed Meetings</p>
                <p className="text-3xl font-bold text-blue-600">
                  {assignedStudents.filter(s => s.meeting_status === 'COMPLETED').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Sessions finished</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pending Meetings</p>
                <p className="text-3xl font-bold text-orange-600">
                  {assignedStudents.filter(s => s.meeting_status === 'SCHEDULED').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">To be scheduled</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-purple-600">95%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">Student satisfaction</span>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Students</h3>
          {assignedStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedStudents.map((assignment) => (
                <div key={assignment.uuid} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {assignment.student.first_name?.[0]}{assignment.student.last_name?.[0]}
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {assignment.student.first_name} {assignment.student.last_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{assignment.student.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Level:</span>
                        <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {assignment.student.lvl || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Status:</span>
                        <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                          assignment.student.onboardingcompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {assignment.student.onboardingcompleted ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Meeting:</span>
                        <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                          assignment.meeting_status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          assignment.meeting_status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.meeting_status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {assignment.meeting_status === 'SCHEDULED' && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => scheduleMeeting(assignment.uuid)}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Video className="h-4 w-4" />
                            Schedule
                          </button>
                          <button
                            onClick={() => markMeetingCompleted(assignment.uuid)}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Complete
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => verifyHoroscope(assignment.student.uuid)}
                        className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Verify Horoscope
                      </button>

                      <button className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                        <MessageSquare className="h-4 w-4" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No students assigned</h3>
              <p className="text-gray-500">Students will appear here when assigned by an admin</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Schedule Meeting</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Send Message</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Eye className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">View Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New student assigned</span>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Meeting completed</span>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Horoscope verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}