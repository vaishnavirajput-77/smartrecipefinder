import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Smart Recipe Finder | Discover Recipes From Your Ingredients',
  description: 'Find delicious recipes based on ingredients you already have at home. Search by ingredients, save favorites, and cook amazing meals every day.',
  keywords: ['recipes', 'cooking', 'ingredients', 'meal finder', 'food discovery'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
