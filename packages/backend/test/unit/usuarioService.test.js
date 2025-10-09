import { UsuarioService } from '../../src/services/usuarioService.js';
import { UsuarioRepository } from '../../src/repositories/usuarioRepository.js';
import { Usuario } from '../../src/models/usuario.js';
import { Pedido } from '../../src/models/pedido.js';
import { TipoUsuario } from '../../src/models/tipoUsuario.js';
import { Moneda } from '../../src/models/moneda.js';
import { jest } from '@jest/globals';

describe( "usuarioService.obtenerNotificaciones", () => {
    const mockRepo = {
        findByPage: jest.fn(),
        contarTodos: jest.fn(),
    };

    const usuarioService = new UsuarioService( mockRepo );

    const vendedor = new Usuario("1", "vendedor1", "email", 123, TipoUsuario.VENDEDOR, "12/02/2025");

    const comprador1 = new Usuario("2", "comprador1", "email", 123, TipoUsuario.COMPRADOR, "12/02/2025");
    const pedido1 = new Pedido({ comprador: comprador1, vendedor: vendedor });

    const comprador2 = new Usuario("3", "comprador2", "email", 123, TipoUsuario.COMPRADOR, "12/02/2025");
    const pedido2 = new Pedido({ comprador: comprador2, vendedor: vendedor });

    const comprador3 = new Usuario("4", "comprador3", "email", 123, TipoUsuario.COMPRADOR, "12/02/2025");
    const pedido3 = new Pedido({ comprador: comprador3, vendedor: vendedor });

    test( "Se obtienen las notificaciones no leidas requeridas correctamente", async () => {
        let notificaciones = usuarioService.obtenerNotificaciones( vendedor.id, false, {page: 1, limit: 2} );

        expect( notificaciones.total ).toBe( 2 );
    })
} );