import { CategoriaController } from '../controllers/categoriaController.js';
import express from 'express';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';

const pathCategoria = "/categorias";

export default function categoriaRoutes(getController) {
    const router = express.Router();
    const controller = getController(CategoriaController);

    router.use(loggerMiddleware);

    router.get(pathCategoria, async (req, res, next) => {
        try {
            await controller.buscarTodos(req, res);
        } catch (error) {
            next(error);
        }
    });

    return router;
}