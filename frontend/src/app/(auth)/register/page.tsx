import { RegisterForm } from "@/components/auth/RegisterForm";
import { ArrowLeft, Award } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-kudos-bg px-4 py-12">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:left-8 md:top-6"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        Back to home
      </Link>
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Award className="h-8 w-8" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              KudosApp
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your account
            </p>
          </div>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
