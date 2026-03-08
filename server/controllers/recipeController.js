const axios = require('axios');

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Helper: Determine if a recipe is vegetarian
function isVeg(meal, ingredients) {
    const vegCategories = ['Vegetarian', 'Vegan'];
    const nonVegCategories = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Seafood'];
    const category = meal.strCategory || '';

    if (vegCategories.includes(category)) return true;
    if (nonVegCategories.includes(category)) return false;

    const nonVegKeywords = ['chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'prawn', 'meat', 'bacon', 'sausage', 'prosciutto', 'anchov', 'egg'];
    const name = (meal.strMeal || '').toLowerCase();
    const ingredientsString = ingredients.join(' ').toLowerCase();

    for (const kw of nonVegKeywords) {
        if (name.includes(kw) || ingredientsString.includes(kw)) return false;
    }
    return true;
}

// Helper: Parse a MealDB meal object into our recipe format
function parseMeal(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
        }
    }

    // Generate pseudo cooking time and calories based on ingredient count
    const cookingMinutes = 15 + ingredients.length * 5;
    const calories = 150 + ingredients.length * 35;

    // Generate pseudo difficulty and rating
    let difficulty = 'Easy';
    if (ingredients.length > 12) difficulty = 'Hard';
    else if (ingredients.length > 7) difficulty = 'Medium';

    const rating = (4.0 + Math.random() * 1.0).toFixed(1);

    const type = isVeg(meal, ingredients) ? 'Veg' : 'Non-Veg';

    return {
        externalId: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        ingredients,
        instructions: meal.strInstructions,
        cookingTime: `${cookingMinutes} mins`,
        calories,
        cuisine: meal.strArea || 'Various',
        category: meal.strCategory || 'General',
        type,
        difficulty,
        rating,
        videoLink: meal.strYoutube || '',
        tags: meal.strTags ? meal.strTags.split(',').map(t => t.trim()) : [],
    };
}

// GET /api/recipes?ingredients=chicken,rice&cuisine=Italian&maxTime=60&diet=veg
exports.searchRecipes = async (req, res) => {
    try {
        const { ingredients, cuisine, maxTime, diet, category } = req.query;

        if (!ingredients) {
            // PULL DIVERSE RECIPES INCLUDING ALL TYPES
            const categories = ['Chicken', 'Beef', 'Seafood', 'Vegetarian', 'Pasta', 'Dessert'];
            const allMeals = [];

            for (const cat of categories) {
                try {
                    const resp = await axios.get(`${MEALDB_BASE}/filter.php?c=${cat}`);
                    if (resp.data.meals) {
                        allMeals.push(...resp.data.meals.slice(0, 5));
                    }
                } catch (e) {
                    // skip
                }
            }

            // Shuffle array to get random veg meals
            const shuffledMeals = allMeals.sort(() => 0.5 - Math.random());

            // Get full details for each meal
            const detailed = await Promise.all(
                shuffledMeals.slice(0, 18).map(async (m) => {
                    try {
                        const resp = await axios.get(`${MEALDB_BASE}/lookup.php?i=${m.idMeal}`);
                        return resp.data.meals ? parseMeal(resp.data.meals[0]) : null;
                    } catch {
                        return null;
                    }
                })
            );

            return res.json({ recipes: detailed.filter(Boolean) });
        }

        // Search by main ingredient
        const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());
        const mainIngredient = ingredientList[0];

        let rawMeals = [];

        // 1. Search by ingredient
        try {
            const res1 = await axios.get(`${MEALDB_BASE}/filter.php?i=${mainIngredient}`);
            if (res1.data.meals) rawMeals.push(...res1.data.meals);
        } catch (e) { }

        // 2. Search by category
        try {
            const res2 = await axios.get(`${MEALDB_BASE}/filter.php?c=${mainIngredient}`);
            if (res2.data.meals) rawMeals.push(...res2.data.meals);
        } catch (e) { }

        // 3. Search by name
        try {
            const res3 = await axios.get(`${MEALDB_BASE}/search.php?s=${mainIngredient}`);
            if (res3.data.meals) rawMeals.push(...res3.data.meals);
        } catch (e) { }

        // Allow it to trickle down to the fallback natively instead of exiting
        // if (rawMeals.length === 0) {
        //     return res.json({ recipes: [] });
        // }

        // Remove duplicates
        const mealsMap = new Map();
        rawMeals.forEach(m => mealsMap.set(m.idMeal, m));
        const uniqueMeals = Array.from(mealsMap.values());

        // Get full details for each meal
        let detailed = await Promise.all(
            uniqueMeals.slice(0, 30).map(async (m) => {
                try {
                    const resp = await axios.get(`${MEALDB_BASE}/lookup.php?i=${m.idMeal}`);
                    return resp.data.meals ? parseMeal(resp.data.meals[0]) : null;
                } catch {
                    return null;
                }
            })
        );

        detailed = detailed.filter(Boolean);

        // Removed strict vegetarian enforcement - allowing all recipe types now

        // Filter by additional ingredients if provided
        if (ingredientList.length > 1) {
            const otherIngredients = ingredientList.slice(1);
            detailed = detailed.filter(recipe => {
                const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
                return otherIngredients.some(ing =>
                    recipeIngredients.some(ri => ri.includes(ing))
                );
            });
        }

        // Filter by cuisine
        if (cuisine && cuisine !== 'all') {
            detailed = detailed.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
        }

        // Filter by category
        if (category && category !== 'all') {
            detailed = detailed.filter(r => r.category.toLowerCase() === category.toLowerCase());
        }

        // Filter by diet
        if (diet && diet !== 'all') {
            const target = diet === 'veg' ? 'Veg' : 'Non-Veg';
            detailed = detailed.filter(r => r.type === target);
        }

        // Filter by max cooking time
        if (maxTime) {
            detailed = detailed.filter(r => {
                const mins = parseInt(r.cookingTime);
                return mins <= parseInt(maxTime);
            });
        }

        if (detailed.length === 0) {
            // FALLBACK TO ALL DIVERSE TYPES
            const categories = ['Chicken', 'Beef', 'Seafood', 'Vegetarian', 'Pasta'];
            const allMeals = [];
            for (const cat of categories) {
                try {
                    const resp = await axios.get(`${MEALDB_BASE}/filter.php?c=${cat}`);
                    if (resp.data.meals) {
                        allMeals.push(...resp.data.meals.slice(0, 10));
                    }
                } catch (e) { }
            }

            const shuffledMeals = allMeals.sort(() => 0.5 - Math.random());

            let fallbackDetailed = await Promise.all(
                shuffledMeals.slice(0, 16).map(async (m) => {
                    try {
                        const resp = await axios.get(`${MEALDB_BASE}/lookup.php?i=${m.idMeal}`);
                        return resp.data.meals ? parseMeal(resp.data.meals[0]) : null;
                    } catch {
                        return null;
                    }
                })
            );

            fallbackDetailed = fallbackDetailed.filter(Boolean);

            return res.json({ recipes: fallbackDetailed, isFallback: true });
        }

        res.json({ recipes: detailed, isFallback: false });
    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ error: 'Failed to search recipes' });
    }
};

// GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${MEALDB_BASE}/lookup.php?i=${id}`);

        if (!response.data.meals || response.data.meals.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const recipe = parseMeal(response.data.meals[0]);
        res.json({ recipe });
    } catch (error) {
        console.error('Get recipe error:', error.message);
        res.status(500).json({ error: 'Failed to get recipe' });
    }
};

// GET /api/recipes/featured - Get featured/random recipes
exports.getFeaturedRecipes = async (req, res) => {
    try {
        const categories = ['Chicken', 'Beef', 'Seafood', 'Vegetarian', 'Pasta', 'Dessert'];
        const allMeals = [];

        for (const cat of categories) {
            try {
                const resp = await axios.get(`${MEALDB_BASE}/filter.php?c=${cat}`);
                if (resp.data.meals) {
                    allMeals.push(...resp.data.meals.slice(0, 5));
                }
            } catch (e) {
                // skip
            }
        }

        // Shuffle
        const shuffledMeals = allMeals.sort(() => 0.5 - Math.random());

        // Get full details for front-page random 8
        const detailed = await Promise.all(
            shuffledMeals.slice(0, 8).map(async (m) => {
                try {
                    const resp = await axios.get(`${MEALDB_BASE}/lookup.php?i=${m.idMeal}`);
                    return resp.data.meals ? parseMeal(resp.data.meals[0]) : null;
                } catch {
                    return null;
                }
            })
        );

        // Remove duplicates by externalId
        const validMeals = detailed.filter(Boolean);
        const unique = [...new Map(validMeals.map(m => [m.externalId, m])).values()];
        res.json({ recipes: unique });
    } catch (error) {
        console.error('Featured error:', error.message);
        res.status(500).json({ error: 'Failed to get featured recipes' });
    }
};

// GET /api/recipes/categories - Get available categories
exports.getCategories = async (req, res) => {
    try {
        // We provide a mix of requested categories and available ones
        const response = await axios.get(`${MEALDB_BASE}/list.php?a=list`);
        const cuisines = response.data.meals ? response.data.meals.map(m => m.strArea) : [];

        const categories = [
            { name: 'Breakfast', icon: '🍳' },
            { name: 'Snacks', icon: '🥨' },
            { name: 'Main Course', icon: '🍲' },
            { name: 'Rice', icon: '🍚' },
            { name: 'Desserts', icon: '🍰' },
            { name: 'Drinks', icon: '🥤' }
        ];

        res.json({ cuisines, categories });
    } catch (error) {
        console.error('Categories error:', error.message);
        res.status(500).json({ error: 'Failed to get categories' });
    }
};
