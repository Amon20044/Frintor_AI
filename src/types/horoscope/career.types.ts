// College interface
export interface College {
  college_name: string;
  name?: string; // Keep for backward compatibility
  location?: string;
  type?: string;
  ranking?: number;
  fees?: string;
  Fees_range_of_suggestion?: string;
  website?: string;
  courses?: string[];
  course_name?: string[];
  degree_offered?: string;
  mode_of_entrance?: string[];
  admission_criteria?: string;
  description?: string;
  why_suitable?: string;
  match_score?: number;
  highlights?: string[];
}

// Career path with colleges
export interface CareerPath {
  career: string;
  colleges: College[];
  match_percentage?: number;
  reasoning?: string;
}

// Career path summary for UI
export interface CareerPathSummary {
  career: string;
  colleges_count: number;
}

// College selection criteria
export interface CollegeFilter {
  location?: string;
  type?: string;
  maxFees?: number;
  minRanking?: number;
  courses?: string[];
}