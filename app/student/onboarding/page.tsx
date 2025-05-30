
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingData } from "@/lib/schemas";
import { toast } from "sonner";
import { ArrowRight, User, Calendar, MapPin, GraduationCap, Heart, Home, Phone, Users, Target } from "lucide-react";

export default function OnboardingPage() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
  });

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    placeholder="Manav"
                    {...register("first_name")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    placeholder="Mehta"
                    {...register("last_name")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="manavmehta@gmail.com"
                    {...register("email")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact No.
                  </label>
                  <input
                    id="mobile_number"
                    type="tel"
                    placeholder="+91 9856347345"
                    {...register("mobile_number")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                  {errors.mobile_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile_number.message}</p>
                  )}
                </div>

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
                    placeholder="Gandhinagar, Gujarat"
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
                    placeholder="Gandhinagar, Gujarat"
                    {...register("current_address")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Time of Birth (Optional)
                  </label>
                  <input
                    id="timeOfBirth"
                    type="time"
                    {...register("timeOfBirth")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Place of Birth
                  </label>
                  <input
                    id="placeOfBirth"
                    type="text"
                    placeholder="City, State, Country"
                    {...register("placeOfBirth")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Academic Details Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 border-b border-gray-200 pb-3">
                <GraduationCap className="h-6 w-6 text-purple-500" />
                Academic Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="tenth_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                    10th Percentage
                  </label>
                  <input
                    id="tenth_percentage"
                    type="text"
                    placeholder="80%"
                    {...register("tenth_percentage")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="twelfth_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                    12th Percentage
                  </label>
                  <input
                    id="twelfth_percentage"
                    type="text"
                    placeholder="71%"
                    {...register("twelfth_percentage")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="academic_background" className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Background
                  </label>
                  <select
                    id="academic_background"
                    {...register("academic_background")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  >
                    <option value="">Select Background</option>
                    <option value="Senior Secondary">Senior Secondary</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Biology"
                    {...register("subject")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="lvl" className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level
                  </label>
                  <select
                    id="lvl"
                    {...register('lvl')}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  >
                    <option value="">Select Level</option>
                    <option value="MID_SCHOOL">Mid School</option>
                    <option value="HIGH_SCHOOL">High School</option>
                    <option value="UNDERGRADUATE">Undergraduate</option>
                    <option value="POSTGRADUATE">Postgraduate</option>
                    <option value="WORKING_PROFESSIONAL">Working Professional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="tenth_marksheet" className="block text-sm font-medium text-gray-700 mb-2">
                    10th Marksheet Details
                  </label>
                  <textarea
                    id="tenth_marksheet"
                    rows={3}
                    placeholder="Board, Year, Marks, etc."
                    {...register("tenth_marksheet")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="twelfth_marksheet" className="block text-sm font-medium text-gray-700 mb-2">
                    12th Marksheet Details
                  </label>
                  <textarea
                    id="twelfth_marksheet"
                    rows={3}
                    placeholder="Board, Year, Marks, etc."
                    {...register("twelfth_marksheet")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="other_certificate" className="block text-sm font-medium text-gray-700 mb-2">
                    Other Certificate
                  </label>
                  <textarea
                    id="other_certificate"
                    rows={3}
                    placeholder="Any additional certificates"
                    {...register("other_certificate")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="neet_marksheet" className="block text-sm font-medium text-gray-700 mb-2">
                    Competitive Exam Details
                  </label>
                  <textarea
                    id="neet_marksheet"
                    rows={3}
                    placeholder="NEET/JEE/Other exam details"
                    {...register("neet_marksheet")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

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
                    placeholder="Budget, Location, Scholarship preferences..."
                    {...register("preferences")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                    <Heart className="h-4 w-4 inline mr-1" />
                    Interests
                  </label>
                  <textarea
                    id="interest"
                    rows={4}
                    placeholder="Biology, Leadership, Technology, Arts..."
                    {...register("interest")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="career_goals" className="block text-sm font-medium text-gray-700 mb-2">
                  Career Goals
                </label>
                <textarea
                  id="career_goals"
                  rows={3}
                  placeholder="Doctor (MBBS), Engineer, etc."
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
                    placeholder="Arun Mehta"
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
                    placeholder="Jaimini Mehta"
                    {...register("mother_name")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="father_birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Birth Date
                  </label>
                  <input
                    id="father_birth_date"
                    type="date"
                    {...register("father_birth_date")}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="mother_birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Birth Date
                  </label>
                  <input
                    id="mother_birth_date"
                    type="date"
                    {...register("mother_birth_date")}
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
                    placeholder="+91 9856347345"
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
                    placeholder="+91 9856347345"
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
