// src/features/auth/pages/SecuritySettingsPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validators";
import SettingsLayout from "../components/SettingsLayout";
import { useChangePassword } from "../hooks/useAccountSettings";

export default function SecuritySettingsPage() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          reset();
          toast.success("Password changed");
        },
        onError: (error) => {
          const status = isAxiosError(error) ? error.response?.status : undefined;
          if (status === 403) {
            setError("currentPassword", { message: "Current password is incorrect" });
          } else if (status === 400) {
            setError("newPassword", { message: "Choose a password different from your current one" });
          } else if (status === undefined || status < 500) {
            // 5xx already shows the app-wide "something went wrong" toast
            toast.error("Couldn't change your password. Please try again.");
          }
        },
      }
    );
  };

  return (
    <SettingsLayout title="Account security" backTo="/settings" backLabel="Back to settings">
      <h2 className="font-display font-semibold text-lg text-text-primary mb-1">Change password</h2>
      <p className="text-sm text-text-secondary mb-5">Use at least 6 characters.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Current password"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
          error={errors.currentPassword?.message}
        />
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

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="w-full bg-accent text-on-accent font-semibold text-sm py-3.5 rounded-card shadow-accent-glow mt-2 disabled:opacity-50 transition-opacity"
        >
          {changePassword.isPending ? "Saving..." : "Change password"}
        </button>
      </form>
    </SettingsLayout>
  );
}
