import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/scrollbar.css";
import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryProvider } from "@/components/providers/query-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";

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
  title: "Enforcer",
  description: "Powerful API access control and monetization platform. Enforce quotas, rate limits, and authentication with real-time analytics. Professional dark interface for seamless API management.",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_c1c99d0e-4957-48ab-a3e5-7d66f73b4208-X5tVbGEfKCZmAPfnRcEQjUyVPEuwoX",
      button: {
        title: "Open with Ohara",
        action: {
          type: "launch_frame",
          name: "Enforcer",
          url: "https://successful-cold-255.preview.series.engineering",
          splashImageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          splashBackgroundColor: "#ffffff"
        }
      }
    })
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const requestId = cookieStore.get("x-request-id")?.value;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {requestId && <meta name="x-request-id" content={requestId} />}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <NotificationProvider />
            <ResponseLogger />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}