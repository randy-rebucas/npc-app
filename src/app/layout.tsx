import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { getConfigValue } from "@/app/actions/config"

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
  title: {
    default: await getConfigValue("siteName") || process.env.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${await getConfigValue("siteName") || process.env.NEXT_PUBLIC_APP_NAME}`,
  },
  description: await getConfigValue("siteDescription") || process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  keywords: await getConfigValue("keywords") || process.env.NEXT_PUBLIC_APP_KEYWORDS,
  authors: [
    {
      name: await getConfigValue("author") || process.env.NEXT_PUBLIC_APP_AUTHOR,
      url: await getConfigValue("authorUrl") || process.env.NEXT_PUBLIC_APP_AUTHOR_URL,
    },
  ],
  creator: await getConfigValue("author") || process.env.NEXT_PUBLIC_APP_AUTHOR,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: await getConfigValue("siteUrl") || process.env.NEXT_PUBLIC_APP_URL,
    title: await getConfigValue("siteName") || process.env.NEXT_PUBLIC_APP_NAME,
    description: await getConfigValue("siteDescription") || process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    siteName: await getConfigValue("siteName") || process.env.NEXT_PUBLIC_APP_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
