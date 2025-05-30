
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingData } from "@/lib/schemas";
import { toast } from "sonner";
import { ArrowRight, User, Calendar, MapPin, GraduationCap, Heart, Home, Phone, Users, Target, Briefcase, Star } from "lucide-react";

export default function OnboardingPage() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
  });

  const selectedEducationLevel = watch("lvl");

  const submitOnboarding = async (data: OnboardingData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch("/api/student/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData?.message || "Onboarding failed");
      }

      return responseData;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      console.error("Error in submitOnboarding:", message);
      setError("root", { message });
      return null;
    }
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsPending(true);

    try {
      const result = await submitOnboarding(data);

      if (!result) {
        setIsPending(false);
        return;
      }

      toast.success("Onboarding completed successfully!");
      window.location.replace("/student/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error("Something went wrong during onboarding.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Tell us more about yourself to personalize your experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 border-b border-gray-200 pb-3">
                <User className="h-6 w-6 text-purple-500" />
                Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    {...register("category")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="10"
                    max="100"
                    placeholder="20"
                    {...register("age")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="permanent_address" className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="h-4 w-4 inline mr-1" />
                    Permanent Address
                  </label>
                  <textarea
                    id="permanent_address"
                    rows={3}
                    placeholder="123, ABC Society, Ahmedabad, Gujarat - 380001"
                    {...register("permanent_address")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="current_address" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Current Address
                  </label>
                  <textarea
                    id="current_address"
                    rows={3}
                    placeholder="456, PQR Hostel, Mumbai, Maharashtra - 400001"
                    {...register("current_address")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Horoscope Requirements Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 border-b border-gray-200 pb-3">
                <Star className="h-6 w-6 text-purple-500" />
                Horoscope Requirements
                <span className="text-sm font-normal text-gray-500 ml-2">(Required for Vedic Career Guidance)</span>
              </h2>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
                <p className="text-purple-700 text-sm">
                  <Star className="h-4 w-4 inline mr-1" />
                  Your birth details are used to generate a personalized Vedic horoscope for accurate career guidance. This information is kept confidential and secure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Time of Birth *
                  </label>
                  <input
                    id="timeOfBirth"
                    type="time"
                    {...register("timeOfBirth")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.timeOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Place of Birth *
                  </label>
                  <input
                    id="placeOfBirth"
                    type="text"
                    placeholder="Mumbai, Maharashtra, India"
                    {...register("placeOfBirth")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.placeOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.placeOfBirth.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Details Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 border-b border-gray-200 pb-3">
                <GraduationCap className="h-6 w-6 text-purple-500" />
                Academic Details
              </h2>
              
              {/* Education Level Selection */}
              <div className="mb-6">
                <label htmlFor="lvl" className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level *
                </label>
                <select
                  id="lvl"
                  {...register('lvl')}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 max-w-xs"
                >
                  <option value="">Select Level</option>
                  <option value="MID_SCHOOL">Mid School</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="UNDERGRADUATE">Undergraduate</option>
                  <option value="POSTGRADUATE">Postgraduate</option>
                  <option value="WORKING_PROFESSIONAL">Working Professional</option>
                </select>
                {errors.lvl && (
                  <p className="text-red-500 text-sm mt-1">{errors.lvl.message}</p>
                )}
              </div>

              {/* 10th Grade Details - Always shown */}
              {selectedEducationLevel && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-700 border-l-4 border-purple-400 pl-3">
                    10th Grade Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="tenth_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                        10th Percentage *
                      </label>
                      <input
                        id="tenth_percentage"
                        type="text"
                        placeholder="85%"
                        {...register("tenth_percentage")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="tenth_year" className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Passing
                      </label>
                      <input
                        id="tenth_year"
                        type="text"
                        placeholder="2020"
                        {...register("tenth_year")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="other_certificate" className="block text-sm font-medium text-gray-700 mb-2">
                        Achievements/Certificates
                      </label>
                      <input
                        id="other_certificate"
                        type="text"
                        placeholder="Olympiad, Merit certificates"
                        {...register("other_certificate")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 12th Grade Details - For High School and above */}
              {(selectedEducationLevel === "HIGH_SCHOOL" || 
                selectedEducationLevel === "UNDERGRADUATE" || 
                selectedEducationLevel === "POSTGRADUATE" || 
                selectedEducationLevel === "WORKING_PROFESSIONAL") && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-700 border-l-4 border-purple-400 pl-3">
                    12th Grade Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label htmlFor="twelfth_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                        12th Percentage *
                      </label>
                      <input
                        id="twelfth_percentage"
                        type="text"
                        placeholder="78%"
                        {...register("twelfth_percentage")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="twelfth_year" className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Passing
                      </label>
                      <input
                        id="twelfth_year"
                        type="text"
                        placeholder="2022"
                        {...register("twelfth_year")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="academic_background" className="block text-sm font-medium text-gray-700 mb-2">
                        Stream *
                      </label>
                      <select
                        id="academic_background"
                        {...register("academic_background")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      >
                        <option value="">Select Stream</option>
                        <option value="Science">Science</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                        <option value="Vocational">Vocational</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="competitive_exams" className="block text-sm font-medium text-gray-700 mb-2">
                        Competitive Exams
                      </label>
                      <input
                        id="competitive_exams"
                        type="text"
                        placeholder="JEE, NEET, CET"
                        {...register("competitive_exams")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Undergraduate Details */}
              {(selectedEducationLevel === "UNDERGRADUATE" || 
                selectedEducationLevel === "POSTGRADUATE" || 
                selectedEducationLevel === "WORKING_PROFESSIONAL") && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-700 border-l-4 border-purple-400 pl-3">
                    Undergraduate Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label htmlFor="institute" className="block text-sm font-medium text-gray-700 mb-2">
                        Institute/College *
                      </label>
                      <input
                        id="institute"
                        type="text"
                        placeholder="IIT Bombay"
                        {...register("institute")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                        Branch/Department *
                      </label>
                      <input
                        id="branch"
                        type="text"
                        placeholder="Computer Science"
                        {...register("branch")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="cgpa_cpi" className="block text-sm font-medium text-gray-700 mb-2">
                        CGPA/CPI
                      </label>
                      <input
                        id="cgpa_cpi"
                        type="text"
                        placeholder="8.5"
                        {...register("cgpa_cpi")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700 mb-2">
                        Graduation Year
                      </label>
                      <input
                        id="graduation_year"
                        type="text"
                        placeholder="2024"
                        {...register("graduation_year")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Postgraduate Details */}
              {(selectedEducationLevel === "POSTGRADUATE" || 
                selectedEducationLevel === "WORKING_PROFESSIONAL") && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-700 border-l-4 border-purple-400 pl-3">
                    Postgraduate Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label htmlFor="pg_institute" className="block text-sm font-medium text-gray-700 mb-2">
                        PG Institute *
                      </label>
                      <input
                        id="pg_institute"
                        type="text"
                        placeholder="IIM Ahmedabad"
                        {...register("pg_institute")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="pg_branch" className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization *
                      </label>
                      <input
                        id="pg_branch"
                        type="text"
                        placeholder="MBA Marketing"
                        {...register("pg_branch")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="pg_cgpa_cpi" className="block text-sm font-medium text-gray-700 mb-2">
                        PG CGPA/CPI
                      </label>
                      <input
                        id="pg_cgpa_cpi"
                        type="text"
                        placeholder="9.2"
                        {...register("pg_cgpa_cpi")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="pg_graduation_year" className="block text-sm font-medium text-gray-700 mb-2">
                        PG Graduation Year
                      </label>
                      <input
                        id="pg_graduation_year"
                        type="text"
                        placeholder="2026"
                        {...register("pg_graduation_year")}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Experience Section - Only for Working Professionals */}
            {selectedEducationLevel === "WORKING_PROFESSIONAL" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <Briefcase className="h-6 w-6 text-purple-500" />
                  Professional Experience
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      id="company_name"
                      type="text"
                      placeholder="Google India"
                      {...register("company_name")}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title/Position *
                    </label>
                    <input
                      id="job_title"
                      type="text"
                      placeholder="Software Engineer"
                      {...register("job_title")}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      id="experience_years"
                      type="text"
                      placeholder="2.5 years"
                      {...register("experience_years")}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="current_salary" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Salary (LPA)
                    </label>
                    <input
                      id="current_salary"
                      type="text"
                      placeholder="12 LPA"
                      {...register("current_salary")}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences & Interests Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 border-b border-gray-200 pb-3">
                <Target className="h-6 w-6 text-purple-500" />
                Preferences & Interests
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferences
                  </label>
                  <textarea
                    id="preferences"
                    rows={4}
                    placeholder="Budget: 10-15 LPA, Location: Bangalore/Mumbai, Scholarship: Merit-based, Work Environment: Startup/Corporate"
                    {...register("preferences")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                    <Heart className="h-4 w-4 inline mr-1" />
                    Interests *
                  </label>
                  <textarea
                    id="interest"
                    rows={4}
                    placeholder="Programming, Machine Learning, Data Science, Leadership, Music, Photography, Sports"
                    {...register("interest")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                  {errors.interest && (
                    <p className="text-red-500 text-sm mt-1">{errors.interest.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="career_goals" className="block text-sm font-medium text-gray-700 mb-2">
                  Career Goals
                </label>
                <textarea
                  id="career_goals"
                  rows={3}
                  placeholder="Become a Senior Software Engineer at FAANG company, Start my own tech company, Pursue higher studies in AI/ML"
                  {...register("career_goals")}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Parent's Details Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 border-b border-gray-200 pb-3">
                <Users className="h-6 w-6 text-purple-500" />
                Parent's Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name
                  </label>
                  <input
                    id="father_name"
                    type="text"
                    placeholder="Suresh Kumar Sharma"
                    {...register("father_name")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Name
                  </label>
                  <input
                    id="mother_name"
                    type="text"
                    placeholder="Priya Sharma"
                    {...register("mother_name")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="father_contact" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Father's Contact
                  </label>
                  <input
                    id="father_contact"
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register("father_contact")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="mother_contact" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Mother's Contact
                  </label>
                  <input
                    id="mother_contact"
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register("mother_contact")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm font-medium">
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isPending}
                className={`px-12 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:from-purple-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 text-lg ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    Completing Profile...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <ArrowRight className="h-6 w-6" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
