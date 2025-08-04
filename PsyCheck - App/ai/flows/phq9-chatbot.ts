
'use server';
/**
 * @fileOverview A PHQ-9 questionnaire chatbot for daily wellness checks.
 *
 * - phq9Chatbot - A function that handles the PHQ-9 questionnaire process.
 * - PHQ9ChatbotInput - The input type for the phq9Chatbot function.
 * - PHQ9ChatbotOutput - The return type for the phq9Chatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PHQ9ChatbotInputSchema = z.object({
  message: z.string().describe('The user message or selected option value to the chatbot. "START_QUESTIONNAIRE" for initial call.'),
  history: z.array(z.object({
    user: z.string(),
    bot: z.string(),
  })).optional().describe('The history of the conversation.'),
  score: z.number().optional().describe('The current score of the PHQ-9 questionnaire.'),
  questionNumber: z.number().optional().describe('The current question number of the PHQ-9 questionnaire (0-indexed for question being asked).'),
});
export type PHQ9ChatbotInput = z.infer<typeof PHQ9ChatbotInputSchema>;

const PHQ9ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response (question or completion message).'),
  score: z.number().describe('The updated score of the PHQ-9 questionnaire.'),
  completed: z.boolean().describe('Whether the questionnaire is completed or not.'),
  questionNumber: z.number().describe('The updated question number (0-indexed for next question, or total count if completed).'),
  isQuestion: z.boolean().describe('Whether the current bot response is a PHQ-9 question expecting a numerical answer.'),
  intervention: z.string().optional().describe('Tailored intervention based on the score and history.'),
  severityLevel: z.string().optional().describe('The calculated severity level of depression symptoms.')
});
export type PHQ9ChatbotOutput = z.infer<typeof PHQ9ChatbotOutputSchema>;

const questions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
  "Thoughts that you would be better off dead, or of hurting yourself in some way?"
];

const phq9ChatbotPrompt = ai.definePrompt({
  name: 'phq9ChatbotPrompt',
  input: {schema: PHQ9ChatbotInputSchema},
  output: {schema: PHQ9ChatbotOutputSchema },
  prompt: `You are a mental health chatbot administering a PHQ-9 questionnaire.
The user will answer questions based on how they have felt over the past day.

Questions:
1. Little interest or pleasure in doing things?
2. Feeling down, depressed, or hopeless?
3. Trouble falling or staying asleep, or sleeping too much?
4. Feeling tired or having little energy?
5. Poor appetite or overeating?
6. Feeling bad about yourself - or that you are a failure or have let yourself or your family down?
7. Trouble concentrating on things, such as reading the newspaper or watching television?
8. Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?
9. Thoughts that you would be better off dead, or of hurting yourself in some way?

Possible answers for each question (values 0-3):
- Not at all
- Slightly / For a little while
- Moderately / For a good portion of the day
- Severely / Most of the day

User message: {{{message}}}
Conversation history: {{#each history}}User: {{this.user}} Bot: {{this.bot}}{{/each}}
Current score: {{{score}}}
Current question number: {{{questionNumber}}}

Based on the user's message, respond with the next question or, if all questions are answered, calculate the score, severity, and provide tailored advice.
Set 'isQuestion' to true if asking a question.
Set 'completed' to true if all questions are answered.
Output in JSON format.
`,
});


export async function phq9Chatbot(input: PHQ9ChatbotInput): Promise<PHQ9ChatbotOutput> {
  return phq9ChatbotFlow(input);
}

const phq9ChatbotFlow = ai.defineFlow(
  {
    name: 'phq9ChatbotFlow',
    inputSchema: PHQ9ChatbotInputSchema,
    outputSchema: PHQ9ChatbotOutputSchema,
  },
  async (input: PHQ9ChatbotInput): Promise<PHQ9ChatbotOutput> => {
    let {message, history, score = 0, questionNumber = 0} = input;
    let completed = false;
    let intervention = undefined;
    let severityLevel = undefined;
    let isQuestion = false;
    
    // Process answer from the previous question if this is not the initial "START_QUESTIONNAIRE" message
    // and if it's not the first question being asked (questionNumber > 0).
    // The first actual question is at questionNumber 0.
    // So, if questionNumber > 0, 'message' contains the answer to questions[questionNumber - 1].
    if (message !== "START_QUESTIONNAIRE" && questionNumber > 0) {
       const answer = parseInt(message); // message is the value "0", "1", "2", or "3"
       if (!isNaN(answer) && answer >= 0 && answer <= 3) {
         score += answer;
       }
    }
    
    if (questionNumber >= questions.length) {
      completed = true;
      isQuestion = false;
      
      if (score <= 4) {
        severityLevel = "Minimal depression";
        intervention = "Your responses suggest minimal or no depressive symptoms. Continue to monitor your well-being and practice self-care. If you have any concerns, don't hesitate to reach out to a healthcare professional.";
      } else if (score <= 9) {
        severityLevel = "Mild depression";
        intervention = "Your responses suggest mild depressive symptoms. Consider discussing these feelings with a trusted friend, family member, or a healthcare professional if they persist or worsen. Monitoring your lifestyle and mood can also be helpful.";
      } else if (score <= 14) {
        severityLevel = "Moderate depression";
        intervention = "Your responses suggest moderate depressive symptoms. It's recommended to speak with a healthcare professional or a mental health specialist to discuss these symptoms and explore potential support options.";
      } else if (score <= 19) {
        severityLevel = "Moderately severe depression";
        intervention = "Your responses suggest moderately severe depressive symptoms. It is strongly recommended to consult a healthcare professional or a mental health specialist as soon as possible for a comprehensive evaluation and guidance.";
      } else { // score 20-27
        severityLevel = "Severe depression";
        intervention = "Your responses indicate severe depressive symptoms. Please seek professional help from a doctor or mental health specialist immediately. If you are in crisis, please contact an emergency helpline or go to the nearest emergency room.";
      }

      const completionMessage = `Thank you for completing the questionnaire. Your PHQ-9 score is ${score}, which suggests ${severityLevel.toLowerCase()}.`;
      const disclaimer = "This is not a diagnosis. Please consult a healthcare professional for any health concerns.";

      return {
        response: `${completionMessage}\n\n${intervention}\n\n${disclaimer}`,
        score: score,
        completed: completed,
        questionNumber: questionNumber, // or questions.length
        isQuestion: isQuestion,
        intervention: intervention, // This now contains the detailed next step
        severityLevel: severityLevel,
      };
    }

    // If it's the start or an ongoing question
    const currentQuestionText = questions[questionNumber];
    
    if (currentQuestionText) {
        isQuestion = true;
        // For the very first call (questionNumber 0 after "START_QUESTIONNAIRE"), just ask the first question.
        // The introductory "Let's start..." message is handled client-side.
        return {
            response: currentQuestionText,
            score: score,
            completed: false,
            questionNumber: questionNumber + 1, // This is the number for the *next* turn/question
            isQuestion: isQuestion,
            intervention: undefined,
            severityLevel: undefined,
        };
    } else {
        // Fallback - should be caught by `questionNumber >= questions.length`
        completed = true;
        isQuestion = false;
        severityLevel = "Error in processing";
        intervention = 'Questionnaire finished, but an issue occurred determining final results. Please check scoring.';
         return {
            response: `Your score for today is ${score}. ${intervention}`,
            score: score,
            completed: completed,
            questionNumber: questionNumber,
            isQuestion: isQuestion,
            intervention: intervention,
            severityLevel: severityLevel
        };
    }
  }
);

    