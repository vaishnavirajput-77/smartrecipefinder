'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Search Recipes' },
        { href: '/favorites', label: 'Favorites' },
    ];

    const socialLinks = [
        { icon: '𝕏', label: 'Twitter', href: '#' },
        { icon: '📘', label: 'Facebook', href: '#' },
        { icon: '📸', label: 'Instagram', href: '#' },
        { icon: '📌', label: 'Pinterest', href: '#' },
    ];

    return (
        <footer className="bg-[var(--card)] border-t border-[var(--card-border)] mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🍳</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                                SmartRecipe
                            </span>
                        </div>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                            Discover delicious recipes based on ingredients you already have at home.
                            Cook smarter, reduce waste, and enjoy amazing meals every day.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex gap-3">
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-xl bg-[var(--muted)] flex items-center justify-center text-lg hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
                                    aria-label={link.label}
                                >
                                    {link.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-[var(--card-border)] text-center">
                    <p className="text-[var(--muted-foreground)] text-sm">
                        © {currentYear} SmartRecipe Finder. Made with ❤️ for food lovers everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
}
