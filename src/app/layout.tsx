import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getConfig } from "@/app/actions/config"
import { ThemeProvider } from "next-themes";
import { FontSizeProvider } from "@/providers/FontSizeProvider";
import { ApplicationSettingsProvider } from "@/providers/ApplicationSettingsProvider";
import { NotificationsProvider } from "@/providers/NotificationsProvider";
import { ClaimProvider } from "@/providers/ClaimProvider";
import { AuthProvider } from "@/providers/AuthProvider";

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: config?.siteName ?? process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
      template: `%s | ${config?.siteName ?? process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}`,
    },
    description: config?.siteDescription ?? process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? 'Welcome to our application',
    keywords: config?.keywords ?? process.env.NEXT_PUBLIC_APP_KEYWORDS ?? '',
    authors: [
      {
        name: config?.author ?? process.env.NEXT_PUBLIC_APP_AUTHOR ?? 'Developer',
        url: config?.authorUrl ?? process.env.NEXT_PUBLIC_APP_AUTHOR_URL ?? baseUrl,
      },
    ],
    creator: config?.author ?? process.env.NEXT_PUBLIC_APP_AUTHOR ?? 'Developer',
    openGraph: {
      type: "website",
      locale: "en_US",
      url: config?.siteUrl ?? baseUrl,
      title: config?.siteName ?? process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
      description: config?.siteDescription ?? process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? 'Welcome to our application',
      siteName: config?.siteName ?? process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: config?.siteName ?? process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config?.siteName ?? process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
      description: config?.siteDescription ?? process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? 'Welcome to our application',
      images: [`${baseUrl}/og-image.jpg`],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
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
          <AuthProvider>
            <FontSizeProvider>
              <ApplicationSettingsProvider>
                <ClaimProvider>
                  <NotificationsProvider>
                    <main>{children}</main>
                  </NotificationsProvider>
                  {/* {session && <ChatBot />}   */}
                  {/* <ChatComponent />  */}
                </ClaimProvider>
              </ApplicationSettingsProvider>
            </FontSizeProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
