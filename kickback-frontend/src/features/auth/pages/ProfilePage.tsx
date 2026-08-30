// src/features/auth/pages/ProfilePage.tsx
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "../store/useAuthStore";

// STUB — real version: editable name/email/phone, avatar-preset picker
// (per USERS.avatar_id, once that column exists), and account deletion.
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <PageShell>
      <Header />
      <div className="px-4 py-6">
        <h1 className="font-display font-semibold text-2xl text-text-primary mb-4">
          Profile
        </h1>
        {user && (
          <div className="bg-bg-surface border border-border-subtle rounded-card p-4 text-sm text-text-primary">
            <div>{user.firstName} {user.lastName}</div>
            <div className="text-text-secondary mt-1">{user.email}</div>
          </div>
        )}
      </div>
      <Footer cafeName="Respawn Lounge" locationLabel="Bhopal" />
    </PageShell>
  );
}
