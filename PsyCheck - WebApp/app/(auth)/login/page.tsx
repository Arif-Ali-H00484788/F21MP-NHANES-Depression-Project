
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter your credentials to access your account.
        </p>
      </div>
      <LoginForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
