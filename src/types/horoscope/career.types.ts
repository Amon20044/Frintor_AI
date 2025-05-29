
// Career path with associated colleges
export interface CareerPath {
  career: string;
  colleges: College[];
  industry_category?: string;
  growth_potential?: 'High' | 'Medium' | 'Low';
  alignment_score?: number;
}

// College information
export interface College {
  college_name: string;
  website: string;
  location: string;
  course_name: string[];
  degree_offered: DegreeType;
  mode_of_entrance: EntranceExam[];
  Fees_range_of_suggestion: string;
  why_suitable: string;
  ranking?: number;
  accreditation?: string[];
  placement_rate?: number;
  average_package?: string;
  campus_facilities?: string[];
}

// Degree types
export type DegreeType = 
  | 'MBA' | 'B.Tech' | 'M.Tech' | 'B.Sc' | 'M.Sc' | 'BBA' | 'MCA'
  | 'B.Com' | 'M.Com' | 'BA' | 'MA' | 'PhD' | 'Diploma' | 'Certificate'
  | (string & {});

// Common entrance exams
export type EntranceExam = 
  | 'CAT' | 'MAT' | 'XAT' | 'GMAT' | 'JEE Main' | 'JEE Advanced'
  | 'GATE' | 'NEET' | 'CLAT' | 'CUET' | 'SNAP' | 'CMAT' | 'ATMA'
  | (string & {});

// Career path summary for display
export interface CareerPathSummary {
  career: string;
  colleges_count: number;
  average_fees?: string;
  top_college?: string;
  alignment_percentage?: number;
}
