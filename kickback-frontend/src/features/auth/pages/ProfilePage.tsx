// src/features/auth/pages/ProfilePage.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import AuthSidePanel from "@/components/layout/AuthSidePanel";
import Input from "@/components/ui/Input";
import { profileSchema, type ProfileFormValues } from "@/lib/validators";
import { useUserProfile, useUpdateProfile } from "../hooks/useUpdateProfile";
import { useAuthStore } from "../store/useAuthStore";
import AvatarPicker from "../components/AvatarPicker";
import { ProfileSkeleton } from "../components/AuthSkeletons";

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
    <PageShell title="Profile">
      <Header />

      <div className="flex-1 flex">
      <div className="flex-1 lg:w-1/2 px-4 lg:px-16 py-6 lg:py-8 w-full">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center gap-2.5 mb-6">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <h1 className="font-display font-semibold text-2xl text-text-primary">
            Profile
          </h1>
        </div>

        {isLoading ? (
          <ProfileSkeleton />
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
              className="w-full bg-accent text-on-accent font-semibold text-sm py-3.5 rounded-card shadow-accent-glow mt-2 disabled:opacity-50 transition-opacity"
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </button>
            </form>
          </>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full mt-5 py-3 text-sm font-medium text-state-error"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
      </div>
      <AuthSidePanel className="hidden lg:flex lg:w-1/2" />
      </div>

    </PageShell>
  );
}