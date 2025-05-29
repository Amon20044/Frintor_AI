
import { HoroscopeData } from './base.types';

// API response interfaces
export interface HoroscopeApiResponse {
  success: boolean;
  data: {
    horoscope: HoroscopeData[];
  };
  message?: string;
  timestamp: string;
}

export interface HoroscopeApiError {
  success: false;
  error: string;
  code: number;
  timestamp: string;
}
