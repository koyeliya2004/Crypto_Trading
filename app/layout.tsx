import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import PremiumBackground from "./components/PremiumBackground";

export const metadata: Metadata = {
  title: 'Crypto Trading Assistant',
  description: 'AI-powered cryptocurrency trading assistant with real-time insights',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* Inline 1x1 PNG favicon to avoid 404 while developing */}
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PremiumBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}