
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ListChecks, Brain, Droplets, BedDouble, Utensils } from "lucide-react"; // Removed TrendingUp as it's not used directly here

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8"> {/* Adjusted vertical spacing for responsiveness */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6"> {/* Ensure consistent padding */}
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">Welcome to Your Dashboard</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Here&apos;s an overview of your well-being and progress.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <Brain className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">5 New</div>
            <p className="text-xs text-muted-foreground">Sentiment: Generally Positive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-sm font-medium">Lifestyle Goals</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">80% Complete</div>
            <p className="text-xs text-muted-foreground">Tracked for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-sm font-medium">PHQ-9 Score</CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">7 (Mild)</div>
            <p className="text-xs text-muted-foreground">Last assessment: 3 days ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Lifestyle Summary */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Weekly Lifestyle Summary</CardTitle>
          <CardDescription className="text-sm sm:text-base">Your tracked activities for the past week.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-secondary/50 rounded-md">
            <div className="flex items-center gap-3 mb-1 sm:mb-0">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm sm:text-base">Water Intake</span>
            </div>
            <span className="text-base sm:text-lg font-semibold">1.8 L <span className="text-xs sm:text-sm text-muted-foreground">/ day avg</span></span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-secondary/50 rounded-md">
            <div className="flex items-center gap-3 mb-1 sm:mb-0">
              <BedDouble className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm sm:text-base">Sleep</span>
            </div>
            <span className="text-base sm:text-lg font-semibold">7.2 hr <span className="text-sm text-muted-foreground">/ night avg</span></span>
          </div>
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-secondary/50 rounded-md">
            <div className="flex items-center gap-3 mb-1 sm:mb-0">
              <Utensils className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm sm:text-base">Mindful Eating</span>
            </div>
            <span className="text-base sm:text-lg font-semibold">5 days <span className="text-xs sm:text-sm text-muted-foreground">/ week</span></span>
          </div>
        </CardContent>
      </Card>
      
      {/* Mood Trend Chart */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Mood Trend (from Journal)</CardTitle>
           <CardDescription className="text-sm sm:text-base">Based on sentiment analysis of your journal entries.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Responsive height for chart placeholder */}
          <div className="min-h-[200px] h-[250px] sm:h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-4 text-center">
            <LineChart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-muted-foreground">Mood chart coming soon!</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
