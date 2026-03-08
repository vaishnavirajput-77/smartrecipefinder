'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import SkeletonCard from '@/components/SkeletonCard';
import { getFeaturedRecipes, Recipe } from '@/lib/api';

export default function HomePage() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const recipes = await getFeaturedRecipes();
        setFeaturedRecipes(recipes);
      } catch (err) {
        setError('Failed to load featured recipes. Make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const popularIngredients = [
    { name: 'Chicken', emoji: '🍗' },
    { name: 'Salmon', emoji: '🐟' },
    { name: 'Pasta', emoji: '🍝' },
    { name: 'Beef', emoji: '🥩' },
    { name: 'Rice', emoji: '🍚' },
    { name: 'Egg', emoji: '🥚' },
    { name: 'Potato', emoji: '🥔' },
    { name: 'Tomato', emoji: '🍅' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-pattern">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated meshes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--primary)] opacity-[0.1] blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--accent)] opacity-[0.1] blur-[100px]" />

          {/* Floating Emojis */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-[15%] text-7xl opacity-30 drop-shadow-2xl hidden lg:block"
          >
            🥘
          </motion.div>
          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -20, 20, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-60 left-[10%] text-6xl opacity-30 drop-shadow-2xl hidden lg:block"
          >
            🥗
          </motion.div>
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-40 right-[10%] text-6xl opacity-20 drop-shadow-2xl hidden lg:block"
          >
            🍰
          </motion.div>
          <motion.div
            animate={{ y: [0, 40, 0], rotate: [0, 45, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[20%] left-[20%] text-5xl opacity-20 drop-shadow-2xl hidden lg:block"
          >
            🍝
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--primary-light)] opacity-[0.05] blur-[120px]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <span className="inline-block px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-sm font-semibold mb-6">
                ✨ Smart Recipe Discovery
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Smart Recipe Finder
              <br />
              <span className="bg-gradient-to-r from-[var(--primary)] via-[#f97316] to-[var(--accent)] bg-clip-text text-transparent">
                From Ingredients You Have
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
              className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto"
            >
              Just type what&apos;s in your fridge, and we&apos;ll find the perfect recipes for you.
              No more food waste, just great meals!
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.6 }}
              className="mt-10 flex justify-center"
            >
              <SearchBar large />
            </motion.div>

            {/* Popular Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <p className="text-sm text-[var(--muted-foreground)] mb-3">Popular ingredients:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularIngredients.map((ing, i) => (
                  <motion.a
                    key={ing.name}
                    href={`/search?ingredients=${ing.name.toLowerCase()}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.8 + i * 0.08 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 bg-[var(--card)] border border-[var(--card-border)] rounded-full text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{ing.emoji}</span>
                    {ing.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            {/* Categories Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-16"
            >
              <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">
                Explore Categories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { name: 'Breakfast', icon: '🍳' },
                  { name: 'Snacks', icon: '🥨' },
                  { name: 'Main Course', icon: '🍲' },
                  { name: 'Rice', icon: '🍚' },
                  { name: 'Desserts', icon: '🍰' },
                  { name: 'Drinks', icon: '🥤' }
                ].map((cat, i) => (
                  <motion.a
                    key={cat.name}
                    href={`/search?ingredients=${cat.name.toLowerCase()}`}
                    whileHover={{ y: -10, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-3xl flex flex-col items-center gap-3 transition-colors hover:border-[var(--primary)] hover:shadow-xl group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                    <span className="font-bold text-sm whitespace-nowrap">{cat.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Recipes Available', value: '10,000+', icon: '📖' },
            { label: 'Cuisines', value: '25+', icon: '🌍' },
            { label: 'Ingredients', value: '500+', icon: '🥬' },
            { label: 'Happy Cooks', value: '50K+', icon: '👨‍🍳' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-[var(--card)] rounded-2xl border border-[var(--card-border)]"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[var(--primary)]">{stat.value}</div>
              <div className="text-sm text-[var(--muted-foreground)] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ✨ Featured Recipes
          </h2>
          <p className="text-[var(--muted-foreground)] mt-2">
            Hand-picked recipes to inspire your next meal
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-red-500 text-lg">⚠️ {error}</p>
            <p className="text-[var(--muted-foreground)] mt-2">
              Make sure the backend server is running on port 5000
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <SkeletonCard count={8} />
          ) : (
            featuredRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.externalId} recipe={recipe} index={i} />
            ))
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[var(--muted)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              How It Works
            </h2>
            <p className="text-[var(--muted-foreground)] mt-2">
              Three simple steps to your next great meal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Add Ingredients',
                desc: 'Type in the ingredients you have in your kitchen',
                icon: '🥕',
              },
              {
                step: '2',
                title: 'Find Recipes',
                desc: 'We search thousands of recipes that match your ingredients',
                icon: '🔍',
              },
              {
                step: '3',
                title: 'Start Cooking!',
                desc: 'Follow step-by-step instructions and enjoy your meal',
                icon: '👨‍🍳',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 mx-auto rounded-2xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center text-4xl shadow-lg mb-5"
                >
                  {item.icon}
                </motion.div>
                <div className="inline-block px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold mb-3">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-[var(--muted-foreground)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
