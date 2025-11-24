import { Notificacion } from "../models/entities/notificacion.js";

import { z } from "zod";

export class UsuarioController {
    constructor(usuarioService){
        this.usuarioService = usuarioService;
    }

    async obtenerNotificaciones(req, res) {
        const reqSinValidar = {
            ...req.query,
            usuarioId: req.user.id
        };

        const reqResult = obtenerNotificacionesSchema.safeParse(reqSinValidar);
        if (!reqResult.success) {
            return res.status(400).json(reqResult.error.issues);
        }
        const { usuarioId, leida, page, limit } = reqResult.data;

        const paginated = await this.usuarioService.obtenerNotificaciones(usuarioId, leida, {
            page: page,
            limit: limit
        });

        res.status(200).json(paginated);
    }

    async obtenerNotificacion(req, res) {
        const reqSinValidar = {
            id: req.params.id,
            usuarioId: req.user.id
        }
        const reqResult = obtenerNotificacionSchema.safeParse(reqSinValidar);
        if (!reqResult.success) {
            return res.status(400).json(reqResult.error.issues);
        }
        const { usuarioId, id } = reqResult.data;
        const notificacion = await this.usuarioService.obtenerNotificacion(usuarioId, id);

        res.status(200).json(notificacion);
    }


    async marcarNotificacionComoLeida(req, res) {
        const reqSinValidar = {
            id: req.params.id,
            usuarioId: req.user.id
        }
        const reqResult = marcarNotificacionComoLeidaSchema.safeParse(reqSinValidar);
        if (!reqResult.success) {
            return res.status(400).json(reqResult.error.issues);
        }
        const { usuarioId, id } = reqResult.data;

        const notificacion = await this.usuarioService.marcarNotificacionComoLeida(usuarioId, id);

        res.status(200).json({
            mensaje: 'Notificación marcada como leída',
            notificacion
        });
    }

    async login(req, res) {
        const reqResult = loginUsuarioSchema.safeParse(req.body);
        if (!reqResult.success) {
            return res.status(400).json({
                message: 'Datos de login inválidos',
                errors: reqResult.error.issues
            });
        }
        const { email, password } = reqResult.data;

        const response = await this.usuarioService.login(email, password);

        return res.status(200).json(response);
    }

    async registrar(req, res) {
        const reqResult = registrarUsuarioSchema.safeParse(req.body);
        if (!reqResult.success) {
            return res.status(400).json({
                message: 'Datos de registro inválidos',
                errors: reqResult.error.issues
            });
        }

        const { email, password, nombre, telefono, tipo } = reqResult.data;
        const userData = { nombre, telefono, tipo };

        const usuarioNuevo = await this.usuarioService.registrar(email, password, userData);

        return res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: usuarioNuevo
        });
    }

    async buscarPorId(req, res) {
        const result = objectIdSchema.safeParse(req.params.id);
        if (!result.success) {
            return res.status(400).json(result.error.issues);
        }
        const userId = result.data;

        const usuario = await this.usuarioService.buscarPorId(userId);
        res.status(200).json(usuario);
    }
}




const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Id inválido');

const booleanSchema = z.string().transform((v, ctx) => {
  if (v === "true") return true;
  if (v === "false") return false;

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Debe ser 'true' o 'false'"
  });
  return z.NEVER; // le dice a Zod que el parseo falló
});

const obtenerNotificacionesSchema = z.object({
    usuarioId: objectIdSchema,
    page: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().positive())
        .default("1"),
    limit: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().min(1).max(100))
        .default("10"),
    leida: booleanSchema.optional()
});

const obtenerNotificacionSchema = z.object({
    id: objectIdSchema,
    usuarioId: objectIdSchema
});

const marcarNotificacionComoLeidaSchema = obtenerNotificacionSchema;

const loginUsuarioSchema = z.object({
    email: z.email('Formato de correo electrónico inválido'),
    password: z.string().min(1, 'La contraseña no puede estar vacía')
});

const passwordSchema = z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "Debe incluir al menos una mayúscula.")
    .regex(/[a-z]/, "Debe incluir al menos una minúscula.")
    .regex(/[0-9]/, "Debe incluir al menos un número.")
    .regex(/[^a-zA-Z0-9]/, "Debe incluir al menos un carácter especial (ej. !, @, #, $).");

const registrarUsuarioSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.email('Formato de correo electrónico inválido'),
    password: passwordSchema,
    telefono: z.string().optional(),
    tipo: z.enum(['COMPRADOR', 'VENDEDOR'], {
        required_error: "El tipo de usuario es requerido"
    })
});