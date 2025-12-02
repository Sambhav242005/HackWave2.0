"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const profileImage = session?.user?.image
  ? { src: session.user.image, default: false }
  : { src: "/img/default-img-pic.png", default: true };


  return (
    <header className="sticky top-0 z-50 p-0 w-full border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 dark:shadow-xl/30 dark:shadow-gray-500/50">
      <div className="container flex h-16 max-w-screen-2xl mx-auto items-center justify-between px-4">
        {/* Logo & Desktop Navigation */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="hidden sm:inline-block font-bold text-foreground text-lg">
              Multi-Agent AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 ml-10">
            <Link
              href="/workspace"
              className="text-foreground font-medium transition-colors hover:text-accent dark:text-foreground dark:hover:text-accent"
            >
              Workspace
            </Link>
            <Link
              href="/about"
              className="text-foreground/80 font-medium transition-colors hover:text-foreground dark:text-foreground/80"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right-side Navigation */}
        <div className="flex items-center space-x-2 ml-auto">
          <ThemeToggle />

          {session?.user ? (
            <div className="hidden md:flex items-center space-x-2">
              <img
                src={profileImage.src}
                alt="Profile"
                className={cn(
                  "w-8 h-8 rounded-full object-cover shadow border",
                  profileImage.default
                    ? "filter dark:invert dark:border-gray-600 border-gray-300"
                    : "bg-transparent border-transparent"
                )}
              />


              <Button
                size="sm"
                variant="ghost"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild size="sm" variant="ghost">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background dark:bg-background">
          <div className="container py-4 px-4 space-y-3">
            <Link
              href="/workspace"
              className="block py-2 text-foreground font-medium dark:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Workspace
            </Link>
            <Link
              href="/about"
              className="block py-2 text-foreground/80 font-medium dark:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
              {session?.user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <img
                      src={profileImage.src}
                      alt="Profile"
                      className={cn("w-8 h-8 rounded-full object-cover bg-gray-200 dark:bg-gray-800 shadow",profileImage.default ? "invert" :"")}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="justify-start"
                  >
                    <Link
                      href="/signin"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground justify-start"
                  >
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
