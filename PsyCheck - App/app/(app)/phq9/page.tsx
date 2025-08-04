
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { phq9Chatbot, type PHQ9ChatbotInput, type PHQ9ChatbotOutput } from "@/ai/flows/phq9-chatbot";
import { savePHQ9Results, type PHQ9RecordClientData } from "./actions"; 
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { PHQ9Answer as PHQ9AnswerType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";


interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  isError?: boolean;
}

interface PHQ9AnswerClient {
  questionIndex: number; // 0-indexed
  questionText: string;
  answerValue: string; // "0", "1", "2", "3"
  answerLabel: string;
}

type QuestionnaireState = "idle" | "inProgress" | "submittingResults" | "completed" | "errorSaving";

const phq9Options = [
  { label: "Not at all", value: "0" },
  { label: "Slightly / For a little while", value: "1" },
  { label: "Moderately / For a good portion of the day", value: "2" },
  { label: "Severely / Most of the day", value: "3" },
];

const allQuestions = [
  "Thinking about today, how often have you been bothered by little interest or pleasure in doing things?",
  "Thinking about today, how often have you been bothered by feeling down, depressed, or hopeless?",
  "Thinking about today, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
  "Thinking about today, how often have you been bothered by feeling tired or having little energy?",
  "Thinking about today, how often have you been bothered by poor appetite or overeating?",
  "Thinking about today, how often have you been bothered by feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
  "Thinking about today, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
  "Thinking about today, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
  "Thinking about today, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?"
];

