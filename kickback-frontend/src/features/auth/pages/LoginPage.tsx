// src/features/auth/pages/LoginPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import AuthSidePanel from "@/components/layout/AuthSidePanel";
import { LogoMark } from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
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
    <PageShell title="Log in">
      <div className="flex items-center gap-3 px-4 lg:px-10 py-3.5 lg:py-6">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} className="text-text-secondary lg:w-6 lg:h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2 lg:gap-3">
          <LogoMark className="w-6 h-6 lg:w-9 lg:h-9" />
          <span className="font-display font-bold text-lg lg:text-2xl text-text-primary">
            KickBack
          </span>
        </Link>
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

          <div className="flex justify-end -mt-2 mb-3">
            <Link
              to="/forgot-password"
              className="text-sm lg:text-base text-accent-text font-medium py-1"
            >
              Forgot password?
            </Link>
          </div>

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
            className="text-accent-text font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
      </div>
      <AuthSidePanel className="hidden lg:flex lg:w-1/2" />
      </div>
    </PageShell>
  );
}