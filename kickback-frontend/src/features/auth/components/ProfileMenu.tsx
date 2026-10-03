// src/features/auth/components/ProfileMenu.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { User, CalendarCheck, HelpCircle, LogOut } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useAuthStore } from "../store/useAuthStore";
import { getAvatarUrl } from "@/lib/constants";

interface MenuItem {
  label: string;
  icon: typeof User;
  path?: string;
  action?: () => void;
  destructive?: boolean;
}

export default function ProfileMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const items: MenuItem[] = [
    { label: "Profile", icon: User, path: "/profile" },
    { label: "My Bookings", icon: CalendarCheck, path: "/bookings" },
    { label: "Help & Support", icon: HelpCircle, path: "/support" },
    {
      label: "Log out",
      icon: LogOut,
      destructive: true,
      action: () => {
        logout();
        navigate("/");
      },
    },
  ];

  const initial = user?.firstName?.[0]?.toUpperCase() ?? "?";
  const avatarUrl = getAvatarUrl(user?.avatarId);

  return (
    <BottomSheet
      title={user ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Account"}
      trigger={
        <button
          aria-label="Open account menu"
          className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-bg-raised border border-border-subtle flex items-center justify-center overflow-hidden"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full" />
          ) : (
            <span className="font-display font-semibold text-sm text-text-primary">
              {initial}
            </span>
          )}
        </button>
      }
    >
      {user?.email && (
        <div className="text-xs text-text-secondary -mt-2 mb-3.5">{user.email}</div>
      )}

      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <Dialog.Close asChild key={item.label}>
            <button
              onClick={() => (item.action ? item.action() : navigate(item.path!))}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-card text-left ${
                item.destructive ? "text-state-error" : "text-text-primary"
              }`}
            >
              <item.icon size={17} className={item.destructive ? "text-state-error" : "text-text-secondary"} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </Dialog.Close>
        ))}
      </div>
    </BottomSheet>
  );
}
