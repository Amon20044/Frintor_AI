// Base interface for database entity
export interface AiHoroscope {
  uuid: string;
  student_id: string;
  horoscope: HoroscopeData;
  verified: boolean;
  generated_at: string;
  created_at?: string;
  updated_at?: string;
}

// Main horoscope data structure
export interface HoroscopeData {
  zodiac_sign: ZodiacSign;
  career_guidance: string;
  traits_analyzed: string[];
  personality_summary: string;
  planetary_influences: PlanetaryInfluence[];
  suggested_colleges: CareerPath[];
  additional_notes: string;
  analysis_timestamp?: string;
  confidence_score?: number;
}

// Zodiac signs enum/type
export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

// Planetary influence structure
export interface PlanetaryInfluence {
  house: HouseNumber;
  planet: Planet;
  analysis_of_effect: string;
  strength?: 'Strong' | 'Medium' | 'Weak';
  aspect_type?: 'Beneficial' | 'Neutral' | 'Challenging';
}

// House numbers (1st through 12th)
export type HouseNumber = 
  | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th'
  | '7th' | '8th' | '9th' | '10th' | '11th' | '12th';

// Planets in Vedic astrology
export type Planet = 
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn'
  | 'Rahu' | 'Ketu' | 'Uranus' | 'Neptune' | 'Pluto';

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

// Component props interface
export interface VedicHoroscopeAnalysisProps {
  uuid?: string;
  horoscopeData?: HoroscopeData;
  loading?: boolean;
  error?: string | null;
  onCollegeSelect?: (college: College) => void;
  onCareerChange?: (career: string) => void;
  customStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
  };
  showPlanetaryInfluences?: boolean;
  showAdditionalNotes?: boolean;
  maxCollegesPerCareer?: number;
}

// State management interfaces
export interface HoroscopeState {
  horoscopeData: HoroscopeData | null;
  loading: boolean;
  error: string | null;
  selectedCareer: string;
  expandedSections: Record<string, boolean>;
}

export interface ExpandedSections {
  planetary?: boolean;
  traits?: boolean;
  guidance?: boolean;
  colleges?: boolean;
  [key: string]: boolean | undefined;
}

// API response interfaces
export interface HoroscopeApiResponse {
  success: boolean;
  data: HoroscopeData;
  message?: string;
  timestamp: string;
}

export interface HoroscopeApiError {
  success: false;
  error: string;
  code: number;
  timestamp: string;
}

// Utility interfaces for component functionality
export interface ZodiacIconMap {
  [key in ZodiacSign]: string;
}

export interface PlanetIconMap {
  [key in Planet]: string;
}

// Enhanced college card props
export interface CollegeCardProps {
  college: College;
  isSelected?: boolean;
  onSelect?: (college: College) => void;
  showFullDetails?: boolean;
  customActions?: React.ReactNode;
}

// Career path summary for display
export interface CareerPathSummary {
  career: string;
  colleges_count: number;
  average_fees?: string;
  top_college?: string;
  alignment_percentage?: number;
}

// Filter and search interfaces
export interface CollegeFilters {
  location?: string[];
  fees_range?: {
    min: number;
    max: number;
  };
  degree_type?: DegreeType[];
  entrance_exam?: EntranceExam[];
  ranking_threshold?: number;
}

export interface SearchCriteria {
  query?: string;
  filters?: CollegeFilters;
  sort_by?: 'ranking' | 'fees' | 'location' | 'alignment';
  sort_order?: 'asc' | 'desc';
}

// Horoscope analysis configuration
export interface AnalysisConfig {
  include_planetary_transits?: boolean;
  analysis_depth?: 'basic' | 'detailed' | 'comprehensive';
  focus_areas?: ('career' | 'education' | 'personality' | 'relationships')[];
  custom_weightings?: {
    planetary_influence: number;
    zodiac_traits: number;
    psychometric_data: number;
  };
}

// Export utility functions interface
export interface HoroscopeUtils {
  getZodiacIcon: (sign: ZodiacSign) => string;
  getPlanetIcon: (planet: Planet) => string;
  formatHouseNumber: (house: HouseNumber) => string;
  calculateAlignmentScore: (traits: string[], careerPath: string) => number;
  filterColleges: (colleges: College[], filters: CollegeFilters) => College[];
  sortColleges: (colleges: College[], criteria: SearchCriteria) => College[];
}

// Context interface for provider pattern
export interface HoroscopeContextType {
  horoscopeData: HoroscopeData | null;
  loading: boolean;
  error: string | null;
  selectedCareer: string;
  setSelectedCareer: (career: string) => void;
  expandedSections: ExpandedSections;
  toggleSection: (section: string) => void;
  refreshHoroscope: () => Promise<void>;
}

// Default values and constants
export const DEFAULT_ZODIAC_ICONS: ZodiacIconMap = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

export const DEFAULT_PLANET_ICONS: PlanetIconMap = {
  'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
  'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄',
  'Rahu': '☊', 'Ketu': '☋', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
};

// Sample data for testing/development
export const SAMPLE_HOROSCOPE_DATA: HoroscopeData = {
  zodiac_sign: "Gemini",
  career_guidance: "Pursue careers that leverage leadership, strategy, and innovation, with a focus on rapid growth and intellectual stimulation",
  traits_analyzed: ["leadership", "strategy", "innovation", "adaptability", "collaborative communication"],
  personality_summary: "Driven, growth-oriented, natural leader, systematic approach, intuitive thinking, values intellectual stimulation",
  planetary_influences: [
    {
      house: "10th",
      planet: "Saturn",
      analysis_of_effect: "Indicates a strong desire for professional recognition, responsibility, and authority, with a potential for leadership roles",
      strength: "Strong",
      aspect_type: "Beneficial"
    },
    {
      house: "1st", 
      planet: "Mars",
      analysis_of_effect: "Suggests a driven and ambitious individual with a strong desire for personal and professional growth, and a tendency to take bold action",
      strength: "Medium",
      aspect_type: "Beneficial"
    }
  ],
  suggested_colleges: [
    {
      career: "Management Consulting",
      colleges: [
        {
          website: "https://www.iima.ac.in/",
          location: "Ahmedabad, Gujarat",
          course_name: ["Post Graduate Program in Management (PGP)"],
          college_name: "Indian Institute of Management (IIM) Ahmedabad",
          why_suitable: "One of the top management institutes in India, with a strong reputation for producing talented consultants",
          degree_offered: "MBA",
          mode_of_entrance: ["CAT"],
          Fees_range_of_suggestion: "20-25 lakhs",
          ranking: 1,
          placement_rate: 100,
          average_package: "25-30 lakhs"
        }
      ],
      industry_category: "Consulting & Strategy",
      growth_potential: "High",
      alignment_score: 95
    }
  ],
  additional_notes: "It is essential to note that while these suggestions are based on the individual's horoscope and psychometric traits, they should not be taken as the only consideration for career choices.",
  confidence_score: 87
};