"use client"
import React, { useState, useEffect } from 'react';
import { 
  User, Star, Brain, Target, BookOpen, Building, MapPin, Globe, 
  DollarSign, GraduationCap, ExternalLink, ChevronDown, ChevronUp,
  Sparkles, Award, TrendingUp, Users, Lightbulb, Search, Filter,
  Calendar, Phone, Mail, Clock, CheckCircle, AlertCircle, Info,
  Briefcase, Heart, Eye, Zap, Shield, Crown, Compass, Moon, Sun
} from 'lucide-react';

// Main component
export default function VedicHoroscopeAnalysis({ uuid }) {
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  // Fetch horoscope data
  const getHoroscope = async (uuid) => {
    try {
      const response = await fetch(`/student/api/getHoroscope/${uuid}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token') || ''}`  
      }});
      console.log('Response from getHoroscope:', response);
      if (!response.ok) {
        throw new Error('Failed to fetch horoscope data');
      }

      const data = await response.json();
      console.log('Horoscope data:', data.data.horoscope[0]);
      return data.data.horoscope[0];
    } catch (error) {
      throw new Error(`Error fetching horoscope: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!uuid) {
        // Use sample data if no UUID provided
        const sampleData = {
          "zodiac_sign": "Gemini",
          "career_guidance": "Pursue careers that leverage leadership, strategy, and innovation, with a focus on rapid growth and intellectual stimulation",
          "traits_analyzed": ["leadership", "strategy", "innovation", "adaptability", "collaborative communication"],
          "personality_summary": "Driven, growth-oriented, natural leader, systematic approach, intuitive thinking, values intellectual stimulation",
          "planetary_influences": [
            {
              "house": "10th",
              "planet": "Saturn",
              "analysis_of_effect": "Indicates a strong desire for professional recognition, responsibility, and authority, with a potential for leadership roles"
            },
            {
              "house": "1st", 
              "planet": "Mars",
              "analysis_of_effect": "Suggests a driven and ambitious individual with a strong desire for personal and professional growth, and a tendency to take bold action"
            },
            {
              "house": "9th",
              "planet": "Jupiter", 
              "analysis_of_effect": "Indicates a strong interest in learning, personal growth, and exploration, with a potential for success in fields related to education, philosophy, or international relations"
            },
            {
              "house": "3rd",
              "planet": "Mercury",
              "analysis_of_effect": "Suggests strong communication and analytical skills, with a potential for success in fields related to writing, speaking, or technology"
            },
            {
              "house": "5th",
              "planet": "Rahu", 
              "analysis_of_effect": "Indicates a strong desire for innovation, creativity, and experimentation, with a potential for success in fields related to technology, entrepreneurship"
            }
          ],
          "suggested_colleges": [
            {
              "career": "Management Consulting",
              "colleges": [
                {
                  "website": "https://www.iima.ac.in/",
                  "location": "Ahmedabad, Gujarat",
                  "course_name": ["Post Graduate Program in Management (PGP)"],
                  "college_name": "Indian Institute of Management (IIM) Ahmedabad",
                  "why_suitable": "One of the top management institutes in India, with a strong reputation for producing talented consultants",
                  "degree_offered": "MBA",
                  "mode_of_entrance": ["CAT"],
                  "Fees_range_of_suggestion": "20-25 lakhs"
                }
              ]
            }
          ],
          "additional_notes": "It is essential to note that while these suggestions are based on the individual's horoscope and psychometric traits, they should not be taken as the only consideration for career choices."
        };
        setHoroscopeData(sampleData);
        setSelectedCareer(sampleData.suggested_colleges?.[0]?.career || '');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getHoroscope(uuid);
        setHoroscopeData(data);
        setSelectedCareer(data.suggested_colleges?.[0]?.career || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get zodiac icon
  const getZodiacIcon = (sign) => {
    const icons = {
      'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
      'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
      'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    return icons[sign] || '✨';
  };

  // Get planet icon
  const getPlanetIcon = (planet) => {
    const icons = {
      'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
      'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄',
      'Rahu': '☊', 'Ketu': '☋', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
    };
    return icons[planet] || '✧';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading your cosmic insights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Horoscope</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!horoscopeData) return null;

  // Get current career colleges
  const currentCareerColleges = horoscopeData.suggested_colleges?.find(
    item => item.career === selectedCareer
  )?.colleges || [];

  // Extract suggested career paths from colleges data
  const suggestedPaths = horoscopeData.suggested_colleges?.map(item => ({
    career: item.career,
    colleges_count: item.colleges?.length || 0
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-blue-200">
                <div className="text-4xl text-blue-600">
                  {getZodiacIcon(horoscopeData.zodiac_sign)}
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Vedic Horoscope Analysis
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover your cosmic blueprint and unlock your career potential through ancient Vedic wisdom
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Sidebar - Profile Overview */}
          <div className="xl:col-span-4 space-y-6">
            {/* Zodiac Sign Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
                  <div className="text-2xl font-bold">
                    {getZodiacIcon(horoscopeData.zodiac_sign)}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{horoscopeData.zodiac_sign}</h2>
                  <p className="text-gray-600">Your Zodiac Sign</p>
                </div>
              </div>
              
              {horoscopeData.personality_summary && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Personality Summary
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{horoscopeData.personality_summary}"
                  </p>
                </div>
              )}
            </div>

            {/* Key Traits */}
            {horoscopeData.traits_analyzed && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Key Traits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {horoscopeData.traits_analyzed.map((trait, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-all duration-200"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Career Guidance */}
            {horoscopeData.career_guidance && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Career Guidance
                </h3>
                <p className="text-gray-700 leading-relaxed">{horoscopeData.career_guidance}</p>
              </div>
            )}

            {/* Planetary Influences */}
            {horoscopeData.planetary_influences && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <button
                  onClick={() => toggleSection('planetary')}
                  className="w-full p-6 text-left hover:bg-blue-50/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Planetary Influences</h3>
                  </div>
                  {expandedSections.planetary ? 
                    <ChevronUp className="h-5 w-5 text-blue-600" /> : 
                    <ChevronDown className="h-5 w-5 text-blue-600" />
                  }
                </button>
                
                {expandedSections.planetary && (
                  <div className="px-6 pb-6 space-y-4">
                    {horoscopeData.planetary_influences.map((influence, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl text-blue-600">
                            {getPlanetIcon(influence.planet)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {influence.planet}
                              <span className="text-sm text-gray-600 ml-2">
                                {influence.house} House
                              </span>
                            </h4>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {influence.analysis_of_effect}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content - Career Paths and Colleges */}
          <div className="xl:col-span-8 space-y-8">
            {/* Career Paths */}
            {suggestedPaths.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Recommended Career Paths</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {suggestedPaths.map((path, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCareer(path.career)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                        selectedCareer === path.career
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 shadow-lg scale-105'
                          : 'bg-white hover:bg-blue-50 text-gray-900 border-blue-200 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <h3 className="font-semibold mb-2">{path.career}</h3>
                      <div className="flex items-center gap-2 text-sm opacity-80">
                        <Building className="h-4 w-4" />
                        <span>{path.colleges_count} colleges</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* College Recommendations */}
            {currentCareerColleges.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recommended Colleges
                    {selectedCareer && (
                      <span className="text-lg font-normal text-gray-600 ml-2">
                        for {selectedCareer}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="space-y-4">
                  {currentCareerColleges.map((college, index) => (
                    <CollegeCard key={index} college={college} />
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {horoscopeData.additional_notes && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Important Note</h3>
                    <p className="text-amber-800 leading-relaxed">{horoscopeData.additional_notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <p className="text-sm">Powered by Vedic Astrology & Modern Career Science</p>
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-xs">
            These insights are based on your birth chart and psychometric analysis. 
            Please consult with career counselors for comprehensive guidance.
          </p>
        </footer>
      </div>
    </div>
  );
}

// College Card Component
const CollegeCard = ({ college }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl border border-blue-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
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
          </div>
        </div>
      )}
    </div>
  );
};