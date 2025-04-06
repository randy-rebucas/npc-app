import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getConfig } from "@/app/actions/config"
import { ThemeProvider } from "next-themes";
import { FontSizeProvider } from "@/providers/font-provider";
import { LogtoProvider, ClaimProps } from "@/providers/logto-session-provider";
import { ApplicationSettingsProvider } from "@/providers/application-settings-provider";
import { NotificationsProvider } from "@/providers/notifications-provider";
import { logtoConfig } from "./logto";
import { getLogtoContext } from "@logto/next/server-actions";

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
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

export const viewport: Viewport = {
  themeColor: 'black',
}
 
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, { 
    fetchUserInfo: true
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <FontSizeProvider>
            <LogtoProvider
              isAuthenticated={isAuthenticated}
              claims={claims as ClaimProps}
            >
              <ApplicationSettingsProvider>
                <NotificationsProvider>
                  <main>{children}</main>
                </NotificationsProvider>
                {/* {session && <ChatBot />}   */}
                {/* <ChatComponent />  */}
              </ApplicationSettingsProvider>
            </LogtoProvider>
          </FontSizeProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
