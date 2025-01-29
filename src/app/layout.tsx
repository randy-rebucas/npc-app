import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { getConfig } from "@/app/actions/config"
import { NotificationsProvider } from "@/providers/notifications-provider";
import { MessagingProvider } from "@/providers/messaging-provider";
import { ApplicationSettingsProvider } from "@/providers/application-settings-provider";
import ChatBot from '@/components/root/ChatBot/ChatBot';

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

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();

  return {
    title: {
      default: config?.siteName || process.env.NEXT_PUBLIC_APP_NAME,
      template: `%s | ${config?.siteName || process.env.NEXT_PUBLIC_APP_NAME}`,
    },
    description: config?.siteDescription || process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    keywords: config?.keywords || process.env.NEXT_PUBLIC_APP_KEYWORDS,
    authors: [
      {
        name: config?.author || process.env.NEXT_PUBLIC_APP_AUTHOR,
        url: config?.authorUrl || process.env.NEXT_PUBLIC_APP_AUTHOR_URL,
      },
    ],
    creator: config?.author || process.env.NEXT_PUBLIC_APP_AUTHOR,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: config?.siteUrl || process.env.NEXT_PUBLIC_APP_URL,
      title: config?.siteName || process.env.NEXT_PUBLIC_APP_NAME,
      description: config?.siteDescription || process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      siteName: config?.siteName || process.env.NEXT_PUBLIC_APP_NAME,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <ApplicationSettingsProvider>
          <AuthProvider>
            <MessagingProvider>
              <NotificationsProvider>
                {children}
              </NotificationsProvider>
            </MessagingProvider>
            <ChatBot />
          </AuthProvider>
        </ApplicationSettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
