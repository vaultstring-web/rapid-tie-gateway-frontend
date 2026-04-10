import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
<<<<<<< HEAD
import { Providers } from './providers';
import { ThemeProvider } from '@/context/ThemeContext';
=======
import Footer from '@/components/layout/Footer';
>>>>>>> approver

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'Rapid Tie Payment Gateway - VaultString',
  description: 'Secure, seamless payment processing for Malawi',
=======
  title: 'Rapid Tie Gateway',
  description: 'Secure, fast, and transparent payment processing for Malawi',
>>>>>>> approver
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
=======
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
>>>>>>> approver
