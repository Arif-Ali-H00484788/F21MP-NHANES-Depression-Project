
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Brain, Utensils, TrendingUp, Loader2 } from "lucide-react"; // Brain is already here
// Removed AppLogo import as we are using Brain directly
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      return;
    }

    const checkOnboardingStatus = async () => {
      setIsLoading(true);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('has_completed_onboarding')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching onboarding status:", error);
          toast({ title: "Error", description: "Could not fetch your profile data.", variant: "destructive" });
        }

        if (profile?.has_completed_onboarding) {
          router.replace(ROUTES.DASHBOARD);
        } else {
          setIsLoading(false);
        }
      } catch (e: any) {
        console.error("Exception fetching onboarding status:", e);
        toast({ title: "Error", description: "An unexpected error occurred while checking your status.", variant: "destructive" });
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, router, toast]);

  const handleCompleteOnboarding = async () => {
    if (!user) {
      toast({ title: "Error", description: "User not found. Please log in again.", variant: "destructive" });
      return;
    }
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, has_completed_onboarding: true }, { onConflict: 'id' })
        .eq('id', user.id);

      if (error) {
        console.error("Error updating onboarding status:", error);
        toast({ title: "Error", description: "Could not save your onboarding status.", variant: "destructive" });
      } else {
        toast({ title: "Onboarding Complete!", description: "Redirecting to your dashboard..." });
        router.push(ROUTES.DASHBOARD);
        router.refresh();
      }
    } catch (e: any) {
      console.error("Exception updating onboarding status:", e);
      toast({ title: "Error", description: "An unexpected error occurred while saving.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="items-center text-center p-4 sm:p-6">
          {/* Replaced AppLogo with Brain icon */}
          <Brain className="h-14 w-14 sm:h-16 sm:w-16 text-primary mb-3 sm:mb-4" /> 
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">Welcome to PsyCheck!</CardTitle>
          <CardDescription className="text-sm sm:text-base px-2">
            Discover how PsyCheck can help you understand and improve your well-being.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4 sm:space-y-6">
          <p className="text-center text-sm sm:text-base text-muted-foreground">
            Here's a quick overview of the key features:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Feature Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2 sm:space-x-3 pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <ListChecks className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base font-medium">Daily Journal</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Record your thoughts, feelings, and daily experiences. Reflect on your emotional journey and gain insights over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-x-2 sm:space-x-3 pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base font-medium">Lifestyle Tracker</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Log important lifestyle factors such as sleep patterns, physical activity, and dietary habits to see how they impact your mood.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-x-2 sm:space-x-3 pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base font-medium">PHQ-9 Chatbot</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Engage with our friendly chatbot to complete the PHQ-9 questionnaire, a standard tool for mental health screening.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-x-2 sm:space-x-3 pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base font-medium">Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Our app analyzes your journal entries to provide insights into your emotional trends and sentiment patterns.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
            <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base" onClick={handleCompleteOnboarding} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base" onClick={handleCompleteOnboarding} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
