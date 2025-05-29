
import { HouseNumber, Planet } from './base.types';

// Planetary influence structure
export interface PlanetaryInfluence {
  house: HouseNumber;
  planet: Planet;
  analysis_of_effect: string;
  strength?: 'Strong' | 'Medium' | 'Weak';
  aspect_type?: 'Beneficial' | 'Neutral' | 'Challenging';
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
