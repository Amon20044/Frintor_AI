'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Student } from '@/types/student.types';
import { Gender, Level } from '@/types/enums';
import { toast } from 'sonner';
import { User, Calendar, Phone, MapPin, Users, BookOpen, Star, Plus, Minus, AlertCircle, Shield, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface OnboardingFormData {
  uuid: string;
  age: string;
  mobile_number: string;
  dateofbirth: string;
  timeofbirth: string;
  placeofbirth: string;
  gender?: string; // Assuming undefined is intentional
  education: string;
  category: string;
  birth_date: string;
  interest: { value: string }[]; // Updated to match useFieldArray
  lvl?: string; // Assuming undefined is intentional
  studentmetadata: { classOrLevel: string; marks: string; field: string }[];
}

export default function OnboardingForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      uuid: localStorage.getItem('uuid') || '',
      age: '',
      mobile_number: '',
      dateofbirth: '',
      timeofbirth: '',
      placeofbirth: '',
      gender: undefined,
      education: '',
      category: '',
      birth_date: '01/02/2000',
      interest: [{ value: '' }],
      lvl: undefined,
      studentmetadata: [{ classOrLevel: '', marks: '', field: '' }],
    },
  });

  const { fields: interestFields, append: appendInterest, remove: removeInterest } = useFieldArray({
    control,
    name: 'interest',
  });

  const { fields: metadataFields, append: appendMetadata, remove: removeMetadata } = useFieldArray({
    control,
    name: 'studentmetadata',
  });

  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    education: true,
    interests: true,
    metadata: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const submitOnboarding = async (data: OnboardingFormData) => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('Not authenticated');
      }

      const payload: Partial<Student> = {
        ...data,
        uuid: localStorage.getItem('uuid') || '',
        onboardingcompleted: true,
      };
      console.log('Submitting onboarding with payload:', payload);

      const res = await fetch('/student/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      console.log('Response data:', responseData);

      if (!res.ok) {
        throw new Error(responseData?.message || 'Onboarding failed');
      }
      console.log('Onboarding successful, response:', responseData);
      const student = responseData.data[0] as Student;
      toast.success('Onboarding completed successfully!');
      return student;
    } catch (err) {
      console.error('Error in submitOnboarding:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      return null;
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setError('');
    const student = await submitOnboarding(data);

    if (!student) {
      console.log('No student data returned, aborting redirection');
      return;
    }

    toast.success('🎉 Onboarding successful! Your psychometric test will be generated soon in a minute... Redirecting to dashboard.');
    console.log('Onboarding successful, redirecting student:', student);

    setTimeout(() => {
      window.location.href = '/student/dashboard';
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-4 rounded-full shadow-xl border-2 border-purple-200">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 mt-2">Help us understand you better to personalize your experience</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl border border-purple-100">
              <button
                type="button"
                onClick={() => toggleSection('personal')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                </div>
                {expandedSections.personal ? (
                  <ChevronUp className="h-5 w-5 text-purple-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-600" />
                )}
              </button>
              {expandedSections.personal && (
                <div className="p-4 space-y-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age *
                    </label>
                    <input
                      id="age"
                      type="number"
                      {...register('age', {
                        required: 'Age is required',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Age must be positive' },
                      })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                      aria-invalid={errors.age ? 'true' : 'false'}
                      aria-describedby={errors.age ? 'age-error' : undefined}
                    />
                    {errors.age && (
                      <p id="age-error" className="text-red-500 text-sm mt-1">
                        {errors.age.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="mobile_number"
                        type="tel"
                        {...register('mobile_number', {
                          required: 'Mobile number is required',
                          pattern: {
                            value: /^\+?[1-9]\d{1,14}$/,
                            message: 'Enter a valid mobile number',
                          },
                        })}
                        className="w-full p-3 pl-10 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                        aria-invalid={errors.mobile_number ? 'true' : 'false'}
                        aria-describedby={errors.mobile_number ? 'mobile_number-error' : undefined}
                      />
                    </div>
                    {errors.mobile_number && (
                      <p id="mobile_number-error" className="text-red-500 text-sm mt-1">
                        {errors.mobile_number.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="dateofbirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="dateofbirth"
                        type="date"
                        {...register('dateofbirth', { required: 'Date of birth is required' })}
                        className="w-full p-3 pl-10 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                        aria-invalid={errors.dateofbirth ? 'true' : 'false'}
                        aria-describedby={errors.dateofbirth ? 'dateofbirth-error' : undefined}
                      />
                    </div>
                    {errors.dateofbirth && (
                      <p id="dateofbirth-error" className="text-red-500 text-sm mt-1">
                        {errors.dateofbirth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="timeofbirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Time of Birth *
                    </label>
                    <input
                      id="timeofbirth"
                      type="time"
                      {...register('timeofbirth', { required: 'Time of birth is required' })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                      aria-invalid={errors.timeofbirth ? 'true' : 'false'}
                      aria-describedby={errors.timeofbirth ? 'timeofbirth-error' : undefined}
                    />
                    {errors.timeofbirth && (
                      <p id="timeofbirth-error" className="text-red-500 text-sm mt-1">
                        {errors.timeofbirth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="placeofbirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Place of Birth (City, State, Country) *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="placeofbirth"
                        type="text"
                        {...register('placeofbirth', { required: 'Place of birth is required' })}
                        className="w-full p-3 pl-10 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                        aria-invalid={errors.placeofbirth ? 'true' : 'false'}
                        aria-describedby={errors.placeofbirth ? 'placeofbirth-error' : undefined}
                      />
                    </div>
                    {errors.placeofbirth && (
                      <p id="placeofbirth-error" className="text-red-500 text-sm mt-1">
                        {errors.placeofbirth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="gender"
                        {...register('gender', { required: 'Gender is required' })}
                        className="w-full p-3 pl-10 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200 appearance-none"
                        aria-invalid={errors.gender ? 'true' : 'false'}
                        aria-describedby={errors.gender ? 'gender-error' : undefined}
                      >
                        <option value="">Select Gender</option>
                        {Object.values(Gender).map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.gender && (
                      <p id="gender-error" className="text-red-500 text-sm mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl border border-purple-100">
              <button
                type="button"
                onClick={() => toggleSection('education')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Education Details</h2>
                </div>
                {expandedSections.education ? (
                  <ChevronUp className="h-5 w-5 text-purple-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-600" />
                )}
              </button>
              {expandedSections.education && (
                <div className="p-4 space-y-4">
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Education *
                    </label>
                    <input
                      id="education"
                      type="text"
                      {...register('education', { required: 'Education is required' })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                      placeholder="e.g., Bachelor's, Master's"
                      aria-invalid={errors.education ? 'true' : 'false'}
                      aria-describedby={errors.education ? 'education-error' : undefined}
                    />
                    {errors.education && (
                      <p id="education-error" className="text-red-500 text-sm mt-1">
                        {errors.education.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      id="category"
                      type="text"
                      {...register('category', { required: 'Category is required' })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                      placeholder="e.g., General, OBC"
                      aria-invalid={errors.category ? 'true' : 'false'}
                      aria-describedby={errors.category ? 'category-error' : undefined}
                    />
                    {errors.category && (
                      <p id="category-error" className="text-red-500 text-sm mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lvl" className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select
                      id="lvl"
                      {...register('lvl', { required: 'Level is required' })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200 appearance-none"
                      aria-invalid={errors.lvl ? 'true' : 'false'}
                      aria-describedby={errors.lvl ? 'lvl-error' : undefined}
                    >
                      <option value="">Select Level</option>
                      {Object.values(Level).map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.lvl && (
                      <p id="lvl-error" className="text-red-500 text-sm mt-1">
                        {errors.lvl.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interests Section */}
            <div className="bg-white rounded-xl border border-purple-100">
              <button
                type="button"
                onClick={() => toggleSection('interests')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Interests</h2>
                </div>
                {expandedSections.interests ? (
                  <ChevronUp className="h-5 w-5 text-purple-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-600" />
                )}
              </button>
              {expandedSections.interests && (
                <div className="p-4 space-y-4">
                  {interestFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        {...register(`interest.${index}`, { required: 'Interest is required' })}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                        placeholder="e.g., Coding, Music"
                        aria-invalid={errors.interest?.[index] ? 'true' : 'false'}
                        aria-describedby={errors.interest?.[index] ? `interest-${index}-error` : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
                        aria-label="Remove interest"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {errors.interest && (
                    <p id="interest-error" className="text-red-500 text-sm">
                      At least one interest is required
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => appendInterest('')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    Add Interest
                  </button>
                </div>
              )}
            </div>

            {/* Student Metadata Section */}
            <div className="bg-white rounded-xl border border-purple-100">
              <button
                type="button"
                onClick={() => toggleSection('metadata')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Student Metadata</h2>
                </div>
                {expandedSections.metadata ? (
                  <ChevronUp className="h-5 w-5 text-purple-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-600" />
                )}
              </button>
              {expandedSections.metadata && (
                <div className="p-4 space-y-4">
                  {metadataFields.map((metaField, metaIndex) => (
                    <div key={metaField.id} className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor={`studentmetadata.${metaIndex}.classOrLevel`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Class or Level *
                          </label>
                          <input
                            id={`studentmetadata.${metaIndex}.classOrLevel`}
                            type="text"
                            {...register(`studentmetadata.${metaIndex}.classOrLevel`, {
                              required: 'Class or level is required',
                            })}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                            placeholder="e.g., 10th, BTech"
                            aria-invalid={errors.studentmetadata?.[metaIndex]?.classOrLevel ? 'true' : 'false'}
                            aria-describedby={
                              errors.studentmetadata?.[metaIndex]?.classOrLevel
                                ? `classOrLevel-${metaIndex}-error`
                                : undefined
                            }
                          />
                          {errors.studentmetadata?.[metaIndex]?.classOrLevel && (
                            <p id={`classOrLevel-${metaIndex}-error`} className="text-red-500 text-sm mt-1">
                              {errors.studentmetadata[metaIndex].classOrLevel?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor={`studentmetadata.${metaIndex}.marks`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Marks *
                          </label>
                          <input
                            id={`studentmetadata.${metaIndex}.marks`}
                            type="text"
                            {...register(`studentmetadata.${metaIndex}.marks`, {
                              required: 'Marks are required',
                            })}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                            placeholder="e.g., 90%, 8.2 CGPA"
                            aria-invalid={errors.studentmetadata?.[metaIndex]?.marks ? 'true' : 'false'}
                            aria-describedby={
                              errors.studentmetadata?.[metaIndex]?.marks ? `marks-${metaIndex}-error` : undefined
                            }
                          />
                          {errors.studentmetadata?.[metaIndex]?.marks && (
                            <p id={`marks-${metaIndex}-error`} className="text-red-500 text-sm mt-1">
                              {errors.studentmetadata[metaIndex].marks?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor={`studentmetadata.${metaIndex}.field`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Field *
                          </label>
                          <input
                            id={`studentmetadata.${metaIndex}.field`}
                            type="text"
                            {...register(`studentmetadata.${metaIndex}.field`, {
                              required: 'Field is required',
                            })}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                            placeholder="e.g., CSE, Mech"
                            aria-invalid={errors.studentmetadata?.[metaIndex]?.field ? 'true' : 'false'}
                            aria-describedby={
                              errors.studentmetadata?.[metaIndex]?.field ? `field-${metaIndex}-error` : undefined
                            }
                          />
                          {errors.studentmetadata?.[metaIndex]?.field && (
                            <p id={`field-${metaIndex}-error`} className="text-red-500 text-sm mt-1">
                              {errors.studentmetadata[metaIndex].field?.message}
                            </p>
                          )}
                        </div>
                        <CustomFields
                          control={control}
                          metaIndex={metaIndex}
                          errors={errors}
                          register={register}
                        />
                        <button
                          type="button"
                          onClick={() => removeMetadata(metaIndex)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
                        >
                          <Minus className="h-5 w-5" />
                          Remove Metadata Entry
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendMetadata({ classOrLevel: '', marks: '', field: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    Add Metadata Entry
                  </button>
                  {errors.studentmetadata && (
                    <p id="metadata-error" className="text-red-500 text-sm">
                      At least one metadata entry is required
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p id="form-error" className="text-red-700 text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Complete Onboarding
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Your data is secure and confidential</span>
            </div>
            <p className="text-xs">This information helps us tailor your psychometric test</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomFields({ control, metaIndex, errors, register }: any) {
  const { fields: customFields, append: appendCustomField, remove: removeCustomField } = useFieldArray({
    control,
    name: `studentmetadata.${metaIndex}.customFields`,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Additional Fields</label>
      {customFields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <input
            type="text"
            {...register(`studentmetadata.${metaIndex}.customFields.${index}.key`, {
              required: 'Field name is required',
            })}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
            placeholder="e.g., Achievements"
            aria-invalid={
              errors.studentmetadata?.[metaIndex]?.customFields?.[index]?.key ? 'true' : 'false'
            }
            aria-describedby={
              errors.studentmetadata?.[metaIndex]?.customFields?.[index]?.key
                ? `custom-key-${metaIndex}-${index}-error`
                : undefined
            }
          />
          {errors.studentmetadata?.[metaIndex]?.customFields?.[index]?.key && (
            <p id={`custom-key-${metaIndex}-${index}-error`} className="text-red-500 text-sm">
              {errors.studentmetadata[metaIndex].customFields[index].key?.message}
            </p>
          )}
          <input
            type="text"
            {...register(`studentmetadata.${metaIndex}.customFields.${index}.value`, {
              required: 'Value is required',
            })}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
            placeholder="e.g., Won science fair"
            aria-invalid={
              errors.studentmetadata?.[metaIndex]?.customFields?.[index]?.value ? 'true' : 'false'
            }
            aria-describedby={
              errors.studentmetadata?.[metaIndex]?.customFields?.[index]?.value
                ? `custom-value-${metaIndex}-${index}-error`
                : undefined
            }
          />
          {errors.studentmetadata?.[metaIndex]?.customFields?.[index]?.value && (
            <p id={`custom-value-${metaIndex}-${index}-error`} className="text-red-500 text-sm">
              {errors.studentmetadata[metaIndex].customFields[index].value?.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => removeCustomField(index)}
            className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
            aria-label="Remove custom field"
          >
            <Minus className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendCustomField({ key: '', value: '' })}
        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 transition-all duration-200"
      >
        <Plus className="h-5 w-5" />
        Add Custom Field
      </button>
    </div>
  );
}