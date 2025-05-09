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
import { ClaimProvider } from "@/providers/claim-provider";

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
  themeColor: '#000000',
}

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAuthenticated = false;
  let claims = null;

  try {
    const logtoContext = await getLogtoContext(logtoConfig, {
      fetchUserInfo: true
    });
    isAuthenticated = logtoContext.isAuthenticated;
    claims = logtoContext.claims;
  } catch (error) {
    console.error('Logto authentication error:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful');
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
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
                <ClaimProvider>
                  <NotificationsProvider>
                    <main>{children}</main>
                  </NotificationsProvider>
                  {/* {session && <ChatBot />}   */}
                  {/* <ChatComponent />  */}
                </ClaimProvider>
              </ApplicationSettingsProvider>
            </LogtoProvider>
          </FontSizeProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
