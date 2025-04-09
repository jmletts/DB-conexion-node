import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validateToken = (req : Request, res : Response, next : NextFunction) => {
    const headerToken = req.headers['authorization']; //obtenemos el token del header de la peticion
    // console.log(headerToken);

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const token = headerToken.slice(7); //eliminamos el Bearer del token
            jwt.verify(token, process.env.SECRET_KEY || "tseee")
            next();
        } catch (error) {
            res.status(401).json({
            message: 'Token no valido'
        })
    }} else {
            res.status(401).json({
            message: 'Acceso no autorizado'
        })
    }
}

export default validateToken;