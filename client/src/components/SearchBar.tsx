'use client';

import { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface SearchBarProps {
    large?: boolean;
    initialIngredients?: string[];
    onSearch?: (ingredients: string[]) => void;
}

export default function SearchBar({ large = false, initialIngredients = [], onSearch }: SearchBarProps) {
    const [input, setInput] = useState('');
    const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [allIngredients, setAllIngredients] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAllIngredients = async () => {
            try {
                const { data } = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
                if (data.meals) {
                    setAllIngredients(data.meals.map((m: any) => m.strIngredient));
                }
            } catch (e) {
                console.error('Failed to fetch ingredients for suggestions');
            }
        };
        fetchAllIngredients();
    }, []);

    useEffect(() => {
        if (input.trim().length > 1) {
            const filtered = allIngredients
                .filter(i => i.toLowerCase().startsWith(input.toLowerCase()) && !ingredients.includes(i.toLowerCase()))
                .slice(0, 6);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        setSelectedIndex(-1);
    }, [input, allIngredients, ingredients]);

    const addIngredient = (ing?: string) => {
        const value = ing || input.trim().toLowerCase();
        if (value && !ingredients.includes(value)) {
            const next = [...ingredients, value.toLowerCase()];
            setIngredients(next);
            setInput('');
            setShowSuggestions(false);
        }
    };

    const removeIngredient = (ingredient: string) => {
        setIngredients(ingredients.filter((i) => i !== ingredient));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                addIngredient(suggestions[selectedIndex]);
            } else if (input.trim()) {
                addIngredient();
            } else if (ingredients.length > 0) {
                handleSearch();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }

        if (e.key === 'Backspace' && !input && ingredients.length > 0) {
            removeIngredient(ingredients[ingredients.length - 1]);
        }
    };

    const handleSearch = () => {
        if (ingredients.length === 0 && !input.trim()) return;

        const finalIngredients = input.trim()
            ? [...ingredients, input.trim().toLowerCase()]
            : ingredients;

        if (onSearch) {
            onSearch(finalIngredients);
        } else {
            router.push(`/search?ingredients=${finalIngredients.join(',')}`);
        }
    };

    return (
        <div className={`w-full relative ${large ? 'max-w-2xl' : 'max-w-xl'}`}>
            <div
                className={`flex items-center gap-2 bg-[var(--card)] border-2 border-[var(--card-border)] rounded-2xl transition-all duration-300 focus-within:border-[var(--primary)] focus-within:shadow-[0_8px_30px_rgba(249,115,22,0.15)] ${large ? 'p-3 pl-5' : 'p-2 pl-4'
                    }`}
            >
                <span className="text-xl shrink-0">🔍</span>
                <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
                    <AnimatePresence mode="popLayout">
                        {ingredients.map((ingredient) => (
                            <motion.span
                                key={ingredient}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                layout
                                className="ingredient-tag"
                            >
                                {ingredient}
                                <button
                                    onClick={() => removeIngredient(ingredient)}
                                    className="hover:text-red-500 transition-colors ml-1 font-bold"
                                >
                                    ×
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => input.trim().length > 1 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={
                            ingredients.length === 0
                                ? 'Type an ingredient (e.g., chicken, rice...)'
                                : 'Add another ingredient...'
                        }
                        className={`flex-1 min-w-[150px] bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] ${large ? 'text-lg' : 'text-base'
                            }`}
                    />
                </div>
                <motion.button
                    onClick={handleSearch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`shrink-0 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold rounded-xl transition-colors ${large ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
                        }`}
                >
                    Search Recipes
                </motion.button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl shadow-2xl z-[100] overflow-hidden"
                    >
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={suggestion}
                                onClick={() => addIngredient(suggestion)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`px-5 py-3 cursor-pointer flex items-center justify-between transition-colors ${index === selectedIndex ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'hover:bg-[var(--muted)]'
                                    }`}
                            >
                                <span className="font-medium text-sm sm:text-base">{suggestion}</span>
                                <span className="text-xs text-[var(--muted-foreground)]">Click to add</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {ingredients.length === 0 && !showSuggestions && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[var(--muted-foreground)] text-sm mt-3 text-center"
                >
                    💡 Try: chicken, tomato, garlic, basil
                </motion.p>
            )}
        </div>
    );
}
