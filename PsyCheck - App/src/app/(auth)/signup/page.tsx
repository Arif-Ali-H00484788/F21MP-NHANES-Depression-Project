
import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Create an Account
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter your details to get started with PsyCheck.
        </p>
      </div>
      <SignupForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="underline underline-offset-4 hover:text-primary"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
