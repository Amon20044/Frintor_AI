
import { useState } from 'react';
import { ExpandedSections } from '@/src/types/horoscope';

export const useHoroscopeState = (initialCareer?: string) => {
  const [selectedCareer, setSelectedCareer] = useState(initialCareer || '');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return {
    selectedCareer,
    setSelectedCareer,
    expandedSections,
    toggleSection
  };
};
