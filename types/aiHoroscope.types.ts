// Re-export all types from the new modular structure
export * from '@/src/types/horoscope';

// Keep backward compatibility
export type { AiHoroscope, HoroscopeData } from '@/src/types/horoscope';