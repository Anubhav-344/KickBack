// src/features/auth/pages/ForgotPasswordPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators";
import AuthPageLayout from "../components/AuthPageLayout";
import { useForgotPassword } from "../hooks/useAccountSettings";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const forgot = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  if (sent) {
    return (
      <AuthPageLayout pageTitle="Check your email" heading="Check your email">
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-surface p-4 mb-6"
        >
          <MailCheck size={22} className="text-state-available shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm lg:text-base text-text-secondary">
            If an account matches what you entered, we&apos;ve sent a link to its email address to
            reset the password. The link works for 30 minutes.
          </p>
        </div>
        <Link to="/login" className="text-accent-text font-medium text-sm lg:text-base">
          Back to log in
        </Link>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      pageTitle="Forgot password"
      heading="Forgot your password?"
      subheading="Enter your email or phone and we'll send a reset link to your account's email."
    >
      <form onSubmit={handleSubmit((v) => forgot.mutate(v.identifier, { onSuccess: () => setSent(true) }))}>
        <Input
          label="Email or phone"
          placeholder="you@example.com"
          autoComplete="username"
          {...register("identifier")}
          error={errors.identifier?.message}
        />
        <Button
          type="submit"
          isLoading={forgot.isPending}
          loadingText="Sending..."
          className="mt-2"
        >
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm lg:text-base text-text-secondary mt-7">
        Remembered it?{" "}
        <Link to="/login" className="text-accent-text font-medium">
          Log in
        </Link>
      </p>
    </AuthPageLayout>
  );
}
