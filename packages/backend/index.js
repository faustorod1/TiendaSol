import "dotenv/config";
dotenv.config();

import express from "express";
import cors from "cors";

import { Server } from "./server.js";

import { PedidoRepository } from './src/models/repositories/pedidoRepository.js';
import { ProductoRepository } from './src/models/repositories/productoRepository.js';
import { UsuarioRepository } from './src/models/repositories/usuarioRepository.js';

import { PedidoService } from './src/services/pedidoService.js';
import { ProductoService } from './src/services/productoService.js';
import { UsuarioService } from './src/services/usuarioService.js';

import { PedidoController } from './src/controllers/pedidoController.js';
import { ProductoController } from './src/controllers/productoController.js';
import { UsuarioController } from './src/controllers/usuarioController.js';

import { routes } from './src/routes/routes.js';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.get("/health", (_req, res) => {
    res.send("ok");
});


const port = process.env.SERVER_PORT || 3000;
const server = new Server(app, port);

const usuarioRepository = new UsuarioRepository();
const productoRepository = new ProductoRepository();
const pedidoRepository = new PedidoRepository();

const usuarioService = new UsuarioService(usuarioRepository);
const productoService = new ProductoService(productoRepository);
const pedidoService = new PedidoService(pedidoRepository, productoRepository, usuarioRepository);

const usuarioController = new UsuarioController(usuarioService);
const productoController = new ProductoController(productoService);
const pedidoController = new PedidoControllerroller(pedidoService);

server.setController(UsuarioController, usuarioController);
server.setController(ProductoController, productoController);
server.setController(PedidoController, pedidoController);

routes.forEach(route => server.addRoute(route));
server.configureRoutes();
server.launch();

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});

MongoDBClient.connect();