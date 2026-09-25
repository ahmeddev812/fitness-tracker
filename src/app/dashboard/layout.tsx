import { auth } from "@clerk/nextjs/server";
import { AuthGuard } from "@/components/auth/auth-guard";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  return <AuthGuard>{children}</AuthGuard>;
}
