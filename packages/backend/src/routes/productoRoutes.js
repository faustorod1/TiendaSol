import {productoController} from '../controllers/productoController.js';
import { VendedorErrorHandler } from '../middlewares/vendedorMiddleware.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import express from 'express';

const pathProducto = "/productos";

export default function productoRoutes(getController) {
    const router = express.Router();
    const controller = getController(productoController);
    
    router.use(loggerMiddleware);

    router.get(pathProducto, async (req, res) => {
        try {
            await controller.buscarTodos(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.use(VendedorErrorHandler);

    return router;
}