import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";


const authMiddleware = (req, res, next) => {
    const SECRET = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError("Token de acceso no proporcionado o inválido."));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodificado = jwt.verify(token, SECRET);
        req.user = { id: decodificado.id, tipo: decodificado.tipo };
        
        next();
    } catch (error) {
        return next(new UnauthorizedError("Token de acceso inválido o expirado."));
    }
};

export default authMiddleware;