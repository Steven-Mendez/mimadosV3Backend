import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/MongoDb.js';
import ImportData from './DataImport.js';
import productRoute from './Routes/ProductRoutes.js';
import { errorHandler, notFound } from './Middleware/Errors.js';
import userRouter from './Routes/UserRoutes.js';
import orderRouter from './Routes/orderRoutes.js';
import categoryRouter from './Routes/CategoryRouter.js';
import supplierRouter from './Routes/SupplierRouter.js';
import purchaseRouter from './Routes/PurchaseRoutes.js';
import saleRouter from './Routes/SaleRoutes.js';

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

// API
app.use('/api/import', ImportData);
app.use('/api/products', productRoute);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/purchases', purchaseRouter);
app.use('/api/sales', saleRouter);

// PAYPAL
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
