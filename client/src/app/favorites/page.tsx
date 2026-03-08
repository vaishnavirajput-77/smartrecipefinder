'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getFavorites, removeFavorite, Favorite } from '@/lib/api';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await getFavorites();
                setFavorites(data);
            } catch (err) {
                setError('Failed to load favorites. Make sure the backend and MongoDB are running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const handleRemove = async (recipeId: string) => {
        try {
            await removeFavorite(recipeId);
            setFavorites((prev) => prev.filter((f) => f.recipeId !== recipeId));
        } catch (err) {
            console.error('Failed to remove favorite:', err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="text-center mb-10"
            >
                <h1
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    ❤️ Your Favorite Recipes
                </h1>
                <p className="text-[var(--muted-foreground)] mt-2">
                    All your saved recipes in one place
                </p>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                >
                    <p className="text-red-500 text-lg">⚠️ {error}</p>
                </motion.div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--card-border)]">
                            <div className="skeleton aspect-[4/3] rounded-none" />
                            <div className="p-4 space-y-3">
                                <div className="skeleton h-5 w-3/4" />
                                <div className="flex gap-4">
                                    <div className="skeleton h-4 w-20" />
                                    <div className="skeleton h-4 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                >
                    <span className="text-7xl block mb-6">💔</span>
                    <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                    <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                        Start exploring recipes and save the ones you love! They&apos;ll appear here for quick access.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
                    >
                        Discover Recipes →
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {favorites.map((fav, i) => (
                            <motion.div
                                key={fav.recipeId}
                                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.05 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                layout
                            >
                                <div className="recipe-card group bg-[var(--card)] rounded-3xl overflow-hidden border border-[var(--card-border)] h-full flex flex-col hover:border-[var(--primary)] transition-all duration-300">
                                    <Link href={`/recipe/${fav.recipeId}`} className="block h-full outline-none">
                                        <div className="relative overflow-hidden aspect-[4/3] rounded-t-3xl">
                                            <Image
                                                src={fav.image || '/placeholder-food.jpg'}
                                                alt={fav.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {fav.cuisine && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-3 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full text-xs font-semibold">
                                                        {fav.cuisine}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-semibold text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors text-lg">
                                                {fav.name}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-[var(--muted-foreground)]">
                                                <div className="flex items-center gap-1.5">
                                                    <span>⏱️</span>
                                                    <span>{fav.cookingTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span>🔥</span>
                                                    <span>{fav.calories} cal</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Remove button */}
                                    <div className="px-4 pb-4">
                                        <motion.button
                                            onClick={() => handleRemove(fav.recipeId)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                        >
                                            ❌ Remove from Favorites
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
