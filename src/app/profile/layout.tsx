import { auth } from "@clerk/nextjs/server";
import { AuthGuard } from "@/components/auth/auth-guard";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  // Profile is fully signed-in; profile completeness is not required here
  return <AuthGuard requireProfile={false}>{children}</AuthGuard>;
}
