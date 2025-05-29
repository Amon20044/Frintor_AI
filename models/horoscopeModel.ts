import supabase from "@/database/db";

export async function getHoroscope(uuid: string) {
  try {
    const { data , error } = await supabase
      .from('ai_horoscope')
      .select('*')
      .eq('student_id', uuid)
      .single(); // Ensures you get exactly one row

    if (error) {
      console.error('Error fetching test:', error.message);
      return null;
    }
    return data ;
  } catch (err) {
    console.error('Unexpected error in getTest:', err);
    return null;
  }
}
