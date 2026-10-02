// src/features/auth/components/AvatarPicker.tsx
import toast from "react-hot-toast";
import { AVATAR_PRESETS } from "@/lib/constants";
import { useAuthStore } from "../store/useAuthStore";
import { useUpdateProfile, type UserProfile } from "../hooks/useUpdateProfile";

interface AvatarPickerProps {
  profile: UserProfile;
}

// LIVE — picking an avatar immediately PATCHes /users/me with the full
// current profile plus the new avatarId (the backend requires the other
// fields on every update, so we resend what's already loaded rather than
// just the one changed field).
export default function AvatarPicker({ profile }: AvatarPickerProps) {
  const currentAvatarId = useAuthStore((s) => s.user?.avatarId);
  const updateProfile = useUpdateProfile();

  const handleSelect = (avatarId: number) => {
    updateProfile.mutate(
      {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        username: profile.username,
        avatarId,
      },
      {
        onError: () => toast.error("Couldn't update avatar. Please try again."),
      }
    );
  };

  return (
    <div className="mb-5">
      <div className="text-xs text-text-secondary mb-2">Avatar</div>
      <div className="grid grid-cols-4 gap-2.5">
        {AVATAR_PRESETS.map((preset) => {
          const isSelected = currentAvatarId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset.id)}
              disabled={updateProfile.isPending}
              aria-label={`Select avatar ${preset.id}`}
              className={`aspect-square rounded-full p-0.5 border-2 transition-colors disabled:opacity-50 ${
                isSelected ? "border-accent" : "border-transparent"
              }`}
            >
              <img
                src={preset.url}
                alt=""
                className="w-full h-full rounded-full bg-bg-raised"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
