import { UsuarioController } from '../controllers/usuarioController.js';
import { usuarioErrorHandler } from '../middlewares/usuarioMiddleware.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

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

    router.get(pathNotificacion, authMiddleware, async (req, res, next) => {
        try {
            await controller.obtenerNotificaciones(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.get(`${pathNotificacion}/:id`, authMiddleware, async (req, res, next) => {
        try {
            await controller.obtenerNotificacion(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.patch(`${pathNotificacion}/mark-all-read`, authMiddleware, async (req, res, next) => {
        try {
            await controller.marcarTodasLasNotificacionesComoLeida(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.patch(`${pathNotificacion}/:id`, authMiddleware, async (req, res, next) => {
        try {
            await controller.marcarNotificacionComoLeida(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.delete(`${pathNotificacion}/:id`, authMiddleware, async (req, res, next) => {
        try {
            await controller.eliminarNotificacion(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.post(`${pathUsuario}/login`, async (req, res, next) => {
        try {
            await controller.login(req, res);
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
    });

    router.get(`${pathUsuario}/:id`, async (req, res, next) => {
        try {
            await controller.buscarPorId(req, res);
        } catch (error) {
            next(error);
        }
    });
    
    return router;
}