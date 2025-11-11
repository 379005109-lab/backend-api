const express = require('express');
const router = express.Router();
const {
  getAllFavorites,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite
} = require('../controllers/favoriteController');

router.route('/')
  .get(getAllFavorites)
  .post(addFavorite);

router.post('/toggle', toggleFavorite);

router.route('/user/:userId')
  .get(getUserFavorites);

router.route('/:id')
  .delete(removeFavorite);

module.exports = router;
