
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, PlusCircle } from "lucide-react";
import { analyzeSentiment, type SentimentAnalysisOutput } from '@/ai/flows/sentiment-analysis';

// Server action to analyze sentiment
async function handleSentimentAnalysis(journalEntry: string): Promise<SentimentAnalysisOutput | null> {
  "use server";
  if (!journalEntry.trim()) return null;
  try {
    const result = await analyzeSentiment({ journalEntry });
    return result;
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    return null;
  }
}

export default function JournalPage() {
  return (
    <div className="space-y-6 sm:space-y-8"> {/* Adjusted vertical spacing */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">Daily Journal</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Your personal space to document thoughts and feelings.
              </CardDescription>
            </div>
            <Button className="mt-2 sm:mt-0 w-full sm:w-auto"> {/* Responsive button width */}
              <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> New Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6"> {/* Consistent padding */}
          <form action={async (formData) => {
            "use server";
            const entry = formData.get("journalEntry") as string;
            const result = await handleSentimentAnalysis(entry);
            console.log("Journal Entry:", entry);
            console.log("Sentiment Analysis:", result);
            // TODO: Save entry and result to DB, revalidate path
          }}>
            <Textarea
              name="journalEntry"
              placeholder="What's on your mind today?"
              className="min-h-[180px] sm:min-h-[200px] text-sm sm:text-base w-full"
            />
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <Button type="submit" className="w-full sm:w-auto">Save Entry</Button>
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-0">
                <CalendarDays className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Past Entries</CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1">
            Review your previous journal entries.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6"> {/* Consistent padding */}
          <div className="text-center text-muted-foreground py-6 sm:py-8">
            <p className="text-sm sm:text-base">No past entries yet. Start writing!</p>
          </div>
          {/* Placeholder for displaying past entries */}
        </CardContent>
      </Card>
    </div>
  );
}
