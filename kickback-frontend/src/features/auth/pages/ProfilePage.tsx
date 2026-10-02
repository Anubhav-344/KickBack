// src/features/auth/pages/ProfilePage.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import { profileSchema, type ProfileFormValues } from "@/lib/validators";
import { useUserProfile, useUpdateProfile } from "../hooks/useUpdateProfile";
import { useAuthStore } from "../store/useAuthStore";
import AvatarPicker from "../components/AvatarPicker";

export default function ProfilePage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

  // Populate the form once the real profile loads — can't set defaultValues
  // up front since the data arrives asynchronously.
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName ?? "",
        email: profile.email,
        phone: profile.phone,
        username: profile.username ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => {
        // Re-baseline the form to what was just saved — without this,
        // isDirty stays true forever after the first save, since the form
        // keeps comparing against the ORIGINAL values it loaded with, not
        // what's now actually persisted. That's what let Save stay
        // clickable indefinitely even with nothing new to save.
        reset(values);
        toast.success("Profile updated");
      },
      onError: () => toast.error("Couldn't update profile. Please try again."),
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <PageShell>
      <Header />

      <div className="px-4 py-5">
        <div className="flex items-center gap-2.5 mb-5">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <h1 className="font-display font-semibold text-2xl text-text-primary">
            Profile
          </h1>
        </div>

        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : (
          <>
            {profile && <AvatarPicker profile={profile} />}
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  label="First name"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Last name"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Phone number"
              type="tel"
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

            <button
              type="submit"
              disabled={!isDirty || updateProfile.isPending}
              className="w-full bg-accent text-bg-base font-semibold text-sm py-3.5 rounded-card shadow-accent-glow mt-2 disabled:opacity-50 transition-opacity"
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </button>
            </form>
          </>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full mt-4 py-3 text-sm font-medium text-state-error"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>

      <Footer />
    </PageShell>
  );
}
