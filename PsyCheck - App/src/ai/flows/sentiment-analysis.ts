// use server'
'use server';

/**
 * @fileOverview AI-powered sentiment analysis tool that scans user's journal entries for depression markers.
 *
 * - analyzeSentiment - A function that handles the sentiment analysis process.
 * - SentimentAnalysisInput - The input type for the analyzeSentiment function.
 * - SentimentAnalysisOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentAnalysisInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The journal entry to be analyzed for depression markers.'),
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentAnalysisOutputSchema = z.object({
  sentimentScore: z
    .number()
    .describe(
      'A score indicating the sentiment of the journal entry. Lower scores indicate a higher likelihood of depression markers.'
    ),
  flagForAttention: z
    .boolean()
    .describe(
      'Whether the journal entry should be flagged for further attention based on the sentiment score.'
    ),
  analysis: z
    .string()
    .describe('A detailed analysis of the journal entry, highlighting potential depression markers.'),
});
export type SentimentAnalysisOutput = z.infer<typeof SentimentAnalysisOutputSchema>;

export async function analyzeSentiment(input: SentimentAnalysisInput): Promise<SentimentAnalysisOutput> {
  return sentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: {schema: SentimentAnalysisInputSchema},
  output: {schema: SentimentAnalysisOutputSchema},
  prompt: `You are an AI sentiment analysis tool specializing in identifying depression markers in journal entries.

You will analyze the journal entry and provide a sentiment score, flag for attention if necessary, and provide a detailed analysis.

Journal Entry: {{{journalEntry}}}

Based on the journal entry, determine the sentiment score, whether it should be flagged for attention, and provide a detailed analysis.

Please provide a sentiment score, flagForAttention as true if depression markers are detected and a detailed analysis:
`,
});

const sentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'sentimentAnalysisFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
