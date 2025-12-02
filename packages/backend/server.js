import express from "express";
import { errorHandler } from "./errorHandler.js";
import { pedidoErrorHandler } from "./src/middlewares/pedidoMiddleware.js";
import { productoErrorHandler } from "./src/middlewares/productoMiddleware.js";
import { usuarioErrorHandler } from "./src/middlewares/usuarioMiddleware.js";
import { vendedorErrorHandler } from "./src/middlewares/vendedorMiddleware.js";

export class Server {
  #controllers = {}
  #app
  #routes
  
  constructor(app, port) {
    this.#app = app
    this.port = port
    this.#routes = []
    this.#app.use(express.json()) 
  }

  get app() {
    return this.#app
  }

  setController(controllerClass, controller) {
    this.#controllers[controllerClass.name] = controller
  }

  getController(controllerClass) {
    const controller = this.#controllers[controllerClass.name]
    if (!controller) {
      throw new Error("Controller missing for the given route.")
    }
    return controller;
  }

  addRoute(route) {
    this.#routes.push(route)
  }


  configureRoutes() {
    this.#routes.forEach(route => this.#app.use(route(this.getController.bind(this)))) 

    // Middleware para manejar rutas no encontradas
    this.#app.use((_req, res) => {
      res.status(404).json({
        status: 'fail',
        message: "La ruta solicitada no existe"
      });
    });

    this.#app.use(pedidoErrorHandler);
    this.#app.use(productoErrorHandler);
    this.#app.use(usuarioErrorHandler);
    this.#app.use(vendedorErrorHandler);

    // Middleware global de manejo de errores
    this.#app.use(errorHandler);
  }

  launch() {
    this.app.listen(this.port, () => {
      console.log(`Backend escuchando en puerto ${this.port}`);
    });
  }
}