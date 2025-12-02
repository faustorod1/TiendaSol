import { PedidoController } from '../controllers/pedidoController.js';
import { pedidoErrorHandler } from '../middlewares/pedidoMiddleware.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

const pathPedido = "/pedidos";

export default function pedidoRoutes(getController) {
    const router = express.Router();
    const controller = getController(PedidoController);
    
    router.use(loggerMiddleware);

    router.post(pathPedido, authMiddleware, async (req, res, next) => {
        try {
            await controller.crearPedido(req, res);
        } catch (error) {
            next(error);
        }
    });


    router.get(`${pathPedido}/:id`, authMiddleware, async (req, res, next) => {
        try {
            await controller.obtenerPedidoPorId(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.patch(`${pathPedido}/:id`, authMiddleware, async (req, res, next) => {
        try {
            await controller.cambiarEstado(req, res);
        } catch (error) {
            next(error);
        }
    });
    

    router.get(pathPedido, authMiddleware, async (req, res, next) => {
        try {
            await controller.consultarHistorialPedidos(req, res);
        } catch (error) {
            next(error);
        }
    });
    
    return router;
}