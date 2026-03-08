import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
});

export interface Recipe {
    externalId: string;
    name: string;
    image: string;
    ingredients: string[];
    instructions: string;
    cookingTime: string;
    calories: number;
    cuisine: string;
    category: string;
    type: 'Veg' | 'Non-Veg';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    rating: string;
    videoLink: string;
    tags: string[];
}

export interface Category {
    name: string;
    icon: string;
}

export interface Favorite {
    _id: string;
    recipeId: string;
    name: string;
    image: string;
    cookingTime: string;
    calories: number;
    cuisine: string;
    category: string;
    createdAt: string;
}

// Recipe APIs
export const searchRecipes = async (ingredients: string, cuisine?: string, maxTime?: string, diet?: string, category?: string) => {
    const params: Record<string, string> = {};
    if (ingredients) params.ingredients = ingredients;
    if (cuisine && cuisine !== 'all') params.cuisine = cuisine;
    if (maxTime) params.maxTime = maxTime;
    if (diet && diet !== 'all') params.diet = diet;
    if (category && category !== 'all') params.category = category;
    const { data } = await api.get('/recipes/search', { params });
    return data as { recipes: Recipe[], isFallback: boolean };
};

export const getRecipeById = async (id: string) => {
    const { data } = await api.get(`/recipes/${id}`);
    return data.recipe as Recipe;
};

export const getFeaturedRecipes = async () => {
    const { data } = await api.get('/recipes/featured');
    return data.recipes as Recipe[];
};

export const getCategoriesData = async () => {
    const { data } = await api.get('/recipes/categories');
    return data as { cuisines: string[], categories: Category[] };
};

// Favorite APIs (with Local Storage Fallback)
const LOCAL_FAVORITES_KEY = 'smart_recipe_favorites';

const getLocalFavorites = (): Favorite[] => {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveLocalFavorites = (favorites: Favorite[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
};

export const addFavorite = async (recipe: Partial<Recipe>) => {
    try {
        const { data } = await api.post('/favorites', {
            recipeId: recipe.externalId,
            name: recipe.name,
            image: recipe.image,
            cookingTime: recipe.cookingTime,
            calories: recipe.calories,
            cuisine: recipe.cuisine,
            category: recipe.category,
        });
        return data.favorite as Favorite;
    } catch (err) {
        console.warn('Backend favorites failed, using local storage.');
        // Fallback to local storage
        const current = getLocalFavorites();
        if (current.some(f => f.recipeId === recipe.externalId)) return current.find(f => f.recipeId === recipe.externalId);

        const newFav: Favorite = {
            _id: `local-${Date.now()}`,
            recipeId: recipe.externalId || '',
            name: recipe.name || '',
            image: recipe.image || '',
            cookingTime: recipe.cookingTime || '',
            calories: recipe.calories || 0,
            cuisine: recipe.cuisine || '',
            category: recipe.category || '',
            createdAt: new Date().toISOString()
        };
        const updated = [newFav, ...current];
        saveLocalFavorites(updated);
        return newFav;
    }
};

export const getFavorites = async () => {
    try {
        const { data } = await api.get('/favorites');
        return data.favorites as Favorite[];
    } catch (err) {
        console.warn('Loading favorites from local storage (Backend unreachable).');
        return getLocalFavorites();
    }
};

export const removeFavorite = async (recipeId: string) => {
    try {
        await api.delete(`/favorites/${recipeId}`);
        // Also remove from local just in case they were synced
        const current = getLocalFavorites();
        saveLocalFavorites(current.filter(f => f.recipeId !== recipeId));
    } catch (err) {
        console.warn('Removing favorite from local storage (Backend unreachable).');
        const current = getLocalFavorites();
        saveLocalFavorites(current.filter(f => f.recipeId !== recipeId));
    }
};

export const checkFavorite = async (recipeId: string) => {
    try {
        const { data } = await api.get(`/favorites/check/${recipeId}`);
        return data.isFavorite as boolean;
    } catch (err) {
        const current = getLocalFavorites();
        return current.some(f => f.recipeId === recipeId);
    }
};
