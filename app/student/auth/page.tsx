'use client'

import { useForm, SubmitHandler } from "react-hook-form"
import { Student } from "@/types/student.types"
import { useState } from "react"

export default function App() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Student>()

  const onSubmit: SubmitHandler<Student> = async (data) => {
    try {
      const res = await fetch('/student/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      const responseData = await res.json();
      console.log('Response  user ID:', responseData.data.user.id);
      localStorage.setItem('uuid', responseData.data.user.id);
      
      if (!res.ok) {
        throw new Error(responseData?.message || 'Registration failed');
      }

      console.log('Registered student:', data);
      // Optionally clear form or redirect here
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      console.error('Error in registerStudent:', message);
      setServerError(message);
    }
  }

  console.log(watch()) // For debugging

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto p-4 border">
      {serverError && <p className="text-red-500">{serverError}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
        className="border p-2"
      />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
        className="border p-2"
      />
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <input type="submit" value="Register" className="bg-blue-500 text-white p-2 rounded cursor-pointer" />
    </form>
  )
}
