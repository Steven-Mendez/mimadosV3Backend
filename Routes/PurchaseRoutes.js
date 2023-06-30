import express from 'express';
import asyncHandler from 'express-async-handler';
import Purchase from '../Models/PurchaseModel.js';
import { protect, admin } from '../Middleware/AuthMiddleware.js';

const purchaseRouter = express.Router();

// Get all purchases
purchaseRouter.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const purchases = await Purchase.find({})
      .populate('supplier', 'name') // Populate supplier information
      .populate('products.product', 'name'); // Populate product information
    res.json(purchases);
  })
);

// Create a new purchase
purchaseRouter.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { supplier, products, totalAmount } = req.body;

    const purchase = new Purchase({
      supplier,
      products,
      totalAmount,
    });

    const createdPurchase = await purchase.save();
    res.status(201).json(createdPurchase);
  })
);

// Get a purchase by its ID
purchaseRouter.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const purchase = await Purchase.findById(req.params.id)
      .populate('supplier', 'name') // Populate supplier information
      .populate('products.product', 'name'); // Populate product information

    if (purchase) {
      res.json(purchase);
    } else {
      res.status(404);
      throw new Error('Compra no encontrada');
    }
  })
);

// Update a purchase
purchaseRouter.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { supplier, products, totalAmount } = req.body;
    const purchase = await Purchase.findById(req.params.id);

    if (purchase) {
      purchase.supplier = supplier || purchase.supplier;
      purchase.products = products || purchase.products;
      purchase.totalAmount = totalAmount || purchase.totalAmount;

      const updatedPurchase = await purchase.save();
      res.json(updatedPurchase);
    } else {
      res.status(404);
      throw new Error('Compra no encontrada');
    }
  })
);

// Delete a purchase
purchaseRouter.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const purchase = await Purchase.findById(req.params.id);
    if (purchase) {
      await purchase.remove();
      res.json({ message: 'Compra eliminada' });
    } else {
      res.status(404);
      throw new Error('Compra no encontrada');
    }
  })
);

export default purchaseRouter;