export default function PHQ9Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPHQ9State, setCurrentPHQ9State] = useState<Partial<PHQ9ChatbotOutput>>({
    score: 0,
    questionNumber: 0, 
    completed: false,
    isQuestion: false,
  });
  const [conversationHistory, setConversationHistory] = useState<{user: string, bot: string}[]>([]);
  const [questionnaireState, setQuestionnaireState] = useState<QuestionnaireState>("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [recordedAnswers, setRecordedAnswers] = useState<PHQ9AnswerClient[]>([]);
  const [isSubmittingResults, setIsSubmittingResults] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth(); 

  const resetQuestionnaire = useCallback(() => {
    setMessages([]);
    setConversationHistory([]);
    setCurrentPHQ9State({ score: 0, questionNumber: 0, completed: false, isQuestion: false });
    setSelectedAnswer(null);
    setRecordedAnswers([]);
    setQuestionnaireState("idle");
    setIsLoading(false);
    setIsSubmittingResults(false);
    setSubmissionError(null);
  }, []);
  
  useEffect(() => {
    if (questionnaireState === "idle" && messages.length === 0) {
      setMessages([{ 
        id: Date.now().toString(), 
        text: "The Patient Health Questionnaire (PHQ-9) is a 9-item multipurpose instrument widely used for screening, diagnosing, monitoring, and measuring the severity of depression. This chatbot will guide you through these questions. Please answer based on how you have felt over the past day.",
        sender: "bot" 
      }]);
    }
  }, [questionnaireState, messages.length]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartQuestionnaire = async () => {
    setQuestionnaireState("inProgress");
    setIsLoading(true);
    setMessages(prev => prev.slice(0,1).concat({
      id: (Date.now() + 1).toString(),
      text: "Let's start the PHQ-9 questionnaire. Please answer based on how much you've been bothered by these things today.",
      sender: "bot"
    }));
    setRecordedAnswers([]); 

    try {
      const initialBotResponse = await phq9Chatbot({
        message: "START_QUESTIONNAIRE", 
        history: [],
        score: 0,
        questionNumber: 0, 
      });
      setMessages(prev => [...prev, { id: Date.now().toString() + '_bot_q0', text: initialBotResponse.response, sender: "bot" }]);
      setCurrentPHQ9State(initialBotResponse);
      setConversationHistory([{ user: "User started questionnaire", bot: initialBotResponse.response }]);
    } catch (error) {
      console.error("Error starting PHQ-9:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not start the questionnaire." });
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "Sorry, I couldn't start. Please try refreshing.", sender: "bot", isError: true }]);
      setQuestionnaireState("idle"); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isLoading || !currentPHQ9State.isQuestion || currentPHQ9State.completed) return;

    const currentQIndex = (currentPHQ9State.questionNumber || 0); 
    const questionJustAnsweredIndex = currentQIndex > 0 ? currentQIndex -1 : 0;
    
    const selectedOptionLabel = phq9Options.find(opt => opt.value === selectedAnswer)?.label || selectedAnswer;

    const userMessage: Message = { id: Date.now().toString(), text: selectedOptionLabel, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    
    const questionText = allQuestions[questionJustAnsweredIndex] || "Unknown Question";
    setRecordedAnswers(prev => [...prev, {
        questionIndex: questionJustAnsweredIndex,
        questionText: questionText,
        answerValue: selectedAnswer,
        answerLabel: selectedOptionLabel
    }]);

    setIsLoading(true);
    const answerToSend = selectedAnswer; 
    setSelectedAnswer(null); 

    try {
      const chatbotInput: PHQ9ChatbotInput = {
        message: answerToSend,
        history: conversationHistory,
        score: currentPHQ9State.score,
        questionNumber: currentPHQ9State.questionNumber || 0, 
      };
      
      const botResponse = await phq9Chatbot(chatbotInput);
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString() + `_bot_q${botResponse.questionNumber}`,
        text: botResponse.response,
        sender: "bot",
      };
      setMessages(prev => [...prev, newBotMessage]);
      setCurrentPHQ9State(botResponse);
      setConversationHistory(prev => [...prev, { user: userMessage.text, bot: botResponse.response}]);

      if (botResponse.completed) {
        setQuestionnaireState("submittingResults");
        
        if (!user) {
          toast({ variant: "destructive", title: "Not Authenticated", description: "Please log in to submit your assessment." });
          setMessages(prev => [...prev, { id: 'save_error_auth', text: "Could not save your results as you are not logged in.", sender: "bot", isError: true }]);
          setCurrentPHQ9State(prev => ({
            ...prev, 
            intervention: botResponse.intervention, 
            severityLevel: botResponse.severityLevel,
            completed: true 
          }));
          setSubmissionError("User not authenticated");
          setQuestionnaireState("errorSaving");
          setIsLoading(false);
          return; 
        }
        
        setIsSubmittingResults(true);
        
        const finalAnswersForRecord: PHQ9AnswerType[] = recordedAnswers.map(a => ({
          questionIndex: a.questionIndex,
          score: parseInt(a.answerValue) as 0 | 1 | 2 | 3,
        }));

        const updatedHistoryForSave = conversationHistory.length > 0 && conversationHistory[conversationHistory.length-1].bot === botResponse.response ? 
                                      conversationHistory : 
                                      [...conversationHistory, { user: userMessage.text, bot: botResponse.response}];

        const recordToSave: PHQ9RecordClientData = {
            date: new Date().toISOString(),
            answers: finalAnswersForRecord,
            totalScore: botResponse.score,
            intervention: botResponse.intervention,
            severityLevel: botResponse.severityLevel,
            conversationHistory: updatedHistoryForSave
        };

        const saveResult = await savePHQ9Results(recordToSave);
        setIsSubmittingResults(false);

        if (saveResult.success) {
            toast({
                title: "PHQ-9 Submitted",
                description: `Score: ${botResponse.score}, Severity: ${botResponse.severityLevel || 'N/A'}. Your results have been saved.`,
                duration: 7000,
            });
             setQuestionnaireState("completed");
        } else {
            if (saveResult.error === "User not authenticated") {
                toast({ variant: "destructive", title: "Not Authenticated", description: "Please log in to submit your assessment." });
                setMessages(prev => [...prev, { id: 'save_error_auth', text: "Could not save your results as you are not logged in.", sender: "bot", isError: true }]);
            } else {
                toast({ variant: "destructive", title: "Submission Failed", description: saveResult.error || "An unknown error occurred." });
                 setMessages(prev => [...prev, { id: 'save_error_generic', text: `Failed to save your results: ${saveResult.error || 'Please try again later or contact support.'}`, sender: "bot", isError: true }]);
            }
            setSubmissionError(saveResult.error || "Failed to save.");
            setQuestionnaireState("errorSaving"); 
        }
      }

    } catch (error) {
      console.error("Chatbot error:", error);
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        isError: true,
      };
      setMessages(prev => [...prev, errorBotMessage]);
      toast({ variant: "destructive", title: "Error", description: "Could not get a response from the chatbot." });
      setQuestionnaireState("errorSaving"); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card takes full width up to max-w-3xl, and flexes vertically */}
      {/* Removed min-h calculation to allow more natural flow in varied height containers (like sheets) */}
      <Card className="shadow-lg w-full max-w-3xl flex flex-col">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">Daily Wellness Check (PHQ-9)</CardTitle>
          {questionnaireState !== 'idle' && 
            <CardDescription className="text-sm sm:text-base mt-1">
              This chatbot will guide you through a daily wellness check based on the PHQ-9. Answer based on how you&apos;ve been feeling *today*.
            </CardDescription>
          }
        </CardHeader>
        {/* CardContent and ScrollArea will flex to take available space */}
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          <ScrollArea className="flex-1 p-3 sm:p-4 md:p-6 min-h-[300px]"> {/* Adjusted padding and added min-height */}
            <div className="space-y-3 sm:space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2 sm:gap-3",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.sender === "bot" && (
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 self-start flex-shrink-0">
                      <AvatarFallback><Bot size={18} sm={20}/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 sm:px-4 text-sm sm:text-base shadow",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : msg.isError ? "bg-destructive text-destructive-foreground" : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-left">{msg.text}</p>
                  </div>
                  {msg.sender === "user" && (
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 self-start flex-shrink-0">
                      <AvatarFallback><User size={18} sm={20}/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && messages.length > 0 && messages[messages.length -1].sender === 'user' && (
                <div className="flex items-end gap-2 sm:gap-3 justify-start">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarFallback><Bot size={18} sm={20}/></AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-lg px-3 py-2 sm:px-4 text-sm sm:text-base shadow bg-muted">
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  </div>
                </div>
              )}
              {isSubmittingResults && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground py-3 sm:py-4 text-sm sm:text-base">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span>Submitting your results...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 sm:p-6 border-t min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center">
          {questionnaireState === 'idle' && (
              <Button onClick={handleStartQuestionnaire} size="lg" className="w-full max-w-xs">Start Questionnaire</Button>
          )}

          {questionnaireState === 'inProgress' && currentPHQ9State.isQuestion && !isLoading && !currentPHQ9State.completed && (
               <div className="flex flex-col space-y-3 sm:space-y-4 w-full max-w-md mx-auto">
                  <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {phq9Options.map(option => (
                          <div key={option.value} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-primary cursor-pointer">
                              <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                              <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer text-sm sm:text-base">{option.label}</Label>
                          </div>
                      ))}
                  </RadioGroup>
                  <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer || isLoading} className="w-full" size="lg">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Answer"}
                  </Button>
              </div>
          )}
           {isLoading && questionnaireState === 'inProgress' && (
             <div className="w-full flex justify-center items-center py-4">
               <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-primary" />
             </div>
          )}

          {(questionnaireState === 'completed' || questionnaireState === 'errorSaving') && !isSubmittingResults && (
              <div className="w-full text-center space-y-3 sm:space-y-4">
                   {submissionError && questionnaireState === 'errorSaving' && (
                      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
                          <AlertCircle size={18} sm={20} className="flex-shrink-0"/> 
                          <div>
                              <p className="font-semibold">Results could not be saved.</p>
                              <p>{submissionError}</p>
                          </div>
                      </div>
                  )}
                  <Button onClick={resetQuestionnaire} className="w-full max-w-xs" size="lg">Retake Questionnaire</Button>
              </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
