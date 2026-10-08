// src/features/auth/pages/ResetPasswordPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators";
import AuthPageLayout from "../components/AuthPageLayout";
import { useResetPassword } from "../hooks/useAccountSettings";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const reset = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <AuthPageLayout pageTitle="Reset password" heading="This link isn't valid">
        <p className="text-sm lg:text-base text-text-secondary mb-6">
          The reset link is missing or incomplete. Request a new one and try again.
        </p>
        <Link to="/forgot-password" className="text-accent-text font-medium text-sm lg:text-base">
          Request a new link
        </Link>
      </AuthPageLayout>
    );
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    reset.mutate(
      { token, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success("Password updated. Log in with your new password.");
          navigate("/login", { replace: true });
        },
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 400) {
            toast.error("This reset link is invalid or has expired. Request a new one.");
            navigate("/forgot-password", { replace: true });
          }
        },
      },
    );
  };

  return (
    <AuthPageLayout
      pageTitle="Reset password"
      heading="Set a new password"
      subheading="Choose a password you haven't used before."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          isLoading={reset.isPending}
          loadingText="Saving..."
          className="mt-2"
        >
          Update password
        </Button>
      </form>
    </AuthPageLayout>
  );
}
