const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    recipeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    cookingTime: { type: String },
    calories: { type: Number },
    cuisine: { type: String },
    category: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
