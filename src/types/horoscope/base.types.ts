
// Forward declarations
export interface PlanetaryInfluence {
  house: HouseNumber;
  planet: Planet;
  analysis_of_effect: string;
  strength?: 'weak' | 'moderate' | 'strong';
  benefic?: boolean;
}

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

// House numbers (1st through 12th)
export type HouseNumber = 
  | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th'
  | '7th' | '8th' | '9th' | '10th' | '11th' | '12th';

// Planets in Vedic astrology
export type Planet = 
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn'
  | 'Rahu' | 'Ketu' | 'Uranus' | 'Neptune' | 'Pluto';
