const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  externalId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  image: { type: String },
  ingredients: [{ type: String }],
  instructions: { type: String },
  cookingTime: { type: String, default: '30 mins' },
  calories: { type: Number, default: 0 },
  cuisine: { type: String, default: 'Various' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
