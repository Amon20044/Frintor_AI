
import { ZodiacSign, Planet } from '@/src/types/horoscope';
import { DEFAULT_ZODIAC_ICONS, DEFAULT_PLANET_ICONS } from '@/src/types/horoscope/component.types';

// Get zodiac icon
export const getZodiacIcon = (sign: ZodiacSign): string => {
  return DEFAULT_ZODIAC_ICONS[sign] || '✨';
};

// Get planet icon
export const getPlanetIcon = (planet: Planet): string => {
  return DEFAULT_PLANET_ICONS[planet] || '✧';
};
