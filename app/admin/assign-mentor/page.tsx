
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Users, UserCheck, Search, Filter, ArrowLeft, 
  Calendar, Phone, Mail, CheckCircle, AlertCircle,
  Plus, Trash2, Eye, Edit3
} from "lucide-react";

interface Student {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  lvl: string;
  onboardingcompleted: boolean;
  assigned_mentor?: any[];
}

interface Mentor {
  uuid: string;
  mentor_name: string;
  email: string;
  mobile_number: string;
}

interface Assignment {
  uuid: string;
  student_id: string;
  mentor_id: string;
  status: string;
  meeting_status: string;
  meeting_link: string;
  assigned_at: string;
  student: Student;
  mentor: Mentor;
}

export default function AssignMentor() {
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedMentor, setSelectedMentor] = useState<string>("");
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch students
      const studentsRes = await fetch("/api/admin/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      
      // Fetch mentors
      const mentorsRes = await fetch("/api/admin/mentors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      
      // Fetch assignments
      const assignmentsRes = await fetch("/api/admin/assignments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }

      if (mentorsRes.ok) {
        const mentorsData = await mentorsRes.json();
        setMentors(mentorsData.mentors || []);
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData.assignments || []);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMentor = async () => {
    if (!selectedStudent || !selectedMentor) {
      toast.error("Please select both student and mentor");
      return;
    }

    try {
      const res = await fetch("/api/admin/assign-mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          mentorId: selectedMentor,
          meetingLink: meetingLink || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Mentor assigned successfully");
        setSelectedStudent("");
        setSelectedMentor("");
        setMeetingLink("");
        fetchData(); // Refresh data
      } else {
        toast.error(data.message || "Failed to assign mentor");
      }
    } catch (error) {
      toast.error("Failed to assign mentor");
      console.error("Error assigning mentor:", error);
    }
  };

  const handleUnassignMentor = async (assignmentId: string) => {
    try {
      const res = await fetch("/api/admin/unassign-mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ assignmentId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Mentor unassigned successfully");
        fetchData(); // Refresh data
      } else {
        toast.error(data.message || "Failed to unassign mentor");
      }
    } catch (error) {
      toast.error("Failed to unassign mentor");
      console.error("Error unassigning mentor:", error);
    }
  };

  const unassignedStudents = students.filter(
    student => !assignments.some(assignment => 
      assignment.student_id === student.uuid && assignment.status === 'ACTIVE'
    )
  );

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.mentor.mentor_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || assignment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mentor Assignment</h1>
                <p className="text-gray-600">Assign mentors to students and manage assignments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assignment Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Assign New Mentor
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a student...</option>
                  {unassignedStudents.map((student) => (
                    <option key={student.uuid} value={student.uuid}>
                      {student.first_name} {student.last_name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Mentor
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a mentor...</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.uuid} value={mentor.uuid}>
                      {mentor.mentor_name} ({mentor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link (Optional)
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleAssignMentor}
                disabled={!selectedStudent || !selectedMentor}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="h-5 w-5" />
                Assign Mentor
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{mentors.length}</div>
                <div className="text-sm text-gray-600">Total Mentors</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {assignments.filter(a => a.status === 'ACTIVE').length}
                </div>
                <div className="text-sm text-gray-600">Active Assignments</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{unassignedStudents.length}</div>
                <div className="text-sm text-gray-600">Unassigned Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Assignments */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Current Assignments ({filteredAssignments.length})
              </h2>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>No assignments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.uuid}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {assignment.student.first_name} {assignment.student.last_name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {assignment.student.email}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl">→</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {assignment.mentor.mentor_name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {assignment.mentor.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            assignment.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${
                            assignment.meeting_status === 'COMPLETED' 
                              ? 'bg-blue-100 text-blue-800' 
                              : assignment.meeting_status === 'SCHEDULED'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            Meeting: {assignment.meeting_status}
                          </span>
                          <span className="text-gray-500">
                            Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {assignment.meeting_link && (
                          <a
                            href={assignment.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View Meeting
                          </a>
                        )}
                        <button
                          onClick={() => handleUnassignMentor(assignment.uuid)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Unassign
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
