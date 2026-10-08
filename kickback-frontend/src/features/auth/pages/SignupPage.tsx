// src/features/auth/pages/SignupPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import AuthSidePanel from "@/components/layout/AuthSidePanel";
import { LogoMark } from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
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
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });
  const signupMutation = useSignup(redirectTo);

  // Explicit guard, independent of the zod resolver's cross-field .refine()
  // check — this guarantees the mutation can never fire on mismatched
  // passwords regardless of any resolver/version quirk.
  const onSubmit = (values: SignupFormValues) => {
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "Passwords don't match" });
      return;
    }
    signupMutation.mutate(values);
  };

  return (
    <PageShell title="Create account">
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
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-6 w-full">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="font-display font-semibold text-2xl lg:text-4xl text-text-primary mb-1.5">
          Create your account
        </h1>
        <p className="text-sm lg:text-base text-text-secondary mb-7">
          Sign up to start booking gaming sessions
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          <Button
            type="submit"
            isLoading={signupMutation.isPending}
            loadingText="Creating account..."
            className="mt-2"
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-sm lg:text-base text-text-secondary mt-7">
          Already have an account?{" "}
          <Link
            to={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
            className="text-accent-text font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
      </div>
      <AuthSidePanel className="hidden lg:flex lg:w-1/2" />
      </div>
    </PageShell>
  );
}