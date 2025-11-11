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

    router.get(pathNotificacion, async (req, res, next) => {
        try {
            await controller.obtenerNotificaciones(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.patch(`${pathNotificacion}/:id`, async (req, res, next) => {
        try {
            await controller.marcarNotificacionComoLeida(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.post(`${pathUsuario}/register`, async (req, res, next) => {
        try {
            await controller.registrar(req, res);
        } catch (error) {
            next(error);
        }
    })
    
    return router;
}