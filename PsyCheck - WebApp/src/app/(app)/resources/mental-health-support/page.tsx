
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, AlertTriangle } from "lucide-react";

export default function MentalHealthSupportPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <LifeBuoy className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">Mental Health Support</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Emergency contacts and guidance for finding mental health support.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Emergency Contact Helplines</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <p className="font-semibold text-destructive">
            If you are in immediate distress or danger, please contact your local emergency services or go to the nearest hospital emergency department.
          </p>
          <ul className="list-disc list-outside pl-5 space-y-1">
            <li><strong>UAE:</strong> Dial <span className="font-bold">999</span> or <span className="font-bold">998</span> for ambulance.</li>
            <li><strong>Europe:</strong> Dial <span className="font-bold">112</span> (pan-European emergency number).</li>
          </ul>
          <p>These numbers are for emergencies. For non-emergency support, please refer to the resources below.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">General Tips for Finding Support</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <ul className="list-disc list-outside pl-5 space-y-1.5">
            <li>Check official government health websites for your region or country.</li>
            <li>Look for reputable non-profit organizations specializing in mental health.</li>
            <li>Ask a trusted healthcare professional, like your family doctor or a general practitioner, for referrals to mental health specialists.</li>
            <li>Many employers offer Employee Assistance Programs (EAPs) that include mental health support.</li>
            <li>Universities and educational institutions often have counseling and support services for students.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Guidance for the UAE</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <p>In the United Arab Emirates, you can find support through:</p>
          <ul className="list-disc list-outside pl-5 space-y-1.5">
            <li><strong>Official Health Authorities:</strong> Websites of the Ministry of Health and Prevention (MoHAP), Dubai Health Authority (DHA), and Abu Dhabi Department of Health (DoH) often list mental health services.</li>
            <li><strong>Community Development Authority (CDA):</strong> In Dubai, the CDA may offer or list relevant support services.</li>
            <li><strong>National Helplines:</strong> Search for national mental health helplines or support lines in the UAE (e.g., terms like "UAE mental health helpline").</li>
            <li><strong>Private Hospitals and Clinics:</strong> Many private healthcare facilities have psychiatry and psychology departments.</li>
            <li><strong>Specialized Campaigns and Initiatives:</strong> Look for government or NGO-led campaigns focusing on mental wellbeing.</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            Example search terms: "mental health support Dubai", "Abu Dhabi psychiatrist", "UAE counseling services".
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Guidance for the European Region</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <p>Across Europe, support can vary by country:</p>
          <ul className="list-disc list-outside pl-5 space-y-1.5">
            <li><strong>Emergency Number:</strong> Remember <span className="font-bold">112</span> is the pan-European emergency number.</li>
            <li><strong>Country-Specific Helplines:</strong> Search for mental health helplines specific to the country you are in (e.g., "Germany mental health helpline", "France crisis support").</li>
            <li><strong>Mental Health Europe:</strong> An umbrella organization that may provide links to national resources and organizations (<a href="https://www.mhe-sme.org" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">mhe-sme.org</a>).</li>
            <li><strong>Befrienders Worldwide:</strong> Has member organizations in many countries providing emotional support (<a href="https://www.befrienders.org" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">befrienders.org</a>).</li>
            <li><strong>Student Health Services:</strong> If you are a student, check your university or college for mental health support services.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-red-500/50 bg-red-500/10">
        <CardHeader className="p-4 sm:p-6 flex flex-row items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-700 flex-shrink-0" />
          <CardTitle className="text-base sm:text-lg text-red-700">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base text-red-700 space-y-2">
          <p>
            The information provided is for general guidance only and does not constitute medical or crisis intervention advice. It is not a comprehensive list of all available services.
          </p>
          <p>
            This application and its creators are not responsible for the services or advice provided by external organizations or helplines.
            Always verify information with local, trusted sources.
          </p>
          <p className="font-semibold">
            In a crisis, please contact local emergency services or a qualified healthcare professional immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
