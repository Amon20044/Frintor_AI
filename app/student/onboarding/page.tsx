
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingData } from "@/lib/schemas";
import { toast } from "sonner";
import { ArrowRight, User, Calendar, MapPin, GraduationCap, Heart } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Tell us more about yourself to personalize your experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="10"
                  max="100"
                  placeholder="Enter your age"
                  {...register("age")}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
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
            </div>
          </div>

          {/* Birth Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Birth Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Birth (Optional)
                </label>
                <input
                  id="timeOfBirth"
                  type="time"
                  {...register("timeOfBirth")}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                />
                {errors.timeOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeOfBirth.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Place of Birth
              </label>
              <input
                id="placeOfBirth"
                type="text"
                placeholder="City, State, Country"
                {...register("placeOfBirth")}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.placeOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.placeOfBirth.message}</p>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              Education
            </h2>
            
            <div>
              <label htmlFor="lvl" className="block text-sm font-medium text-gray-700 mb-1">
                Education Level
              </label>
              <select
                id="lvl"
                {...register('lvl')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
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
          </div>

          {/* Interests Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-500" />
              Interests
            </h2>
            
            <div>
              <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                What are your interests? (Comma separated)
              </label>
              <textarea
                id="interest"
                rows={3}
                placeholder="e.g., Technology, Arts, Sports, Music, Science..."
                {...register("interest")}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200 resize-none"
              />
              {errors.interest && (
                <p className="text-red-500 text-sm mt-1">{errors.interest.message}</p>
              )}
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
          <button
            type="submit"
            disabled={isPending}
            className={`w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-purple-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Completing Profile...
              </>
            ) : (
              <>
                Complete Profile
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
