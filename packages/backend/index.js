import "dotenv/config";

import express from "express";
import cors from "cors";

import routes from './src/routes/routes.js';

import { Server } from "./server.js";
import { MongoDBClient } from "./src/config/database.js";

import { PedidoRepository } from './src/models/repositories/pedidoRepository.js';
import { ProductoRepository } from './src/models/repositories/productoRepository.js';
import { UsuarioRepository } from './src/models/repositories/usuarioRepository.js';
import { CategoriaRepository } from "./src/models/repositories/categoriaRepository.js";
import { NotificacionRepository } from "./src/models/repositories/notificacionRepository.js";

import { PedidoService } from './src/services/pedidoService.js';
import { ProductoService } from './src/services/productoService.js';
import { UsuarioService } from './src/services/usuarioService.js';
import { CategoriaService } from "./src/services/categoriaService.js";

import { PedidoController } from './src/controllers/pedidoController.js';
import { ProductoController } from './src/controllers/productoController.js';
import { UsuarioController } from './src/controllers/usuarioController.js';
import { CategoriaController } from "./src/controllers/categoriaController.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/health", (_req, res) => {
    res.send("ok");
});


const port = process.env.SERVER_PORT || 3000;
const server = new Server(app, port);

const notificacionRepository = new NotificacionRepository();
const usuarioRepository = new UsuarioRepository(notificacionRepository);
const productoRepository = new ProductoRepository();
const pedidoRepository = new PedidoRepository();
const categoriaRepository = new CategoriaRepository();

const usuarioService = new UsuarioService(usuarioRepository, notificacionRepository);
const productoService = new ProductoService(productoRepository, usuarioRepository);
const pedidoService = new PedidoService(pedidoRepository, productoRepository, usuarioRepository);
const categoriaService = new CategoriaService(categoriaRepository);

const usuarioController = new UsuarioController(usuarioService);
const productoController = new ProductoController(productoService);
const pedidoController = new PedidoController(pedidoService);
const categoriaController = new CategoriaController(categoriaService);

server.setController(UsuarioController, usuarioController);
server.setController(ProductoController, productoController);
server.setController(PedidoController, pedidoController);
server.setController(CategoriaController, categoriaController);

routes.forEach(route => server.addRoute(route));
server.configureRoutes();

export const initializedApp = app;

const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

if (!isTest) {
    MongoDBClient.connect();
    server.launch();
}

/*
import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from './src/routes/routes.js';
import { Server } from "./server.js";
import { MongoDBClient } from "./src/config/database.js";

// Importamos path y fileURLToPath para usar un if/else para la inicialización
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --- FUNCIÓN DE CONFIGURACIÓN PRINCIPAL ---
// Esta función configura Express, inyecta dependencias y rutas, pero NO lanza el servidor.
export function configureApp() {
    const app = express();
    app.use(express.json());

    app.use(
        cors({
            origin: process.env.ALLOWED_ORIGINS
                ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
                : true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }),
    );

    app.get("/health", (_req, res) => {
        res.send("ok");
    });

    const port = process.env.SERVER_PORT || 3000;
    const server = new Server(app, port);

    // Repositories
    const { PedidoRepository } = await import('./src/models/repositories/pedidoRepository.js');
    const { ProductoRepository } = await import('./src/models/repositories/productoRepository.js');
    const { UsuarioRepository } = await import('./src/models/repositories/usuarioRepository.js');
    const { CategoriaRepository } = await import('./src/models/repositories/categoriaRepository.js');
    const { NotificacionRepository } = await import('./src/models/repositories/notificacionRepository.js');

    const notificacionRepository = new NotificacionRepository();
    const usuarioRepository = new UsuarioRepository(notificacionRepository);
    const productoRepository = new ProductoRepository();
    const pedidoRepository = new PedidoRepository();
    const categoriaRepository = new CategoriaRepository();

    // Services
    const { PedidoService } = await import('./src/services/pedidoService.js');
    const { ProductoService } = await import('./src/services/productoService.js');
    const { UsuarioService } = await import('./src/services/usuarioService.js');
    const { CategoriaService } = await import('./src/services/categoriaService.js');

    const usuarioService = new UsuarioService(usuarioRepository, notificacionRepository);
    const productoService = new ProductoService(productoRepository, usuarioRepository);
    const pedidoService = new PedidoService(pedidoRepository, productoRepository, usuarioRepository);
    const categoriaService = new CategoriaService(categoriaRepository);

    // Controllers
    const { PedidoController } = await import('./src/controllers/pedidoController.js');
    const { ProductoController } = await import('./src/controllers/productoController.js');
    const { UsuarioController } = await import('./src/controllers/usuarioController.js');
    const { CategoriaController } = await import('./src/controllers/categoriaController.js');

    const usuarioController = new UsuarioController(usuarioService);
    const productoController = new ProductoController(productoService);
    const pedidoController = new PedidoController(pedidoService);
    const categoriaController = new CategoriaController(categoriaService);

    server.setController(UsuarioController, usuarioController);
    server.setController(ProductoController, productoController);
    server.setController(PedidoController, pedidoController);
    server.setController(CategoriaController, categoriaController);

    routes.forEach(route => server.addRoute(route));
    server.configureRoutes();
    
    // Devolvemos el objeto Server y la app Express configurada
    return { app, server, MongoDBClient }; 
}

// --- LÓGICA DE INICIO (Solo se ejecuta si NO es un test) ---
const __filename = fileURLToPath(import.meta.url);

async function bootstrap() {
    const { app, server, MongoDBClient } = await configureApp();
    
    // Esto es lo que Jest debe evitar
    if (process.argv[1] === __filename) {
        server.launch(); // Inicia el puerto (Mantiene el proceso vivo)
        MongoDBClient.connect(); // Conecta la DB (Mantiene el proceso vivo)
    }
    
    // Exportamos la app para que el test la pueda importar
    return app;
}

export const initializedApp = await bootstrap();

// NOTA: Como estamos usando imports dinámicos dentro de configureApp, necesitamos que index.js
// sea un módulo async, lo cual hacemos con el await bootstrap().*/