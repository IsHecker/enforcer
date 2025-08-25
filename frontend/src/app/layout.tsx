import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryProvider } from "@/components/providers/query-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // ensures SSR consistency
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProxyAPI - Authentication Proxy Platform",
  description: "Comprehensive authentication proxy with quotas & monetization platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const requestId = cookieStore.get("x-request-id")?.value;

  // Ensure class names are deterministic
  const fontClasses = `${geistSans.variable} ${geistMono.variable}`;

  return (
    <html lang="en" className="dark">
      <head>
        {requestId && <meta name="x-request-id" content={requestId} />}
      </head>
      <body suppressHydrationWarning className={`${fontClasses} antialiased bg-background text-foreground`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <NotificationProvider />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}