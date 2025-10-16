import { UsuarioController } from '../controllers/usuarioController.js';
import { usuarioErrorHandler } from '../middlewares/usuarioMiddleware.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import { authMockMiddleware } from '../middlewares/authMockMiddleware.js';
import express from 'express';

const pathUsuario = "/usuarios";
const pathNotificacion = "/usuarios/notificaciones";
/*
get usuarios/notificaciones?leida=true&page=2&limit=5
get usuarios/notificaciones?leida=false&page=2&limit=5
patch usuarios/notificaciones/1
*/

export default function usuarioRoutes(getController) {
    const router = express.Router();
    const controller = getController(UsuarioController);
    

    router.use(loggerMiddleware);

    // ? Para desarrollo
    router.use(authMockMiddleware);

    router.get(pathNotificacion, async (req, res) => {
        try {
            await controller.obtenerNotificaciones(req, res);
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