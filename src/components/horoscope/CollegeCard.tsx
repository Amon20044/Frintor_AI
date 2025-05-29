
import React, { useState } from 'react';
import { 
  MapPin, DollarSign, Award, CheckCircle, Eye, Globe, ExternalLink,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { CollegeCardProps } from '@/src/types/horoscope';

export const CollegeCard: React.FC<CollegeCardProps> = ({ 
  college, 
  isSelected = false, 
  onSelect, 
  showFullDetails = false,
  customActions 
}) => {
  const [isExpanded, setIsExpanded] = useState(showFullDetails);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(college);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl border border-blue-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div 
        className="p-6 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{college.college_name}</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{college.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{college.Fees_range_of_suggestion}</span>
            </div>
          </div>
          <button className="p-2 hover:bg-blue-100 rounded-full transition-colors">
            {isExpanded ? 
              <ChevronUp className="h-5 w-5 text-blue-600" /> : 
              <ChevronDown className="h-5 w-5 text-blue-600" />
            }
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {college.course_name?.map((course, i) => (
            <span 
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              {course}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-purple-500" />
            <span>{college.degree_offered}</span>
          </div>
          {college.mode_of_entrance && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{college.mode_of_entrance.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-blue-100 bg-blue-50/30">
          <div className="pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Why This College Suits You</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{college.why_suitable}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Globe className="h-4 w-4" />
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </a>
              {customActions}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
