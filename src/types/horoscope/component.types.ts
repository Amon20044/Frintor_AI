
import React from 'react';
import { HoroscopeData, ZodiacSign } from './base.types';
import { College } from './career.types';

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

// Enhanced college card props
export interface CollegeCardProps {
  college: College;
  isSelected?: boolean;
  onSelect?: (college: College) => void;
  showFullDetails?: boolean;
  customActions?: React.ReactNode;
}

// Zodiac icon mapping
export interface ZodiacIconMap {
  [key in ZodiacSign]: string;
}

export const DEFAULT_ZODIAC_ICONS: ZodiacIconMap = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};
