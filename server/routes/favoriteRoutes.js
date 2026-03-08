const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.post('/', favoriteController.addFavorite);
router.get('/', favoriteController.getFavorites);
router.delete('/:id', favoriteController.removeFavorite);
router.get('/check/:id', favoriteController.checkFavorite);

module.exports = router;
