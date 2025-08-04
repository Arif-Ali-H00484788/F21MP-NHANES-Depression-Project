
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/config/supabase"; 
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  terms: z.boolean().default(false).refine(val => val, {
    message: "You must accept the Terms and Conditions to continue.",
  }),
});

export function SignupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name, 
          },
        },
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Signup Successful",
        description: "Please check your email to confirm your account.",
      });
      
      router.push(ROUTES.LOGIN);
      router.refresh();

    } catch (error: any) {
      console.error("Signup error", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto font-semibold">
                        Terms and Conditions
                      </Button>
                    </DialogTrigger>
                    .
                  </FormLabel>
                  <FormDescription>
                    You agree to our terms of service and privacy policy.
                  </FormDescription>
                   <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Last Updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto pr-4">
          <p>Welcome to PsyCheck. By using our application, you agree to be bound by these Terms of Use. Please read them carefully.</p>
          <h3 className="font-semibold text-foreground">1. Use of Service</h3>
          <p>PsyCheck is a tool for personal mental wellness tracking. It is not a medical device and does not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
          <h3 className="font-semibold text-foreground">2. User Accounts</h3>
          <p>You are responsible for safeguarding your account information. You agree to provide accurate and complete information when creating an account and to keep this information up to date.</p>
          <h3 className="font-semibold text-foreground">3. User Content</h3>
          <p>You retain all rights to the journal entries and data you submit. We use this data to provide the service to you, including generating AI-powered insights. We will not share your personal data with third parties without your explicit consent, except as required by law.</p>
          <h3 className="font-semibold text-foreground">4. General Data Protection Regulation (GDPR) Clause</h3>
          <p>For users in the European Union, we are committed to processing your data in accordance with the GDPR.
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Data Controller:</strong> The PsyCheck team is the data controller for your personal data.</li>
              <li><strong>Lawful Basis for Processing:</strong> We process your data based on your consent, which you provide by accepting these terms and using our service.</li>
              <li><strong>Your Rights:</strong> You have the right to access, rectify, or erase your personal data, as well as the right to restrict processing, the right to data portability, and the right to object to processing. You can exercise these rights by contacting us. You also have the right to lodge a complaint with a supervisory authority.</li>
              <li><strong>Data Retention:</strong> We retain your personal data for as long as your account is active or as needed to provide you with our services. We will delete your data upon request or account deletion, subject to legal obligations.</li>
            </ul>
          </p>
          <h3 className="font-semibold text-foreground">5. Limitation of Liability</h3>
          <p>The service is provided "as is." We disclaim all warranties, express or implied. We will not be liable for any damages arising from your use of the application.</p>
          <h3 className="font-semibold text-foreground">6. Changes to Terms</h3>
          <p>We may modify these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the service after any such change constitutes your acceptance of the new terms.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I Understand and Agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
