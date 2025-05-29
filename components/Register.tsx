'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterData } from '@/lib/schemas';
import { Student } from '@/types/student.types';
import { toast } from 'sonner';
import { UserPlus, AlertCircle, Shield } from 'lucide-react';

export default function RegisterForm() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const registerStudent = async (data: RegisterData) => {
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
      setError('root', { message });
      return null;
    }
  };

  const onSubmit = async (data: RegisterData) => {
    setIsPending(true);
    console.log('Submitting registration form:', data);
    const student = await registerStudent(data);

    if (!student) {
      console.log('No student data returned, aborting redirection');
      setIsPending(false);
      return;
    }
    toast.success('Registration successful! Please login to continue.');
    console.log('Registration successful, redirecting to login');
    window.location.replace('/student/auth');
    setIsPending(false);
  };

  return (
    <div>
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
            {...register('first_name')}
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
            {...register('last_name')}
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
            {...register('mobile_number')}
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
            {...register('email')}
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
            {...register('password')}
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
            {...register('final_pass')}
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
        {errors.root && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p id="form-error" className="text-red-700 text-sm font-medium">
              {errors.root.message}
            </p>
          </div>
        )}

        {/* Submit Button */}
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
  );
}