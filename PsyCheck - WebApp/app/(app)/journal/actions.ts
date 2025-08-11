
"use server";

import { supabase } from "@/config/supabase";
import { revalidatePath } from "next/cache";
import type { SentimentAnalysisOutput } from "@/ai/flows/sentiment-analysis";

export async function saveJournalEntry(journalEntry: string, sentimentAnalysis: SentimentAnalysisOutput, entryDate: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Combine selected date with current time to create a full timestamp
    const date = new Date(entryDate);
    const now = new Date();
    date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    
    const { data, error } = await supabase
      .from("journal_entries")
      .insert([
        {
          user_id: user.id,
          content: journalEntry,
          sentiment: JSON.stringify(sentimentAnalysis),
          created_at: date.toISOString(), // Use the selected date
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving journal entry:", error);
      return { data: null, error };
    }

    revalidatePath("/journal");

    return { data, error: null };
  }

  return { data: null, error: new Error("User not authenticated") };
}

export async function deleteJournalEntry(entryId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from("journal_entries")
      .delete()
      .eq('id', entryId)
      .eq('user_id', user.id); // Ensure user can only delete their own entries

    if (error) {
      console.error("Error deleting journal entry:", error);
      return { error };
    }

    revalidatePath("/journal");

    return { data };
  }
  
  return { data: null, error: new Error("User not authenticated") };
}
