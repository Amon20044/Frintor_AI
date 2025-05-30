
import React from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, BookOpen, 
  Award, CheckCircle, AlertCircle, GraduationCap,
  Clock, Star, Target
} from 'lucide-react';

export interface StudentProfileData {
  uuid: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_number?: string;
  age?: string;
  gender?: string;
  dateofbirth?: string;
  timeofbirth?: string;
  placeofbirth?: string;
  lvl?: string;
  education?: string;
  category?: string;
  interest?: string[];
  onboardingcompleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface StudentProfileProps {
  student: StudentProfileData;
  showActions?: boolean;
  onEdit?: () => void;
  onAssignMentor?: () => void;
  onViewHoroscope?: () => void;
  variant?: 'card' | 'detailed' | 'compact';
  className?: string;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ 
  student, 
  showActions = false,
  onEdit,
  onAssignMentor,
  onViewHoroscope,
  variant = 'card',
  className = ''
}) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const renderCompactView = () => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(student.first_name, student.last_name)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {student.first_name} {student.last_name}
          </h3>
          <p className="text-sm text-gray-600">{student.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            student.onboardingcompleted 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {student.onboardingcompleted ? 'Complete' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );

  const renderCardView = () => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {getInitials(student.first_name, student.last_name)}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {student.first_name} {student.last_name}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{student.email}</span>
          </div>
          {student.mobile_number && (
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{student.mobile_number}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              student.onboardingcompleted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {student.onboardingcompleted ? (
                <>
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Onboarding Complete
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  Onboarding Pending
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {student.lvl && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Level: {student.lvl}</span>
          </div>
        )}
        {student.age && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Age: {student.age}</span>
          </div>
        )}
        {student.placeofbirth && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">{student.placeofbirth}</span>
          </div>
        )}
        {student.education && (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">{student.education}</span>
          </div>
        )}
      </div>

      {student.interest && student.interest.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            Interests
          </h4>
          <div className="flex flex-wrap gap-1">
            {student.interest.map((interest, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              Edit Profile
            </button>
          )}
          {onAssignMentor && (
            <button
              onClick={onAssignMentor}
              className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
            >
              Assign Mentor
            </button>
          )}
          {onViewHoroscope && (
            <button
              onClick={onViewHoroscope}
              className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              View Horoscope
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderDetailedView = () => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 ${className}`}>
      <div className="flex items-start gap-6 mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(student.first_name, student.last_name)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {student.first_name} {student.last_name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{student.email}</span>
            </div>
            {student.mobile_number && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{student.mobile_number}</span>
              </div>
            )}
            {student.dateofbirth && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">DOB: {formatDate(student.dateofbirth)}</span>
              </div>
            )}
            {student.timeofbirth && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Time: {student.timeofbirth}</span>
              </div>
            )}
          </div>
          <div className="mt-3">
            <span className={`text-sm px-4 py-2 rounded-full font-medium ${
              student.onboardingcompleted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {student.onboardingcompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Onboarding Complete
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Onboarding Pending
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {student.lvl && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Academic Level</h3>
            </div>
            <p className="text-gray-700">{student.lvl}</p>
          </div>
        )}
        {student.education && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Education</h3>
            </div>
            <p className="text-gray-700">{student.education}</p>
          </div>
        )}
        {student.placeofbirth && (
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Place of Birth</h3>
            </div>
            <p className="text-gray-700">{student.placeofbirth}</p>
          </div>
        )}
      </div>

      {student.interest && student.interest.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Areas of Interest
          </h3>
          <div className="flex flex-wrap gap-2">
            {student.interest.map((interest, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
          {onAssignMentor && (
            <button
              onClick={onAssignMentor}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Assign Mentor
            </button>
          )}
          {onViewHoroscope && (
            <button
              onClick={onViewHoroscope}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              View Horoscope
            </button>
          )}
        </div>
      )}
    </div>
  );

  switch (variant) {
    case 'compact':
      return renderCompactView();
    case 'detailed':
      return renderDetailedView();
    default:
      return renderCardView();
  }
};

export default StudentProfile;
