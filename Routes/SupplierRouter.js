import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../Middleware/AuthMiddleware.js';
import Supplier from './../Models/SupplierModel.js';

const supplierRouter = express.Router();

// Get all suppliers
supplierRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  })
);

// Get a supplier by ID
supplierRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  })
);

// Create a new supplier
supplierRouter.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, address, contactPerson, email, phone } = req.body;
    const supplier = new Supplier({
      name,
      address,
      contactPerson,
      email,
      phone,
    });

    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  })
);

// Update a supplier
supplierRouter.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, address, contactPerson, email, phone } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
      supplier.name = name || supplier.name;
      supplier.address = address || supplier.address;
      supplier.contactPerson = contactPerson || supplier.contactPerson;
      supplier.email = email || supplier.email;
      supplier.phone = phone || supplier.phone;

      const updatedSupplier = await supplier.save();
      res.json(updatedSupplier);
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  })
);

// Delete a supplier
supplierRouter.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      await supplier.remove();
      res.json({ message: 'Supplier deleted' });
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  })
);

export default supplierRouter;
