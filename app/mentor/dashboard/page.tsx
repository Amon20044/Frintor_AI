
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
  GraduationCap
} from 'lucide-react';

interface AssignedStudent {
  uuid: string;
  student_id: string;
  mentor_id: string;
  status: string;
  meeting_status: string;
  meeting_link: string;
  student: {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    lvl: string;
    onboardingCompleted: boolean;
  };
}

export default function MentorDashboard() {
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you'd get the mentor ID from auth context
    const mockMentorId = "mentor-uuid-1"; // Replace with actual auth
    setMentorId(mockMentorId);
    fetchAssignedStudents(mockMentorId);
  }, []);

  const fetchAssignedStudents = async (mentorId: string) => {
    try {
      const res = await fetch(`/api/mentor/students/${mentorId}`);
      if (res.ok) {
        const data = await res.json();
        setAssignedStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      toast.error('Failed to load assigned students');
    } finally {
      setLoading(false);
    }
  };

  const allowViewResults = async (studentId: string) => {
    try {
      const res = await fetch('/api/mentor/allow-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, mentorId })
      });

      if (res.ok) {
        toast.success('Student can now view test results');
        if (mentorId) fetchAssignedStudents(mentorId);
      }
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  const scheduleMeeting = async (assignmentId: string) => {
    toast.info('Meeting scheduling feature coming soon');
  };

  const markMeetingCompleted = async (assignmentId: string) => {
    try {
      const res = await fetch('/api/mentor/complete-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId })
      });

      if (res.ok) {
        toast.success('Meeting marked as completed');
        if (mentorId) fetchAssignedStudents(mentorId);
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-gray-600">Guide your assigned students and track their progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedStudents.map((assignment) => (
            <div key={assignment.uuid} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {assignment.student.first_name?.[0]}{assignment.student.last_name?.[0]}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {assignment.student.first_name} {assignment.student.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{assignment.student.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Level:</span>
                    <span className="font-medium">{assignment.student.lvl || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Onboarding:</span>
                    <span className={`font-medium ${assignment.student.onboardingCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                      {assignment.student.onboardingCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Meeting Status:</span>
                    <span className={`font-medium ${
                      assignment.meeting_status === 'COMPLETED' ? 'text-green-600' :
                      assignment.meeting_status === 'SCHEDULED' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {assignment.meeting_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {assignment.meeting_status === 'SCHEDULED' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => scheduleMeeting(assignment.uuid)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Video className="h-4 w-4" />
                        Schedule
                      </button>
                      <button
                        onClick={() => markMeetingCompleted(assignment.uuid)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={() => allowViewResults(assignment.student.uuid)}
                    className={`w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      assignment.meeting_status === 'COMPLETED' 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                    }`}
                    disabled={assignment.meeting_status === 'COMPLETED'}
                  >
                    {assignment.meeting_status === 'COMPLETED' ? (
                      <>
                        <Eye className="h-4 w-4" />
                        Results Accessible
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Allow Results
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {assignedStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No students assigned</h3>
            <p className="text-gray-500">Students will appear here when assigned by an admin</p>
          </div>
        )}
      </div>
    </div>
  );
}
