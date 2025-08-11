
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BriefcaseMedical, MessageSquare, CalendarPlus, AlertTriangle } from "lucide-react";

// Placeholder data type for doctors
interface DoctorProfile {
  id: string;
  name: string;
  avatarUrl?: string; // Optional: URL to a placeholder image or actual image
  fallbackInitials: string;
  specialization: string;
  experience: string;
  bio: string;
}

// Placeholder doctor data
const placeholderDoctors: DoctorProfile[] = [
  {
    id: "doc1",
    name: "Dr. Anya Sharma",
    fallbackInitials: "AS",
    specialization: "Psychiatrist",
    experience: "12+ Years",
    bio: "Dr. Sharma specializes in mood disorders and anxiety, offering compassionate and evidence-based care to adults and adolescents.",
    avatarUrl: "https://placehold.co/100x100.png", 
  },
  {
    id: "doc2",
    name: "Mr. Ben Carter",
    fallbackInitials: "BC",
    specialization: "Clinical Psychologist",
    experience: "8+ Years",
    bio: "Mr. Carter provides therapy for a range of issues including stress, trauma, and relationship difficulties, using CBT and mindfulness techniques.",
    avatarUrl: "https://placehold.co/100x100.png", 
  },
  {
    id: "doc3",
    name: "Dr. Layla Hassan",
    fallbackInitials: "LH",
    specialization: "Counselor (Child & Adolescent)",
    experience: "10+ Years",
    bio: "Dr. Hassan is dedicated to supporting young people through developmental challenges, behavioral issues, and emotional well-being.",
    avatarUrl: "https://placehold.co/100x100.png",
  },
  {
    id: "doc4", // Adding a fourth doctor for better grid visualization
    name: "Dr. Ken Miles",
    fallbackInitials: "KM",
    specialization: "Clinical Social Worker",
    experience: "15+ Years",
    bio: "Dr. Miles focuses on holistic well-being and crisis intervention, helping individuals and families navigate complex life situations.",
    avatarUrl: "https://placehold.co/100x100.png",
  },
];

export default function ConnectProfessionalsPage() {
  const handleMessage = (doctorId: string) => {
    alert(`Messaging doctor ${doctorId} - Feature not implemented.`);
    // Actual implementation would involve navigating to a chat interface or opening a modal
  };

  const handleBookAppointment = (doctorId: string) => {
    alert(`Booking appointment with doctor ${doctorId} - Feature not implemented.`);
    // Actual implementation would involve a calendar/booking system
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <BriefcaseMedical className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">Connect with Doctors</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Find and connect with mental health professionals.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-blue-500/50 bg-blue-500/10">
        <CardHeader className="p-4 sm:p-6 flex flex-row items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-blue-700 flex-shrink-0 mt-1" />
          <div>
            <CardTitle className="text-base sm:text-lg text-blue-700">Feature Under Development</CardTitle>
            <CardDescription className="text-sm text-blue-600 mt-0.5">
              The ability to directly message professionals or book appointments through this app is not yet implemented.
              This page demonstrates how professional profiles might be displayed. Full functionality requires backend integration.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {placeholderDoctors.map((doctor) => (
          <Card key={doctor.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="p-3 sm:p-4 md:p-5 flex flex-row items-start gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/50 flex-shrink-0">
                {doctor.avatarUrl ? <AvatarImage src={doctor.avatarUrl} alt={doctor.name} data-ai-hint="professional portrait" /> : null}
                <AvatarFallback className="text-xl sm:text-2xl bg-muted/80">
                  {doctor.fallbackInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <CardTitle className="text-lg sm:text-xl font-semibold">{doctor.name}</CardTitle>
                <p className="text-sm sm:text-base text-primary font-medium mt-0.5 sm:mt-1">{doctor.specialization}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Experience: {doctor.experience}</p>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-5 pt-0 flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-4">
                {doctor.bio}
              </p>
            </CardContent>
            <CardFooter className="p-3 sm:p-4 md:p-5 border-t flex flex-col items-stretch gap-3">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs sm:text-sm"
                onClick={() => handleMessage(doctor.id)}
              >
                <MessageSquare className="mr-1.5 sm:mr-2 h-4 w-4" /> Message Directly
              </Button>
              <Button
                size="sm"
                className="w-full text-xs sm:text-sm"
                onClick={() => handleBookAppointment(doctor.id)}
              >
                <CalendarPlus className="mr-1.5 sm:mr-2 h-4 w-4" /> Set Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
