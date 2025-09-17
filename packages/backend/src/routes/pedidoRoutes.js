import {pedidoController} from '../controllers/pedidoController.js';
import { PedidoErrorHandler } from '../middlewares/pedidoMiddleware.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import express from 'express';

const pathPedido = "/pedidos";

export default function pedidoRoutes(getController) {
    const router = express.Router();
    const controller = getController(pedidoController);
    
    router.use(loggerMiddleware);

    router.post(pathPedido, async (req, res) => {
        try {
            await controller.crearPedido(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });


    router.patch(`${pathPedido}/:id`, async (req, res) => {
        try {
            await controller.cambiarEstado(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    

    router.get(pathPedido, async (req, res) => {
        try {
            await controller.consultarHistorialPedidos(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.use(PedidoErrorHandler);
    return router;
}