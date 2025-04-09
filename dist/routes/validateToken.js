"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const headerToken = req.headers['authorization']; //obtenemos el token del header de la peticion
    // console.log(headerToken);
    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const token = headerToken.slice(7); //eliminamos el Bearer del token
            jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "tseee");
            next();
        }
        catch (error) {
            res.status(401).json({
                message: 'Token no valido'
            });
        }
    }
    else {
        res.status(401).json({
            message: 'Acceso no autorizado'
        });
    }
};
exports.default = validateToken;
