const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Middleware to fetch food item by ID
async function getFood(req, res, next) {
    try {
      const food = await Food.findById(req.params.id);
      if (!food) {
        return res.status(404).json({ message: 'Food item not found' });
      }
      if (!food instanceof Food) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.locals.food = food;
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

// Create a new food item
router.post('/', async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific food item by ID
router.get('/:id', getFood, (req, res) => {
  res.json(res.locals.food); // Returns the fetched food item
});

// Update a food item
router.patch('/:id', getFood, async (req, res) => {
  if (req.body.name != null) {
    res.locals.food.name = req.body.name;
  }
  // Update other properties similarly
  
  try {
    const updatedFood = await res.locals.food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a food item
router.delete('/:id', getFood, async (req, res) => {
  try {
    await res.locals.food.remove();
    res.json({ message: 'Deleted food item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
