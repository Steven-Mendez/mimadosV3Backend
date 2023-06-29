import express from 'express';
import asyncHandler from 'express-async-handler';
import { admin, protect } from '../Middleware/AuthMiddleware.js';
import { Category } from './../Models/CategoryModel.js';

const categoryRouter = express.Router();

// GET ALL CATEGORIES
categoryRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
  })
);

// GET CATEGORY BY ID
categoryRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  })
);

// CREATE A NEW CATEGORY
categoryRouter.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      res.status(400);
      throw new Error('The category already exists');
    }

    const category = new Category({
      name,
      description,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  })
);

// UPDATE A CATEGORY
categoryRouter.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  })
);

// DELETE A CATEGORY
categoryRouter.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.remove();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  })
);

export default categoryRouter;
