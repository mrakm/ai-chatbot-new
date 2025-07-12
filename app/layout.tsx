import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { DataStreamProvider } from '@/components/data-stream-provider';

export const metadata: Metadata = {
  title: 'Chat SDK',
  description: 'Chat SDK is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications.',
  metadataBase: new URL('https://chat-sdk.dev'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DataStreamProvider>
            {children}
            <Toaster position="bottom-center" />
          </DataStreamProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}