
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle2, Lock, Edit3 } from "lucide-react";
// Separator not used, can be removed if not planned for future use

export default function ProfilePage() {
  const { user } = useAuth();

  // The LoadingScreen from AppLayout should handle the case where user is null/loading initially.
  // This is a fallback, but ideally, AppLayout prevents rendering this page until user is resolved.
  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || "User";
  const userEmail = user.email || "No email provided";

  const handleUpdateName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Update name functionality not yet implemented.");
  };

  const handleChangePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Change password functionality not yet implemented.");
  };

  return (
    <div className="space-y-6 sm:space-y-8"> {/* Adjusted vertical spacing */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
          <div className="flex items-center gap-3 sm:gap-4">
            <UserCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">Your Profile</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Manage your account settings and personal information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
            <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5"> {/* Consistent padding and spacing */}
            <form onSubmit={handleUpdateName} className="space-y-4 sm:space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input id="name" name="name" defaultValue={userName} className="flex-grow text-sm sm:text-base" />
                  <Button type="submit" variant="outline" size="icon" aria-label="Update name">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                <Input id="email" type="email" value={userEmail} disabled className="mt-1.5 bg-muted/50 text-sm sm:text-base" />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Email addresses cannot be changed through this interface.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
            <CardTitle className="text-lg sm:text-xl">Security</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5"> {/* Consistent padding and spacing */}
            <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5">
              <div>
                <Label htmlFor="currentPassword" className="text-sm sm:text-base">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" placeholder="Enter current password" className="mt-1.5 text-sm sm:text-base" />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-sm sm:text-base">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" placeholder="Enter new password" className="mt-1.5 text-sm sm:text-base" />
              </div>
               <div>
                <Label htmlFor="confirmNewPassword" className="text-sm sm:text-base">Confirm New Password</Label>
                <Input id="confirmNewPassword" name="confirmNewPassword" type="password" placeholder="Confirm new password" className="mt-1.5 text-sm sm:text-base" />
              </div>
              <Button type="submit" className="w-full text-sm sm:text-base" size="lg"> {/* Ensure button text scales */}
                <Lock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader className="p-4 sm:p-6"> {/* Consistent padding */}
            <CardTitle className="text-lg sm:text-xl">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4"> {/* Consistent padding and spacing */}
             <Button variant="destructive" className="w-full sm:w-auto text-sm sm:text-base" onClick={() => alert("Delete account functionality not yet implemented.")}>
              Delete Account
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Deleting your account is permanent and cannot be undone. All your data will be removed.
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
