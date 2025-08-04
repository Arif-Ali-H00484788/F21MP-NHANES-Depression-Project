
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Droplets, BedDouble, Utensils, Dumbbell, Target, Weight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TrackerPage() {
  const lifestyleGoals = [
    { id: "water", name: "Water Intake", icon: Droplets, unit: "liters", type: "number", placeholder: "e.g., 2.5" },
    { id: "sleep", name: "Sleep Duration", icon: BedDouble, unit: "hours", type: "number", placeholder: "e.g., 7.5" },
    { id: "food", name: "Mindful Eating", icon: Utensils, unit: "meals", type: "select", options: ["0", "1", "2", "3+"] },
    { id: "exercise", name: "Exercise", icon: Dumbbell, unit: "minutes", type: "number", placeholder: "e.g., 30" },
    { id: "habit", name: "Additional Wellbeing Habits", icon: Target, unit: "minutes", type: "custom_habit" },
    { id: "weight", name: "Weight", icon: Weight, unit: "kg/lbs", type: "number", placeholder: "e.g., 70" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8"> {/* Adjusted vertical spacing */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">Lifestyle Tracker</CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1">
            Log your daily goals for food, water, sleep, exercise, habits, and weight.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6"> {/* Consistent padding */}
          <div className="mb-4 sm:mb-6">
            <Label htmlFor="date-picker" className="text-sm sm:text-base">Select Date</Label>
            <Input type="date" id="date-picker" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1.5 w-auto text-sm sm:text-base"/>
          </div>

          <form className="space-y-4 sm:space-y-6">
            {lifestyleGoals.map((goal) => (
              <Card key={goal.id} className="bg-card overflow-hidden"> {/* Ensure card background for nested cards and overflow hidden */}
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3"> {/* Slightly reduced padding for nested cards */}
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <goal.icon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    {goal.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0"> {/* Slightly reduced padding for nested cards */}
                  {goal.type === "number" && (
                    <div className="flex items-end gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0"> {/* Allow input to shrink */}
                        <Label htmlFor={goal.id} className="sr-only">{goal.name}</Label>
                        <Input type="number" id={goal.id} placeholder={goal.placeholder} step="0.1" className="text-sm sm:text-base w-full" />
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{goal.unit}</span>
                    </div>
                  )}
                  {goal.type === "select" && (
                     <div className="flex items-end gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0"> {/* Allow select to shrink */}
                          <Label htmlFor={goal.id} className="sr-only">{goal.name}</Label>
                          <Select>
                            <SelectTrigger id={goal.id} className="text-sm sm:text-base w-full">
                              <SelectValue placeholder={`Select ${goal.name.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {goal.options?.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{goal.unit}</span>
                    </div>
                  )}
                  {goal.type === "custom_habit" && (
                    <div className="space-y-3">
                       <div>
                        <Label htmlFor={`${goal.id}-description`} className="text-xs text-muted-foreground">Habit</Label>
                        <Input type="text" id={`${goal.id}-description`} placeholder="e.g., Meditation, Reading" className="text-sm sm:text-base w-full mt-1" />
                      </div>
                      <div className="flex items-end gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                           <Label htmlFor={`${goal.id}-duration`} className="text-xs text-muted-foreground">Duration</Label>
                           <Input type="number" id={`${goal.id}-duration`} placeholder="e.g., 15" step="1" className="text-sm sm:text-base w-full mt-1" />
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap pb-2">{goal.unit}</span>
                      </div>
                    </div>
                  )}
                   {goal.type === "checkbox" && (
                    <div className="items-top flex space-x-2 sm:space-x-3 mt-1 sm:mt-2">
                      <Checkbox id={goal.id} className="mt-0.5" />
                      <div className="grid gap-1 leading-none">
                        <Label htmlFor={goal.id} className="text-sm sm:text-base font-normal">
                          {goal.placeholder}
                        </Label>
                         <p className="text-xs text-muted-foreground mt-0.5">
                          Mark as completed.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <Button type="submit" size="lg" className="w-full sm:w-auto mt-6 sm:mt-8"> {/* Added size and margin */}
              Save Today's Log
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Tracking History</CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1">
            View your past lifestyle logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6"> {/* Consistent padding */}
          <div className="text-center text-muted-foreground py-6 sm:py-8">
            <p className="text-sm sm:text-base">Your tracking history will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
