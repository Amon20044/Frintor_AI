// College interface
export interface College {
  name: string;
  location?: string;
  type?: string;
  ranking?: number;
  fees?: string;
  website?: string;
  courses?: string[];
  admission_criteria?: string;
  description?: string;
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