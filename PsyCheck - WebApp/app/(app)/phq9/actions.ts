
"use server";

import { supabase } from "@/config/supabase";
import type { PHQ9Record, PHQ9Answer as PHQ9AnswerType } from "@/types"; // Assuming PHQ9Answer is correctly typed

// Define a type for data coming from client, omitting fields generated server-side
export interface PHQ9RecordClientData {
  date: string; // ISO string
  answers: PHQ9AnswerType[];
  totalScore: number;
  intervention?: string;
  severityLevel?: string;
  conversationHistory?: { user: string; bot: string }[];
}


export async function savePHQ9Results(
  data: PHQ9RecordClientData
): Promise<{ success: boolean; error?: string; recordId?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const recordToInsert: Omit<PHQ9Record, 'id' | 'createdAt'> = {
      userId: user.id,
      date: data.date,
      answers: data.answers,
      totalScore: data.totalScore,
      intervention: data.intervention,
      severityLevel: data.severityLevel, // Directly assign as it's in PHQ9RecordClientData and PHQ9Record
      conversationHistory: data.conversationHistory,
    };

    const { data: insertedData, error } = await supabase
      .from("phq9_records") // Ensure this table name matches your Supabase table
      .insert(recordToInsert)
      .select("id")
      .single();

    if (error) {
      console.error("Error saving PHQ-9 results to Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true, recordId: insertedData?.id };
  } catch (e: any) {
    console.error("Unexpected error saving PHQ-9 results:", e);
    return { success: false, error: e.message || "An unexpected error occurred." };
  }
}
    
