import { auth } from "@clerk/nextjs/server";
import { AuthGuard } from "@/components/auth/auth-guard";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  // Onboarding is where the profile gets created — don't require it yet
  return <AuthGuard requireProfile={false}>{children}</AuthGuard>;
}
