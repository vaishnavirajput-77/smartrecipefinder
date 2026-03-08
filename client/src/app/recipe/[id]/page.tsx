'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById, addFavorite, removeFavorite, checkFavorite, Recipe } from '@/lib/api';

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeById(id);
                setRecipe(data);
                // Check if favorited
                try {
                    const fav = await checkFavorite(id);
                    setIsFavorite(fav);
                } catch {
                    // ignore - favorites may not work without MongoDB
                }
            } catch (err) {
                setError('Failed to load recipe details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const toggleFavorite = async () => {
        if (!recipe) return;
        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                await removeFavorite(recipe.externalId);
                setIsFavorite(false);
            } else {
                await addFavorite(recipe);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        } finally {
            setFavoriteLoading(false);
        }
    };

    // Parse instructions into steps
    const getSteps = (instructions: string) => {
        if (!instructions) return [];
        return instructions
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="skeleton h-8 w-32 mb-6 rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="skeleton aspect-square rounded-2xl" />
                    <div className="space-y-4">
                        <div className="skeleton h-10 w-3/4" />
                        <div className="skeleton h-6 w-1/2" />
                        <div className="flex gap-4">
                            <div className="skeleton h-16 w-24 rounded-xl" />
                            <div className="skeleton h-16 w-24 rounded-xl" />
                            <div className="skeleton h-16 w-24 rounded-xl" />
                        </div>
                        <div className="skeleton h-12 w-48 rounded-xl" />
                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="skeleton h-5 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <span className="text-6xl block mb-4">😔</span>
                <h2 className="text-2xl font-bold mb-2">Recipe Not Found</h2>
                <p className="text-[var(--muted-foreground)] mb-6">{error}</p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
                >
                    ← Back to Home
                </Link>
            </div>
        );
    }

    const steps = getSteps(recipe.instructions);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link
                    href="/search"
                    className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-6"
                >
                    ← Back to recipes
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src={recipe.image}
                            alt={recipe.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {recipe.cuisine && (
                                <span className="px-3 py-1.5 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full text-sm font-semibold">
                                    🌍 {recipe.cuisine}
                                </span>
                            )}
                            {recipe.category && (
                                <span className="px-3 py-1.5 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full text-sm font-semibold">
                                    📂 {recipe.category}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 25, delay: 0.1 }}
                >
                    <h1
                        className="text-3xl sm:text-4xl font-bold mb-4"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {recipe.name}
                    </h1>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--muted)] rounded-xl border border-[var(--card-border)]">
                            <span className="text-xl">⏱️</span>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Time</div>
                                <div className="font-semibold text-sm">{recipe.cookingTime}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--muted)] rounded-xl border border-[var(--card-border)]">
                            <span className="text-xl">💪</span>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Skill</div>
                                <div className="font-semibold text-sm">{recipe.difficulty}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--muted)] rounded-xl border border-[var(--card-border)]">
                            <span className="text-xl">⭐</span>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Rating</div>
                                <div className="font-semibold text-sm">{recipe.rating} / 5.0</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--muted)] rounded-xl border border-[var(--card-border)]">
                            <span className="text-xl">🔥</span>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Energy</div>
                                <div className="font-semibold text-sm">{recipe.calories} kcal</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--muted)] rounded-xl border border-[var(--card-border)]">
                            <span className="text-xl">🍽️</span>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Type</div>
                                <div className="font-semibold text-sm">{recipe.category}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--muted)] rounded-xl border border-[var(--card-border)]">
                            <span className="text-xl">{recipe.type === 'Veg' ? '🟢' : '🔴'}</span>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Diet</div>
                                <div className="font-semibold text-sm">{recipe.type}</div>
                            </div>
                        </div>
                    </div>

                    {/* Favorite button */}
                    <motion.button
                        onClick={toggleFavorite}
                        disabled={favoriteLoading}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold transition-all mb-8 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl ${isFavorite
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-[var(--card)] border border-[var(--card-border)] hover:border-red-400 text-[var(--foreground)]'
                            }`}
                    >
                        <motion.span
                            key={String(isFavorite)}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xl"
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </motion.span>
                        {favoriteLoading ? 'Saving...' : isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
                    </motion.button>

                    {/* Ingredients */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>🧾</span> Ingredients
                            <span className="text-sm font-normal text-[var(--muted-foreground)]">
                                ({recipe.ingredients.length} items)
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {recipe.ingredients.map((ing, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.03 }}
                                    className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0" />
                                    <span className="text-sm">{ing}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Instructions */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mt-12"
            >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                    <span>👨‍🍳</span> Cooking Instructions
                </h2>
                <div className="space-y-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="flex gap-4 p-4 bg-[var(--card)] rounded-2xl border border-[var(--card-border)]"
                        >
                            <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold">
                                {i + 1}
                            </div>
                            <p className="text-[var(--foreground)] leading-relaxed pt-1">{step}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Video Section */}
            {recipe.videoLink && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mt-12"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                        <span>📺</span> Video Tutorial
                    </h2>
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-[var(--card-border)] bg-black">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${recipe.videoLink.includes('watch?v=') ? recipe.videoLink.split('v=')[1] : recipe.videoLink.split('/').pop()}`}
                            title={`${recipe.name} Recipe Video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </motion.div>
            )}

            {/* Nutrition Info */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mt-12 p-6 bg-[var(--card)] rounded-2xl border border-[var(--card-border)]"
            >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>📊</span> Nutrition Information
                    <span className="text-xs font-normal text-[var(--muted-foreground)]">(estimated)</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Calories', value: `${recipe.calories}`, unit: 'kcal', icon: '🔥' },
                        { label: 'Protein', value: `${Math.round(recipe.calories * 0.12)}`, unit: 'g', icon: '💪' },
                        { label: 'Carbs', value: `${Math.round(recipe.calories * 0.15)}`, unit: 'g', icon: '🌾' },
                        { label: 'Fat', value: `${Math.round(recipe.calories * 0.05)}`, unit: 'g', icon: '🫒' },
                    ].map((item) => (
                        <div key={item.label} className="text-center p-4 bg-[var(--muted)] rounded-xl">
                            <div className="text-2xl mb-1">{item.icon}</div>
                            <div className="text-xl font-bold text-[var(--primary)]">
                                {item.value}
                                <span className="text-sm text-[var(--muted-foreground)]"> {item.unit}</span>
                            </div>
                            <div className="text-xs text-[var(--muted-foreground)] mt-1">{item.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
