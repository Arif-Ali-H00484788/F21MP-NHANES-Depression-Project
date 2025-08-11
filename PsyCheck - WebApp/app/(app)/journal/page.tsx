
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';
import { saveJournalEntry } from "./actions";
import { JournalEntries } from "./JournalEntries";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  // State to trigger re-render of JournalEntries
  const [journalUpdateKey, setJournalUpdateKey] = useState(Date.now());

  const handleFormSubmit = async (formData: FormData) => {
    const entry = formData.get("journalEntry") as string;
    
    if (!entry.trim()) {
        toast({
            variant: "destructive",
            title: "Empty Entry",
            description: "Journal entry cannot be empty.",
        });
        return;
    }
    if (!selectedDate) {
        toast({
            variant: "destructive",
            title: "No Date Selected",
            description: "Please select a date for your entry.",
        });
        return;
    }

    try {
      const sentimentResult = await analyzeSentiment({ journalEntry: entry });
      // Pass the selected date to the save action
      const result = await saveJournalEntry(entry, sentimentResult, selectedDate.toISOString());

      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast({
        title: "Success",
        description: "Your journal entry has been saved.",
      });
      formRef.current?.reset(); // Reset the form fields
      setSelectedDate(new Date()); // Reset date to today
      setJournalUpdateKey(Date.now()); // Trigger re-render
    } catch (error) {
      console.error("Failed to process journal entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save your journal entry. Please try again.`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl">Daily Journal</CardTitle>
              <CardDescription className="mt-1">
                Your personal space to document thoughts and feelings.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form ref={formRef} action={handleFormSubmit}>
            <Textarea
              name="journalEntry"
              placeholder="What's on your mind today?"
              className="min-h-[200px] text-base"
            />
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button type="submit" className="w-full sm:w-auto">Save Entry</Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-auto justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <CardTitle className="text-2xl">Past Entries</CardTitle>
          <CardDescription className="mt-1">
            Review and manage your previous journal entries.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <JournalEntries key={journalUpdateKey} />
        </CardContent>
      </Card>
    </div>
  );
}
