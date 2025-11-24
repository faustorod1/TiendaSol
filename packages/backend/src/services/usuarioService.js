import { Usuario } from '../models/entities/usuario.js';
import { Notificacion } from '../models/entities/notificacion.js';
import { UsuarioRepository } from "../models/repositories/usuarioRepository.js";
import { NotificacionDoesNotExistError } from '../errors/NotificacionDoesNotExistError.js';
import { UsuarioDoesNotExistError } from '../errors/UsuarioDoesNotExistError.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { EmailUnavailableError } from '../errors/EmailUnavailableError.js';
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

const TOKEN_DURATION = '24h';


export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async obtenerNotificaciones(usuarioId, leida, { page, limit }) {
        const filtro = { usuarioId };
        if (leida !== undefined) {
            filtro.leida = leida;
        }
        const nroPage = Number(page);
        const nroLimit = Number(limit);

        const offset = (nroPage - 1) * nroLimit;

        const { rows, count } = await this.usuarioRepository.findNotificationsByPage(filtro, nroLimit, offset);

        const totalPaginas = Math.ceil(count / nroLimit);

        return {
            page: page,
            perPage: limit,
            total: count,
            totalPages: totalPaginas,
            data: rows
        };
    }

  async marcarNotificacionComoLeida(usuarioId, id) {
    const notificacionActualizada = await this.usuarioRepository.marcarNotificacionComoLeida(usuarioId, id);
    if (notificacionActualizada === null) {
      throw new NotificacionDoesNotExistError(usuarioId, id);
    }

    return notificacionActualizada;
  }

  async login(email, password) {
    // Así se asegura de devolver lo mismo en ambos casos.
    const ERR_MSG = 'Credenciales inválidas.';

    const usuario = await this.usuarioRepository.findByEmailWithPassword(email);
    if (!usuario) {
      throw new UnauthorizedError(ERR_MSG);
    }
    
    const passCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passCorrecta) {
      throw new UnauthorizedError(ERR_MSG);
    }

    const payload = {
      id: usuario._id.toString(),
      email: usuario.email,
      rol: usuario.rol
    }
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: TOKEN_DURATION
    });

    const { password: _, ...usuarioSinHash } = usuario;

    return { token: token, usuario: usuarioSinHash };
  }

  async registrar(email, password, data) {
    const existente = await this.usuarioRepository.findByEmail(email);
    if (existente) {
      throw new EmailUnavailableError();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const usuario = new Usuario({...data, email: email});

    const usuarioGuardado = await this.usuarioRepository.save(usuario, passwordHasheada);

    return usuarioGuardado;
  }

  async buscarPorId(id) {
    const usuario = await this.usuarioRepository.findById(id);
    if (usuario === null) {
        throw new UsuarioDoesNotExistError(id);
    }
    return usuario;
  }
}