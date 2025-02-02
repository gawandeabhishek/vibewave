// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import Player from "@/components/global/player";
import { SearchProvider } from "@/components/search-context";
import SearchResultClient from "@/components/global/search-result-client"; // Import client component
import { SongProvider } from "@/components/song-context";
import { StarsWorldProvider } from "@/components/isStars-world-context";
import Background from "@/components/background";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative mx-4 my-2 transition-all`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={["light", "dark", "rose", "blue", "violet"]}
            disableTransitionOnChange
          >
            <SearchProvider>
              <SongProvider>
                <StarsWorldProvider>
                  <SidebarProvider
                    style={
                      {
                        "--sidebar-width": "18rem",
                        "--sidebar-width-mobile": "30rem",
                      } as React.CSSProperties
                    }
                  >
                    <AppSidebar />

                    <main className="w-full min-h-screen">
                      <SidebarTrigger className="sticky top-4 h-10 w-10" />
                      {/* Replace children with SearchResult if results are available */}
                      <SearchResultClient>{children}</SearchResultClient>
                      <Player className={"sticky bottom-2"} />
                    </main>
                    <Background />
                  </SidebarProvider>
                </StarsWorldProvider>
              </SongProvider>
            </SearchProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
