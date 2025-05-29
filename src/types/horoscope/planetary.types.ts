import { Planet, HouseNumber } from './base.types';

// Planetary influence structure
export interface PlanetaryInfluence {
  house: HouseNumber;
  planet: Planet;
  analysis_of_effect: string;
  strength?: 'weak' | 'moderate' | 'strong';
  benefic?: boolean;
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

// College interface (if not defined elsewhere)
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
}
// Planetary icon mapping
export type PlanetIconMap = {
  [key in Planet]: string;
}

export const DEFAULT_PLANET_ICONS: PlanetIconMap = {
  'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
  'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄',
  'Rahu': '☊', 'Ketu': '☋', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
};