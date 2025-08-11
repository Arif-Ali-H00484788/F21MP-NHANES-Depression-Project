
import { AppLogo } from "@/components/common/AppLogo";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8">
        <AppLogo size={60} className="[&>span]:text-3xl" />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 sm:p-8">
          {children}
        </CardContent>
      </Card>
    </main>
  );
}

