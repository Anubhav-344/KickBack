// src/features/auth/pages/LoginPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Input from "@/components/ui/Input";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { useLogin } from "../hooks/useAuth";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const loginMutation = useLogin(redirectTo);

  return (
    <PageShell>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} className="text-text-secondary" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent" />
          <span className="font-display font-bold text-lg text-text-primary">
            KickBack
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-6">
        <h1 className="font-display font-semibold text-2xl text-text-primary mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Log in to book your next session
        </p>

        <form onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <Input
            label="Email or phone"
            placeholder="you@example.com"
            {...register("identifier")}
            error={errors.identifier?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022"
            {...register("password")}
            error={errors.password?.message}
          />

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-accent text-bg-base font-semibold text-sm py-3.5 rounded-card shadow-accent-glow mt-2 disabled:opacity-60 transition-opacity"
          >
            {loginMutation.isPending ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
            className="text-accent-hover font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
