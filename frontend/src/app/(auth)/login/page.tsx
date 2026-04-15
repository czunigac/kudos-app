import { LoginForm } from "@/components/auth/LoginForm";
import { Award } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-kudos-bg px-4 py-12">
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
              Sign in to recognize your team
            </p>
          </div>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
