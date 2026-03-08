'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import SkeletonCard from '@/components/SkeletonCard';
import { searchRecipes, getCategoriesData, Recipe, Category } from '@/lib/api';

function SearchContent() {
    const searchParams = useSearchParams();
    const ingredientsParam = searchParams.get('ingredients') || '';

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isFallback, setIsFallback] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cuisines, setCuisines] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCuisine, setSelectedCuisine] = useState('all');
    const [selectedDiet, setSelectedDiet] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [maxTime, setMaxTime] = useState('');
    const [currentIngredients, setCurrentIngredients] = useState<string[]>(
        ingredientsParam ? ingredientsParam.split(',') : []
    );

    // Items per page for pagination
    const [visibleCount, setVisibleCount] = useState(12);

    const fetchRecipes = useCallback(async (ingredients: string[], cuisine?: string, time?: string, diet?: string, category?: string) => {
        setLoading(true);
        setError('');
        setIsFallback(false);
        try {
            const results = await searchRecipes(ingredients.join(','), cuisine, time, diet, category);
            setRecipes(results.recipes || []);
            setIsFallback(results.isFallback || false);
        } catch (err) {
            setError('Failed to search recipes. Ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes(currentIngredients, selectedCuisine, maxTime, selectedDiet, selectedCategory);
    }, [currentIngredients, selectedCuisine, maxTime, selectedDiet, selectedCategory, fetchRecipes]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await getCategoriesData();
                // Handle different response formats (object vs array)
                const cList = Array.isArray(data) ? data : data.cuisines || [];
                const catList = (!Array.isArray(data) && data.categories) ? data.categories : [
                    { name: 'Breakfast', icon: '🍳' },
                    { name: 'Snacks', icon: '🥨' },
                    { name: 'Main Course', icon: '🍲' },
                    { name: 'Rice', icon: '🍚' },
                    { name: 'Desserts', icon: '🍰' },
                    { name: 'Drinks', icon: '🥤' }
                ];

                setCuisines(cList);
                setCategories(catList);
            } catch (err) {
                console.warn('Using fallback categories due to server error:', err);
                setCuisines(['American', 'British', 'Chinese', 'French', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Thai']);
                setCategories([
                    { name: 'Breakfast', icon: '🍳' },
                    { name: 'Snacks', icon: '🥨' },
                    { name: 'Main Course', icon: '🍲' },
                    { name: 'Rice', icon: '🍚' },
                    { name: 'Desserts', icon: '🍰' },
                    { name: 'Drinks', icon: '🥤' }
                ]);
            }
        };
        loadInitialData();
    }, []);

    const handleSearch = (ingredients: string[]) => {
        setCurrentIngredients(ingredients);
        setVisibleCount(12);
    };

    const timeOptions = [
        { label: 'Any time', value: '' },
        { label: '< 30 mins', value: '30' },
        { label: '< 45 mins', value: '45' },
        { label: '< 60 mins', value: '60' },
        { label: '< 90 mins', value: '90' },
    ];

    const visibleRecipes = recipes.slice(0, visibleCount);
    const hasMore = visibleCount < recipes.length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1
                    className="text-3xl sm:text-4xl font-bold mb-6"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    🔍 Search Recipes
                </h1>
                <div className="flex justify-center mb-8">
                    <SearchBar initialIngredients={currentIngredients} onSearch={handleSearch} />
                </div>

                {/* Categories Quick Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {Array.isArray(categories) && categories.map((cat) => (
                        <motion.button
                            key={cat.name}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
                            className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all shadow-sm ${selectedCategory === cat.name
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--card-border)] hover:border-[var(--primary)]'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            <span className="font-medium">{cat.name}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-[var(--card)] rounded-2xl border border-[var(--card-border)]"
            >
                {/* Cuisine filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">🌍 Cuisine:</span>
                    <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--card-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="all">All Cuisines</option>
                        {Array.isArray(cuisines) && cuisines.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Time filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">⏱️ Time:</span>
                    <select
                        value={maxTime}
                        onChange={(e) => setMaxTime(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--card-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    >
                        {timeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Diet filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">🥗 Diet:</span>
                    <select
                        value={selectedDiet}
                        onChange={(e) => setSelectedDiet(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--card-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="all">All Food</option>
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                    </select>
                </div>

                {/* Results count */}
                {!loading && (
                    <div className="ml-auto text-sm text-[var(--muted-foreground)]">
                        {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
                    </div>
                )}
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                >
                    <p className="text-red-500 text-lg">⚠️ {error}</p>
                </motion.div>
            )}

            {/* Fallback Message */}
            {isFallback && !loading && recipes.length > 0 && currentIngredients.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-6 bg-[var(--primary-light)] border border-[var(--primary)]/20 rounded-2xl text-center shadow-sm"
                >
                    <span className="text-3xl block mb-2">💡</span>
                    <h3 className="text-lg font-bold text-[var(--primary-dark)] mb-1">
                        We couldn't find exact matches for those ingredients!
                    </h3>
                    <p className="text-[var(--primary-dark)] opacity-80">
                        But don't worry, here are some amazing alternative recipes from various cuisines you might enjoy instead.
                    </p>
                </motion.div>
            )}

            {/* Results Grid */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {loading ? (
                    <SkeletonCard count={8} />
                ) : visibleRecipes.length > 0 ? (
                    visibleRecipes.map((recipe, i) => (
                        <RecipeCard key={recipe.externalId} recipe={recipe} index={i} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <span className="text-6xl block mb-4">🍽️</span>
                            <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
                            <p className="text-[var(--muted-foreground)]">
                                Try different ingredients or remove some filters
                            </p>
                        </motion.div>
                    </div>
                )}
            </motion.div>

            {/* Load More */}
            {hasMore && !loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-10"
                >
                    <motion.button
                        onClick={() => setVisibleCount((c) => c + 12)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-xl font-semibold transition-colors"
                    >
                        Load More Recipes
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="skeleton h-10 w-60 mx-auto mb-6" />
                    <div className="skeleton h-14 max-w-2xl mx-auto rounded-2xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <SkeletonCard count={8} />
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
