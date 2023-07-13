import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../Middleware/AuthMiddleware.js';
import Sale from './../Models/SaleModel.js';
import Product from './../Models/ProductModel.js';

const saleRouter = express.Router();

// Get all sales
saleRouter.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const sales = await Sale.find({})
      .populate('products.product', 'id name') // Poblar el campo 'products.product'
      .exec();

    res.json(
      sales.map((sale) => ({
        ...sale.toObject(),
        customerName: sale.customerName,
      }))
    );
  })
);

// Create a new sale
saleRouter.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { customerName, products, totalAmount } = req.body;

    const sale = new Sale({
      customerName,
      products,
      totalAmount,
    });

    const createdSale = await sale.save();

    // Update the stock of each product
    createdSale.products.forEach(async (product) => {
      const productToUpdate = await Product.findById(product.product);
      productToUpdate.countInStock -= product.quantity;
      await productToUpdate.save();
    });

    res.status(201).json(createdSale);
  })
);

// Get a sale by ID
saleRouter.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id)
      .populate('products.product', 'id name') // Poblar el campo 'products.product'
      .exec();

    if (sale) {
      res.json(sale);
    } else {
      res.status(404);
      throw new Error('Venta no encontrada'); // Sale not found
    }
  })
);

// Update a sale
saleRouter.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { products, totalAmount } = req.body;
    const sale = await Sale.findById(req.params.id);

    if (sale) {
      sale.products = products || sale.products;
      sale.totalAmount = totalAmount || sale.totalAmount;

      const updatedSale = await sale.save();
      res.json(updatedSale);
    } else {
      res.status(404);
      throw new Error('Venta no encontrada'); // Sale not found
    }
  })
);

// Delete a sale
saleRouter.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id);
    if (sale) {
      await sale.remove();
      res.json({ message: 'Venta eliminada' }); // Sale deleted
    } else {
      res.status(404);
      throw new Error('Venta no encontrada'); // Sale not found
    }
  })
);

export default saleRouter;
