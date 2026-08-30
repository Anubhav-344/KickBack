// src/features/auth/pages/SignupPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Input from "@/components/ui/Input";
import { signupSchema, type SignupFormValues } from "@/lib/validators";
import { useSignup } from "../hooks/useAuth";

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });
  const signupMutation = useSignup(redirectTo);

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
          Create your account
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Sign up to start booking gaming sessions
        </p>

        <form onSubmit={handleSubmit((values) => signupMutation.mutate(values))}>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="First name"
                placeholder="Anubhav"
                {...register("firstName")}
                error={errors.firstName?.message}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Last name"
                placeholder="Optional"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Input
            label="Username"
            placeholder="Optional"
            {...register("username")}
            error={errors.username?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            {...register("password")}
            error={errors.password?.message}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-accent text-bg-base font-semibold text-sm py-3.5 rounded-card shadow-accent-glow mt-2 disabled:opacity-60 transition-opacity"
          >
            {signupMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link
            to={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
            className="text-accent-hover font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
