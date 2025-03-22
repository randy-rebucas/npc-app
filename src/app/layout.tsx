import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getConfig } from "@/app/actions/config"
import { ThemeProvider } from "next-themes";
import { FontSizeProvider } from "@/providers/font-provider";
import { LogtoProvider, ClaimProps } from "@/providers/logto-session-provider";
import { ApplicationSettingsProvider } from "@/providers/application-settings-provider";
import { NotificationsProvider } from "@/providers/notifications-provider";
import { MessagingProvider } from "@/providers/messaging-provider";
import { logtoConfig } from "./logto";
import { getLogtoContext } from "@logto/next/server-actions";

// import { OpenAIProvider } from "@/providers/openai-provider";
// import ChatBot from '@/components/root/ChatBot/ChatBot';
// import ChatComponent from "@/components/example/ChatComponent";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, { fetchUserInfo: true }); 

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <ThemeProvider attribute="class">
          <FontSizeProvider>
            <LogtoProvider 
              isAuthenticated={isAuthenticated} 
              claims={claims as ClaimProps}
            >
              <ApplicationSettingsProvider>
                {/* <OpenAIProvider> */}
                <MessagingProvider>
                  <NotificationsProvider>
                    {children}
                  </NotificationsProvider>
                </MessagingProvider>
                {/* {session && <ChatBot />}   */}
                {/* <ChatComponent />  */}
                {/* </OpenAIProvider> */}
              </ApplicationSettingsProvider>
            </LogtoProvider>
          </FontSizeProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
