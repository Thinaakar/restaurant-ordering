import type { Metadata } from 'next';
import './globals.css';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { cn } from "@/lib/utils";
import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider } from '@/hooks/use-auth';
import { TablesProvider } from '@/hooks/use-tables';
import { OrdersProvider } from '@/hooks/use-orders';
import { CartProvider } from '@/hooks/use-cart';
import { ToastProvider } from '@/hooks/use-toast';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aura – Fine Dining & Operations',
  description: 'Premium Restaurant Ordering & Kitchen Management System',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark theme font-sans antialiased", playfairDisplay.variable, dmSans.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('aura_theme');
                  if (theme !== 'light' && theme !== 'dark') theme = 'dark';
                  var root = document.documentElement;
                  root.classList.remove(theme === 'dark' ? 'light' : 'dark');
                  root.classList.add(theme);
                  root.style.colorScheme = theme;
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <TablesProvider>
                <OrdersProvider>
                  <CartProvider>
                    {children}
                  </CartProvider>
                </OrdersProvider>
              </TablesProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
