'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Student } from '@/types/student.types';
import { toast } from 'sonner';
import { UserPlus, AlertCircle, Shield } from 'lucide-react';

type RegisterFormData = {
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
  password: string;
  final_pass: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      mobile_number: '',
      email: '',
      password: '',
      final_pass: '',
    },
  });
  const [error, setError] = useState('');

  const registerStudent = async (data: RegisterFormData) => {
    try {
      console.log('Initiating register request with email:', data.email);
      const res = await fetch('/student/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response from fetch:', res);
      console.log('Response status:', res.status);

      const responseData = await res.json();
      console.log('Response data:', responseData);

      if (!res.ok) {
        throw new Error(responseData?.message || 'Registration failed');
      }

      const student = responseData.response as Student;
      console.log('Registered student:', student);
      return student;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Error in registerStudent:', message);
      setError(message);
      return null;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    console.log('Submitting registration form:', data);
    const student = await registerStudent(data);

    if (!student) {
      console.log('No student data returned, aborting redirection');
      return;
    }
    toast.success('Registration successful! Redirecting...');
    console.log('Registration successful, redirecting student:', student);
    window.location.href = '/';
  };

  const password = watch('password');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
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
              Student Registration
            </h1>
            <p className="text-gray-600 mt-2">Create an account to start your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                placeholder="Enter your first name"
                {...register('first_name', { required: 'First name is required' })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                aria-invalid={errors.first_name ? 'true' : 'false'}
                aria-describedby={errors.first_name ? 'first_name-error' : undefined}
              />
              {errors.first_name && (
                <p id="first_name-error" className="text-red-500 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                placeholder="Enter your last name"
                {...register('last_name', { required: 'Last name is required' })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                aria-invalid={errors.last_name ? 'true' : 'false'}
                aria-describedby={errors.last_name ? 'last_name-error' : undefined}
              />
              {errors.last_name && (
                <p id="last_name-error" className="text-red-500 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                id="mobile_number"
                type="tel"
                placeholder="Enter your mobile number"
                {...register('mobile_number', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Invalid mobile number format',
                  },
                })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                aria-invalid={errors.mobile_number ? 'true' : 'false'}
                aria-describedby={errors.mobile_number ? 'mobile_number-error' : undefined}
              />
              {errors.mobile_number && (
                <p id="mobile_number-error" className="text-red-500 text-sm mt-1">
                  {errors.mobile_number.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format',
                  },
                })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="final_pass" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="final_pass"
                type="password"
                placeholder="Confirm your password"
                {...register('final_pass', {
                  required: 'Confirm password is required',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
                aria-invalid={errors.final_pass ? 'true' : 'false'}
                aria-describedby={errors.final_pass ? 'final_pass-error' : undefined}
              />
              {errors.final_pass && (
                <p id="final_pass-error" className="text-red-500 text-sm mt-1">
                  {errors.final_pass.message}
                </p>
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
              className={`w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:from-purple-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Register
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Your data is secure</span>
            </div>
            <p className="text-xs">Already have an account? Login above</p>
          </div>
        </div>
      </div>
    </div>
  );
}