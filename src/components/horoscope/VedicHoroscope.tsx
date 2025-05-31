"use client"
import React, { useEffect, useState } from 'react';
import { 
  User, Star, Brain, Target, BookOpen, Building, MapPin, Globe, 
  DollarSign, GraduationCap, ExternalLink, ChevronDown, ChevronUp,
  Sparkles, Award, TrendingUp, Users, Lightbulb, Search, Filter,
  Calendar, Phone, Mail, Clock, CheckCircle, AlertCircle, Info,
  Briefcase, Heart, Eye, Zap, Shield, Crown, Compass, Moon, Sun
} from 'lucide-react';

import { VedicHoroscopeAnalysisProps, CareerPathSummary } from '@/src/types/horoscope';
import { useHoroscope } from '@/src/hooks/useHoroscope';
import { useHoroscopeState } from '@/src/hooks/useHoroscopeState';
import { getZodiacIcon, getPlanetIcon } from '@/src/utils/horoscope/icons.utils';

import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { CollegeCard } from './CollegeCard';

export default function VedicHoroscopeAnalysis({ uuid }: VedicHoroscopeAnalysisProps) {
  const { horoscopeData: rawHoroscopeData, loading, error, refetch } = useHoroscope(uuid);
  const { selectedCareer, setSelectedCareer, expandedSections, toggleSection } = useHoroscopeState();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Function to trigger background horoscope generation
  const triggerHoroscopeGeneration = async (studentId: string) => {
    try {
      setIsGenerating(true);
      console.log(`🔄 Triggering horoscope generation for ${studentId}`);
      
      const endpoint = `https://frintor-ai-487976053532.asia-south1.run.app/horoscope/${studentId}`;
      
      await fetch(endpoint, {
        method: "POST",
      });
      
      console.log(`✅ Background task started for ${studentId}`);
      
      // Poll for data after a delay
      setTimeout(() => {
        refetch();
      }, 5000); // Wait 5 seconds before refetching
      
    } catch (err) {
      console.error(`❌ Failed to trigger background task:`, err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Safely extract horoscope data with proper type checking
  let horoscopeData = null;
  let isDataEmpty = false;
  
  if (rawHoroscopeData) {
    // Check if rawHoroscopeData has a horoscope property with array
    if ('horoscope' in rawHoroscopeData && Array.isArray(rawHoroscopeData.horoscope) && rawHoroscopeData.horoscope.length > 0) {
      horoscopeData = rawHoroscopeData.horoscope[0];
    } else {
      // Otherwise use the raw data directly
      horoscopeData = rawHoroscopeData;
    }
    
    // Check if data is effectively empty
    if (horoscopeData && typeof horoscopeData === 'object') {
      const hasMeaningfulData = 
        horoscopeData.zodiac_sign || 
        horoscopeData.personality_summary || 
        (horoscopeData.suggested_colleges && horoscopeData.suggested_colleges.length > 0) ||
        (horoscopeData.traits_analyzed && horoscopeData.traits_analyzed.length > 0);
      
      isDataEmpty = !hasMeaningfulData;
    } else {
      isDataEmpty = true;
    }
  } else {
    isDataEmpty = true;
  }

  // Trigger background generation if data is empty (but no error)
  useEffect(() => {
    if (!loading && !error && isDataEmpty && uuid && !isGenerating) {
      console.log('🔍 Horoscope data is empty, triggering background generation...');
      triggerHoroscopeGeneration(uuid);
    }
  }, [loading, error, isDataEmpty, uuid, isGenerating]);

  // Loading state
  if (loading || isGenerating) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }
  
  console.log('Raw Horoscope Data:', rawHoroscopeData);
  console.log('Processed Horoscope Data:', horoscopeData);
  console.log('Is Data Empty:', isDataEmpty);
  
  // Show generation in progress state
  if (isDataEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Generating Your Horoscope</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Our cosmic algorithms are analyzing your birth chart and creating personalized insights. 
            This may take a few moments...
          </p>
          <button 
            onClick={() => refetch()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 font-medium"
          >
            <Star className="h-4 w-4" />
            Check Progress
          </button>
        </div>
      </div>
    );
  }
  
  if (!horoscopeData) return null;

  // Initialize selected career if not set
  if (!selectedCareer && horoscopeData.suggested_colleges?.[0]?.career) {
    setSelectedCareer(horoscopeData.suggested_colleges[0].career);
  }

  // Get current career colleges
  const currentCareerColleges = horoscopeData.suggested_colleges?.find(
    item => item.career === selectedCareer
  )?.colleges || [];

  // Extract suggested career paths from colleges data
  const suggestedPaths: CareerPathSummary[] = horoscopeData.suggested_colleges?.map(item => ({
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
