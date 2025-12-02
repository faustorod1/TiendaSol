import pedidoRoutes from './pedidoRoutes.js';
import productoRoutes from './productoRoutes.js';
import { swaggerRoutes } from './swaggerRoutes.js';
import usuarioRoutes from './usuarioRoutes.js'
import categoriaRoutes from './categoriaRoutes.js';

const routes = [
    swaggerRoutes,
    pedidoRoutes,
    productoRoutes,
    usuarioRoutes,
    categoriaRoutes
]
export default routes