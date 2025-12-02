"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { data: user, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: "/" }); // Redirect to home
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    redirect('/')
  }

  return (
    <>
      <Header />
      <div className="p-4">
        {children}
      </div>
      <Footer />
    </>
  );
}
