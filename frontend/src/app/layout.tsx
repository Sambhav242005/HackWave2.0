import "./globals.css";
import { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Multi-Agent AI Product Refinement",
  description: "Transform your product ideas through collaborative AI agents",
};


type RootLayoutProps = {
  children: React.ReactNode;
  session?: any;
};

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
   <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              <Providers session={session}>{children}</Providers>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
