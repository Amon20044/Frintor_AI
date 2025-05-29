import supabase from "../database/db";
import { Student } from "../types/student.types";
import argon2 from "argon2";

export const signUp = async (email: string, password: string) => supabase.auth.signUp({
    email,
    password
})

export const signIn = async (email: string, password: string) => supabase.auth.signInWithPassword({
    email,
    password
})

export const registerStudent = async (student: Student) => {
    const { data, error } = await supabase
        .from("students")
        .insert({
            uuid : student.uuid,
            email: student.email,
            password: student.password
        })
        .select()
        .single();

    if (error instanceof Error) {
        throw new Error(error.message);
    }

    return data;
}

export const regStudent = async (student: Student) => {
    const { data, error } = await supabase
        .from("students")
        .insert({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            password: student.password
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const logStudent = async (email: string, password: string) : Promise<Student>=> {
    const { data : dataStudent, error : errorLogin } = await supabase
        .from("students")
        .select("*")
        .eq("email", email)
        .single();

    if (errorLogin || !dataStudent) {
        throw new Error("Invalid credentials");
    }
    
    const passwordMatch = await argon2.verify(dataStudent.password, password);

    if (!passwordMatch) {
        throw new Error("Invalid credentials");
    }

    if(errorLogin){
        throw new Error(errorLogin);
    }
    return dataStudent;
};

export const onboardStudent = async (student: Student) => {
  if (!student.uuid) {
    throw new Error("UUID is required to update student");
  }

  // Destructure uuid out to avoid updating it
  const { uuid, ...rest } = student;

  const { data, error } = await supabase
    .from("students")
    .update({ ...rest, birth_date : rest.dateofbirth }) // update with all fields except uuid
    .eq("uuid", uuid)
    .select(); // optional: returns the updated row(s)

  if (error) {
    throw new Error(error.message);
  }

  return data;
};