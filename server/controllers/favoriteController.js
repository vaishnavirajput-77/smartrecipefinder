const Favorite = require('../models/Favorite');

// POST /api/favorites
exports.addFavorite = async (req, res) => {
    try {
        const { recipeId, name, image, cookingTime, calories, cuisine, category } = req.body;

        // Check if already favorited
        const existing = await Favorite.findOne({ recipeId });
        if (existing) {
            return res.status(400).json({ error: 'Recipe already in favorites' });
        }

        const favorite = new Favorite({
            recipeId,
            name,
            image,
            cookingTime,
            calories,
            cuisine,
            category,
        });

        await favorite.save();
        res.status(201).json({ favorite });
    } catch (error) {
        console.error('Add favorite error:', error.message);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
};

// GET /api/favorites
exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find().sort({ createdAt: -1 });
        res.json({ favorites });
    } catch (error) {
        console.error('Get favorites error:', error.message);
        res.status(500).json({ error: 'Failed to get favorites' });
    }
};

// DELETE /api/favorites/:id
exports.removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const favorite = await Favorite.findOneAndDelete({ recipeId: id });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error.message);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
};

// GET /api/favorites/check/:id
exports.checkFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const favorite = await Favorite.findOne({ recipeId: id });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Check favorite error:', error.message);
        res.status(500).json({ error: 'Failed to check favorite status' });
    }
};
