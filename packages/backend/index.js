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
server.launch();

MongoDBClient.connect();