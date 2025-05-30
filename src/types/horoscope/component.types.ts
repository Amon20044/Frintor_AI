import React from 'react';
import { HoroscopeData, ZodiacSign, Planet } from './base.types';
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