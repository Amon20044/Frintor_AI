
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
        console.warn('No UUID provided, using sample data');
        // Use sample data if no UUID provided
        setHoroscopeData(SAMPLE_HOROSCOPE_DATA);
        setLoading(false);
        return;
      }

      console.log('Fetching horoscope for UUID:', uuid);

      try {
        setLoading(true);
        setError(null);
        const data = await HoroscopeService.getHoroscope(uuid);
        console.log('Horoscope data received:', data);
        setHoroscopeData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch horoscope';
        console.error('Horoscope fetch error:', err);
        setError(errorMessage);
        
        // If it's a verification error, provide more specific message
        if (errorMessage.includes('verification') || errorMessage.includes('pending')) {
          setError('Your horoscope is pending mentor verification. Please wait for your mentor to verify it.');
        }
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
