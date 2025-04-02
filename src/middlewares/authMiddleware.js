import ENVIROMENT from "../config/enviroment.config.js";
import { ServerError } from "../utils/errors.util.js";
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    try {

        const authorization_header = req.headers['authorization'] 
        if (!authorization_header) {
            throw new ServerError('No has proporcionado un header de autorizacion', 401)
        }
        
        const authorization_token = authorization_header.split(' ')[1]
        if (!authorization_token) {
            throw new ServerError('No has proporcionado un token de autorizacion', 401)
        }
        try {
            const user_info = jwt.verify(authorization_token, ENVIROMENT.SECRET_KEY_JWT)
            req.user = user_info 
            next()
        }
        catch (error) {
            throw new ServerError('Token invalido o expirado', 400)
        }


    }
    catch (error) {
        console.log('error al autentificar', error);
        if (error.status) {
            return res.send({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        res.send({
            status: 500,
            ok: false,
            message: 'internal server error'
        })
    }


}
