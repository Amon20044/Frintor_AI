"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@/lib/schemas";
import { Student } from "@/types/student.types";
import { toast } from "sonner";
import { LogIn, AlertCircle, Shield } from "lucide-react";

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const loginInfo = async (data: LoginData) => {
    try {
      console.log(data);
      console.log("Initiating login request with email:", data.email);
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response from fetch:", res);
      console.log("Response status:", res.status);

      const responseData = await res.json();
      console.log("Response data:", responseData);

      if (!res.ok) {
        throw new Error(responseData?.message || "Login failed");
      }

      const student = responseData.student;
      if (!student) {
        throw new Error("No student data in response");
      }

      const token = responseData.token;
      const uuid = student.uuid;
      if (token && uuid) {
        // Set cookies for authentication
        document.cookie = `studentToken=${token}; path=/; max-age=604800; secure; samesite=strict`;
        localStorage.setItem("token", token);
        localStorage.setItem("uuid", uuid);
        console.log("Stored token:", token);
        console.log("Stored UUID:", uuid);
      } else {
        console.warn("Token or UUID missing in response");
      }

      console.log("Student data:", student);
      return student as Student;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      console.error("Error in loginInfo:", message);
      setError("root", { message });
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = async (data: LoginData) => {
    setIsPending(true);

    console.log("Submitting login form");
    const student = await loginInfo(data);

    if (!student) {
      console.log("No student data returned, aborting redirection");
      return;
    }
    console.log("Login successful, redirecting student:", student);
    toast.success("Student logged in successfully");

    // Use window.location.replace for better navigation
    if (student.onboardingcompleted) {
      window.location.replace("/student/dashboard");
    } else {
      window.location.replace("/student/onboarding");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-full shadow-xl border-2 border-purple-200">
                <LogIn className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Student Login
          </h1>
          <p className="text-gray-600 mt-2">
            Access your account to continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 bg-white/50 transition-all duration-200"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password.message}
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
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Your credentials are secure</span>
          </div>
          <p className="text-xs">Don&apos;t have an account? Register below</p>
        </div>
      </div>
    </div>
  );
}
