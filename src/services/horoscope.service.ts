
import { HoroscopeData } from '@/src/types/horoscope';

export class HoroscopeService {
  private static async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getHoroscope(uuid: string): Promise<HoroscopeData> {
    try {
      const response = await this.makeRequest(`/api/student/getHoroscope/${uuid}`, {
        method: 'GET',
      });
      
      console.log('Horoscope API response:', response);
      
      if (!response.data?.horoscope?.[0]) {
        throw new Error('No horoscope data found in response');
      }
      
      return response.data.horoscope[0];
    } catch (error) {
      console.error('Error fetching horoscope:', error);
      throw new Error(`Failed to fetch horoscope: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
