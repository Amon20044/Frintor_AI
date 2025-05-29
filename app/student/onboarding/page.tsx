'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingData } from '@/lib/schemas';
import { toast } from 'sonner';
import { UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';

export default function StudentOnboarding() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (data: OnboardingData) => {
    setIsPending(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch('/student/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData?.message || 'Onboarding failed');
      }

      toast.success('Onboarding completed successfully!');
      window.location.replace('/student/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError('root', { message });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Back button */}
      <button
        onClick={() => window.location.href = '/student/auth'}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Login
      </button>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-4 rounded-full shadow-xl border-2 border-purple-200">
                  <UserPlus className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 mt-2">Help us personalize your experience</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                id="age"
                type="number"
                placeholder="Enter your age"
                {...register('age')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Time of Birth
              </label>
              <input
                id="timeOfBirth"
                type="time"
                {...register('timeOfBirth')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.timeOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.timeOfBirth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Place of Birth
              </label>
              <input
                id="placeOfBirth"
                type="text"
                placeholder="Enter your place of birth"
                {...register('placeOfBirth')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.placeOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.placeOfBirth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                {...register('gender')}
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

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Enter your category"
                {...register('category')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

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

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                Education
              </label>
              <input
                id="education"
                type="text"
                placeholder="Enter your education details"
                {...register('education')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.education && (
                <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                Interests (comma-separated)
              </label>
              <input
                id="interest"
                type="text"
                placeholder="e.g., Coding, Music, Sports"
                {...register('interest', {
                  setValueAs: (value: string) => value.split(',').map(item => item.trim()).filter(Boolean)
                })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              />
              {errors.interest && (
                <p className="text-red-500 text-sm mt-1">{errors.interest.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="md:col-span-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isPending}
                className={`w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-purple-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 ${
                  isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Completing Onboarding...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Complete Onboarding
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