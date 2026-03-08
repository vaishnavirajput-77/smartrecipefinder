'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Recipe } from '@/lib/api';

interface RecipeCardProps {
    recipe: Recipe;
    index?: number;
}

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                opacity: { duration: 0.4 },
                delay: index * 0.05
            }}
            className="h-full"
        >
            <Link href={`/recipe/${recipe.externalId}`} className="block h-full outline-none">
                <div className="recipe-card group bg-[var(--card)] rounded-3xl overflow-hidden border border-[var(--card-border)] cursor-pointer h-full flex flex-col transition-all duration-300">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[4/3] rounded-t-3xl">
                        <Image
                            src={recipe.image || '/placeholder-food.jpg'}
                            alt={recipe.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Cuisine badge */}
                        {recipe.cuisine && (
                            <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full text-xs font-semibold text-[var(--foreground)]">
                                    {recipe.cuisine}
                                </span>
                            </div>
                        )}

                        {/* Diet type badge */}
                        {recipe.type && (
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                                <span className={`px-2.5 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${recipe.type === 'Veg'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${recipe.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {recipe.type}
                                </span>
                                {recipe.rating && (
                                    <span className="px-2.5 py-1 bg-yellow-400 text-black text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1">
                                        ⭐ {recipe.rating}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* View button on hover */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold shadow-lg">
                                View Recipe →
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-semibold text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors text-lg">
                            {recipe.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-[var(--muted-foreground)]">
                            <div className="flex items-center gap-1.5 min-w-[80px]">
                                <span>⏱️</span>
                                <span>{recipe.cookingTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[80px]">
                                <span>💪</span>
                                <span>{recipe.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[80px]">
                                <span>🔥</span>
                                <span>{recipe.calories} cal</span>
                            </div>
                        </div>

                        {/* Category */}
                        {recipe.category && (
                            <div className="mt-3">
                                <span className="inline-block px-2.5 py-1 bg-[var(--muted)] rounded-lg text-xs font-medium text-[var(--muted-foreground)]">
                                    {recipe.category}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
