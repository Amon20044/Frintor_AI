
import { HoroscopeData } from '@/src/types/horoscope';

// Sample data for testing/development
export const SAMPLE_HOROSCOPE_DATA: HoroscopeData = {
  zodiac_sign: "Gemini",
  career_guidance: "Pursue careers that leverage leadership, strategy, and innovation, with a focus on rapid growth and intellectual stimulation",
  traits_analyzed: ["leadership", "strategy", "innovation", "adaptability", "collaborative communication"],
  personality_summary: "Driven, growth-oriented, natural leader, systematic approach, intuitive thinking, values intellectual stimulation",
  planetary_influences: [
    {
      house: "10th",
      planet: "Saturn",
      analysis_of_effect: "Indicates a strong desire for professional recognition, responsibility, and authority, with a potential for leadership roles"
    },
    {
      house: "1st", 
      planet: "Mars",
      analysis_of_effect: "Suggests a driven and ambitious individual with a strong desire for personal and professional growth, and a tendency to take bold action"
    },
    {
      house: "9th",
      planet: "Jupiter", 
      analysis_of_effect: "Indicates a strong interest in learning, personal growth, and exploration, with a potential for success in fields related to education, philosophy, or international relations"
    },
    {
      house: "3rd",
      planet: "Mercury",
      analysis_of_effect: "Suggests strong communication and analytical skills, with a potential for success in fields related to writing, speaking, or technology"
    },
    {
      house: "5th",
      planet: "Rahu", 
      analysis_of_effect: "Indicates a strong desire for innovation, creativity, and experimentation, with a potential for success in fields related to technology, entrepreneurship"
    }
  ],
  suggested_colleges: [
    {
      career: "Management Consulting",
      colleges: [
        {
          website: "https://www.iima.ac.in/",
          location: "Ahmedabad, Gujarat",
          course_name: ["Post Graduate Program in Management (PGP)"],
          college_name: "Indian Institute of Management (IIM) Ahmedabad",
          why_suitable: "One of the top management institutes in India, with a strong reputation for producing talented consultants",
          degree_offered: "MBA",
          mode_of_entrance: ["CAT"],
          Fees_range_of_suggestion: "20-25 lakhs"
        }
      ]
    }
  ],
  additional_notes: "It is essential to note that while these suggestions are based on the individual's horoscope and psychometric traits, they should not be taken as the only consideration for career choices."
};
