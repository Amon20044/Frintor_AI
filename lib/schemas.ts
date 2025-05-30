import { z } from "zod";

// Student schemas
export const loginSchema = z.object({
  adminID: z.string().min(5, "enter Valid AdminID"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    mobile_number: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number format"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    final_pass: z.string(),
  })
  .refine((data) => data.password === data.final_pass, {
    message: "Passwords don't match",
    path: ["final_pass"],
  });

export const onboardingSchema = z.object({
  // Personal Details (already collected in registration)
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  mobile_number: z.string().optional(),
  
  // Additional Personal Details
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required",
  }),
  category: z.string(),
  permanent_address: z.string(),
  current_address: z.string(),

  // Horoscope Requirements
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().min(1, "Time of birth is required for horoscope"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),

  // Academic Details
  lvl: z.enum(["MID_SCHOOL", "HIGH_SCHOOL", "UNDERGRADUATE", "POSTGRADUATE", "WORKING_PROFESSIONAL"], {
    required_error: "Education level is required",
  }),
  
  // Basic Academic Info
  tenth_percentage: z.string().min(1, "10th percentage is required"),
  tenth_year: z.string().min(1, "10th passing year is required"),
  twelfth_percentage: z.string().optional(),
  twelfth_year: z.string().optional(),
  academic_background: z.string().optional(),
  subject: z.string().optional(),
  other_certificate: z.string().optional(),
  competitive_exams: z.string().optional(),
  
  // Higher Education Fields (UG/PG)
  institute: z.string().optional(),
  branch: z.string().optional(),
  cgpa_cpi: z.string().optional(),
  graduation_year: z.string().optional(),
  
  // Postgraduate specific
  pg_institute: z.string().optional(),
  pg_branch: z.string().optional(),
  pg_cgpa_cpi: z.string().optional(),
  pg_graduation_year: z.string().optional(),

  // Professional Section (Working Professional)
  company_name: z.string().optional(),
  job_title: z.string().optional(),
  experience_years: z.string().optional(),
  current_salary: z.string().optional(),

  // Preferences & Interests
  interest: z.string().min(1, "Interests are required"),
  preferences: z.string().optional(),
  career_goals: z.string().min(1, "Career goals are required"),

  // Parent's Details (simplified)
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  father_contact: z.string().optional(),
  mother_contact: z.string().optional(),
});

// Test schemas
export const testResponseSchema = z.object({
  questionId: z.string(),
  answer: z.union([z.string(), z.number(), z.array(z.string())]),
});

export const testSubmissionSchema = z.object({
  responses: z.array(testResponseSchema),
});

// Admin schemas
export const mentorAssignmentSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
  mentorId: z.string().uuid("Invalid mentor ID"),
  meetingLink: z.string().url("Invalid meeting link").optional(),
});

export const mentorSchema = z.object({
  mentor_name: z.string().min(1, "Mentor name is required"),
  email: z.string().email("Invalid email format"),
  mobile_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  metadata: z.object({}).optional(),
  preferences_settings: z.object({}).optional(),
});

export const newsletterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  img_url: z.string().url("Invalid image URL").optional(),
  metadata: z.object({}).optional(),
  is_published: z.boolean().default(false),
});

// Type exports
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;
export type TestSubmissionData = z.infer<typeof testSubmissionSchema>;
export type MentorAssignmentData = z.infer<typeof mentorAssignmentSchema>;
export type MentorData = z.infer<typeof mentorSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;