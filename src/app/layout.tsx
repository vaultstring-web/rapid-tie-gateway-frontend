import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';  // Add this import
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rapid Tie Payment Gateway - VaultString',
  description: 'Secure, seamless payment processing for Malawi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>  {/* Add AuthProvider here */}
            <Providers>
              {children}
              <Footer />
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}