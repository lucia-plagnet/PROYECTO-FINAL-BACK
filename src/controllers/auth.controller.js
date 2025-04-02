import ENVIROMENT from '../config/enviroment.config.js';
import userRepository from '../repositories/user.repository.js';
import { ServerError } from '../utils/errors.util.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendMail } from "../utils/mailer.utils.js";

export const registerController = async (req, res, next) => {
    try {
        const { username, email, password, image } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const verification_token = jwt.sign(
            { email },
            ENVIROMENT.SECRET_KEY_JWT,
            { expiresIn: '24h' }
        );

        await userRepository.create({ username, email, password: passwordHash, verification_token, image });

        await sendMail({
            to: email,
            subject: 'Valida tu correo electrónico',
            html: `
            <h1>Valida tu correo electrónico para iniciar sesión</h1>
            <p>Se requiere validar el correo actual, si no te has registrado en (nombre de empresa) entonces ignora este correo.</p>
            <a href="${ENVIROMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}">Verifica Aquí</a>
            `,
        });

        res.status(201).send({
            message: "user created",
            status: 201,
            ok: true
        });
    } catch (error) {
        next(error); 
    }
};

export const verifyEmailController = async (req, res, next) => {
    try {
        const { verification_token } = req.query;
        const payload = jwt.verify(verification_token, ENVIROMENT.SECRET_KEY_JWT);

        const { email } = payload;
        await userRepository.verifyUserByEmail(email);

        res.redirect(ENVIROMENT.URL_FRONTEND + '/login');
    } catch (error) {
        next(error); 
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user_found = await userRepository.findUserByEmail(email);

        if (!user_found) {
            throw new ServerError('User not found', 404);
        }

        if (!user_found.verified) {
            throw new ServerError('User has not validated their email', 400);
        }

        const isSamePassword = await bcrypt.compare(password, user_found.password);
        if (!isSamePassword) {
            throw new ServerError('The password is not correct', 400);
        }

        const authorization_token = jwt.sign(
            {
                _id: user_found._id,
                username: user_found.username,
                email: user_found.email
            },
            ENVIROMENT.SECRET_KEY_JWT,
            { expiresIn: '2h' }
        );

        res.json({
            ok: true,
            status: 200,
            message: 'Logged',
            data: {
                authorization_token
            }
        });
    } catch (error) {
        next(error); 
    }
};

export const resetPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user_found = await userRepository.findUserByEmail(email);

        if (!user_found) {
            throw new ServerError('User not found', 404);
        }

        if (!user_found.verified) {
            throw new ServerError('User email is not validated', 400);
        }

        const reset_token = jwt.sign({ email, _id: user_found._id }, ENVIROMENT.SECRET_KEY_JWT, { expiresIn: '2h' });

        await sendMail({
            to: email,
            subject: 'Reset your password',
            html: `
            <h1>Has solicitado cambiar tu contraseña, si no eres tú, ignora este correo</h1>
            <a href='${ENVIROMENT.URL_FRONTEND}/rewrite-password?reset_token=${reset_token}'>Cambiar mi contraseña</a>
            `
        });

        res.json({
            ok: true,
            status: 200,
            message: 'Reset mail sent'
        });
    } catch (error) {
        next(error); 
    }
};

export const rewritePasswordController = async (req, res, next) => {
    try {
        const { password, reset_token } = req.body;

        const { _id } = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY_JWT);

        const newHashedPassword = await bcrypt.hash(password, 10);
        await userRepository.changeUserPassword(_id, newHashedPassword);

        res.json({
            ok: true,
            message: 'Contraseña cambiada con éxito',
            status: 201
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ServerError('El token ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.', 401));
        }

        next(error); 
    }
};

