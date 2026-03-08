'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Home', icon: '🏠' },
        { href: '/favorites', label: 'Favorites', icon: '❤️' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed top-2 left-0 right-0 z-50 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-3xl glass shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)]"
        >
            <div className="px-5 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.span
                            className="text-3xl"
                            whileHover={{ rotate: 20, scale: 1.2 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            🍳
                        </motion.span>
                        <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                            SmartRecipe
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'text-[var(--primary)]'
                                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className="absolute inset-0 bg-[var(--primary-light)] rounded-xl"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative flex items-center gap-1.5">
                                    <span>{link.icon}</span>
                                    {link.label}
                                </span>
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            className="ml-2 p-2.5 rounded-xl bg-[var(--muted)] hover:bg-[var(--card-border)] transition-colors"
                            aria-label="Toggle theme"
                        >
                            <motion.span
                                key={theme}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="block text-lg"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </motion.span>
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <motion.button
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-[var(--muted)]"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </motion.button>
                        <motion.button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-[var(--muted)]"
                            aria-label="Toggle menu"
                        >
                            <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-[var(--card-border)]"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(link.href)
                                        ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                                        : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                                        }`}
                                >
                                    <span>{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
