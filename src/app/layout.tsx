import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HopeHarbor — Community Social Development & Events Platform',
  description:
    'A sanctuary for grassroots community initiatives. Organize, join, and support local social drives.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-zinc-50 dark:bg-[#0a0e17] text-zinc-900 dark:text-zinc-100 antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`try { var theme = localStorage.getItem('theme') || 'system'; var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches); document.documentElement.classList.toggle('dark', dark); document.documentElement.style.colorScheme = dark ? 'dark' : 'light'; } catch (_) {}`}
        </Script>
        <ThemeProvider
        >
          <AuthProvider>
            <Suspense fallback={<div className="h-16" aria-hidden="true" />}>
              <Navbar />
            </Suspense>
            <div className="flex-1 pt-20">{children}</div>
            <Footer />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
