import {usuarioController} from '../controllers/usuarioController.js';
import { usuarioErrorHandler } from '../middlewares/usuarioErrorHandler.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import express from 'express';

const pathUsuario = "/usuarios";
const pathNotificacion = "/usuarios/:usuarioId/notificaciones";
/*
get usuarios/1/notificaciones?leida=true&page=2&limit=5
get usuarios/1/notificaciones?leida=false&page=2&limit=5
patch usuarios/1/notificaciones/1
*/

export default function usuarioRoutes(getController) {
    const router = express.Router();
    const controller = getController(usuarioController);

    router.use(loggerMiddleware);

    router.get(pathNotificacion, async (req, res) => {
        try {
            await controller.obtenerNotificacionesDeUsuario(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.patch(`${pathNotificacion}/:id`, async (req, res) => {
        try {
            await controller.marcarComoLeida(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.use(usuarioErrorHandler);

    return router;
}