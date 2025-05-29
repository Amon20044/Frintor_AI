
import { useState, useEffect } from 'react';
import { HoroscopeData } from '@/src/types/horoscope';
import { HoroscopeService } from '@/src/services/horoscope.service';
import { SAMPLE_HOROSCOPE_DATA } from '@/src/utils/horoscope/data.utils';

export const useHoroscope = (uuid?: string) => {
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!uuid) {
        // Use sample data if no UUID provided
        setHoroscopeData(SAMPLE_HOROSCOPE_DATA);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await HoroscopeService.getHoroscope(uuid);
        setHoroscopeData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch horoscope';
        setError(errorMessage);
        console.error('Horoscope fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [uuid]);

  const refetch = () => {
    if (uuid) {
      setLoading(true);
      setError(null);
      HoroscopeService.getHoroscope(uuid)
        .then(setHoroscopeData)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  return {
    horoscopeData,
    loading,
    error,
    refetch
  };
};
