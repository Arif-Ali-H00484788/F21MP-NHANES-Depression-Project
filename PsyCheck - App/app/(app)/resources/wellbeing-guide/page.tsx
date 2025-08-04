
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react"; // Using ShieldCheck as an icon for the guide

export default function WellbeingGuidePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">Wellbeing Guide</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Understanding key aspects of mental health.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">What is Mental Health?</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <p>
            Mental health is a state of well-being in which an individual realizes his or her own abilities,
            can cope with the normal stresses of life, can work productively, and is able to make a contribution
            to his or her community. (World Health Organization - WHO)
          </p>
          <p>
            It is not just the absence of mental illness, but a positive sense of emotional, psychological, and social well-being.
            It influences how we think, feel, and act. It also helps determine how we handle stress, relate to others,
            and make healthy choices.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Why is Mental Health Important?</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <p>
            Mental health is crucial at every stage of life, from childhood and adolescence through adulthood. It impacts:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-1.5">
            <li><strong>Physical Health:</strong> Poor mental health can negatively affect physical health, leading to an increased risk of some conditions like heart disease.</li>
            <li><strong>Relationships:</strong> It helps us form and maintain healthy relationships with others.</li>
            <li><strong>Productivity & Potential:</strong> Good mental health allows individuals to work productively, realize their full potential, and contribute meaningfully to their communities.</li>
            <li><strong>Coping Abilities:</strong> It equips us to cope with the stresses and challenges of daily life.</li>
            <li><strong>Overall Quality of Life:</strong> It is fundamental to our collective and individual ability as humans to think, emote, interact with each other, earn a living, and enjoy life.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Factors Affecting Mental Health</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <p>
            A range of factors can influence mental health, including:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-1.5">
            <li><strong>Biological Factors:</strong> Such as genetics, brain chemistry, or brain injury.</li>
            <li><strong>Life Experiences:</strong> Including trauma, abuse, significant loss, or major life changes.</li>
            <li><strong>Family History:</strong> A family history of mental health problems can sometimes increase risk.</li>
            <li><strong>Lifestyle Factors:</strong> Such as diet, physical activity, sleep, and substance use.</li>
            <li><strong>Social and Environmental Factors:</strong> Including social support, socioeconomic status, discrimination, living conditions, and exposure to violence or adversity.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">When to Seek Help</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base space-y-2 sm:space-y-3">
          <p>
            It's important to seek professional help if you or someone you know experiences signs such as:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-1.5">
            <li>Persistent sadness or irritability.</li>
            <li>Excessive fears, worries, or anxiety.</li>
            <li>Social withdrawal or isolation.</li>
            <li>Dramatic changes in eating or sleeping habits.</li>
            <li>Difficulty concentrating or making decisions.</li>
            <li>Extreme mood changes (highs and lows).</li>
            <li>Loss of interest in activities once enjoyed.</li>
            <li>Thoughts of self-harm or suicide.</li>
            <li>Unexplained physical ailments.</li>
          </ul>
          <p className="font-medium">
            Seeking help is a sign of strength, not weakness. Effective treatments, support systems, and coping strategies are available.
          </p>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg text-yellow-700">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base text-yellow-700 space-y-2">
          <p>
            The information provided in this guide is for general educational purposes only and does not constitute medical advice.
            It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or mental health concern.
            Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
