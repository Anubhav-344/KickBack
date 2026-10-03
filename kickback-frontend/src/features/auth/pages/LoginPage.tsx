// src/features/auth/pages/LoginPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import AuthSidePanel from "@/components/layout/AuthSidePanel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { useLogin } from "../hooks/useAuth";

// TODO(dev-only): remove this import once real auth/login is live
import DevLoginPanel from "../components/DevLoginPanel"; // ← dev login for testing

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
      <div className="flex items-center gap-3 px-4 lg:px-10 py-3.5 lg:py-6">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} className="text-text-secondary lg:w-6 lg:h-6" />
        </button>
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-6 h-6 lg:w-9 lg:h-9 rounded-md bg-accent" />
          <span className="font-display font-bold text-lg lg:text-2xl text-text-primary">
            KickBack
          </span>
        </div>
      </div>

      <div className="flex-1 flex">
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-6 w-full">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="font-display font-semibold text-2xl lg:text-4xl text-text-primary mb-1.5">
          Welcome back
        </h1>
        <p className="text-sm lg:text-base text-text-secondary mb-7">
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

          <Button
            type="submit"
            isLoading={loginMutation.isPending}
            loadingText="Logging in..."
            className="mt-2"
          >
            Log in
          </Button>
        </form>

        <p className="text-center text-sm lg:text-base text-text-secondary mt-7">
          Don&apos;t have an account?{" "}
          <Link
            to={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
            className="text-accent-hover font-medium"
          >
            Sign up
          </Link>
        </p>

        {/* TODO(dev-only): remove this block once real auth/login is live */}
        {import.meta.env.DEV && <DevLoginPanel redirectTo={redirectTo} />}
      </div>
      </div>
      <AuthSidePanel className="hidden lg:flex lg:w-1/2" />
      </div>
    </PageShell>
  );
}