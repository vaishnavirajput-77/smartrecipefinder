'use client';

import { ThemeProvider } from '@/lib/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <ThemeProvider>
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 pt-16"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
            <Footer />
        </ThemeProvider>
    );
}
