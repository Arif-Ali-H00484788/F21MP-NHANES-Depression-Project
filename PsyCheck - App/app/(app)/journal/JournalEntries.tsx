
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/config/supabase";
import { type SentimentAnalysisOutput } from '@/ai/flows/sentiment-analysis';
import type { PostgrestError } from '@supabase/supabase-js';
import { deleteJournalEntry } from './actions';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  sentiment: string | null;
}

export function JournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: fetchedEntries, error: fetchError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error("Error fetching journal entries:", fetchError);
          setError(fetchError);
        } else {
          setEntries(fetchedEntries || []);
        }
      }
      setLoading(false);
    };

    fetchEntries();
  }, []);
  
  const handleDelete = async (entryId: string) => {
    setIsDeleting(entryId);
    try {
      const result = await deleteJournalEntry(entryId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      // Re-fetch entries after deletion by updating state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      toast({ title: "Success", description: "Journal entry deleted." });
    } catch (e: any) {
      console.error("Failed to delete entry:", e);
      toast({ variant: "destructive", title: "Error", description: `Could not delete entry: ${e.message}` });
    } finally {
      setIsDeleting(null);
    }
  };


  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Loading entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error loading entries. Please try again later.</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No past entries yet. Start writing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        let sentiment: SentimentAnalysisOutput | null = null;
        try {
          if (entry.sentiment) {
            sentiment = JSON.parse(entry.sentiment as string);
          }
        } catch (e) {
          console.error("Failed to parse sentiment JSON:", e);
        }

        const sentimentLabel = sentiment ? (sentiment.sentimentScore > 5 ? "Positive" : sentiment.sentimentScore < 4 ? "Negative" : "Neutral") : "N/A";
        const sentimentColor = sentiment ? (sentiment.sentimentScore > 5 ? "bg-green-500" : sentiment.sentimentScore < 4 ? "bg-red-500" : "bg-yellow-500") : "bg-gray-400";

        return (
          <Card key={entry.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <p className="flex-1 text-sm text-gray-800">{entry.content}</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0">
                      {isDeleting === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your journal entry.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(entry.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                {sentiment && (
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${sentimentColor}`}>
                      {sentimentLabel}
                    </span>
                    <span className="font-semibold">
                      Score: {sentiment.sentimentScore.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
