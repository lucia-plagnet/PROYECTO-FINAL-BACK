import { ServerError } from '../utils/errors.util.js';

const validationMiddleware = (requiredFields) => {
    return (req, res, next) => {
        const errors = [];

        
        requiredFields.forEach((field) => {
            const { name, type, pattern, minLength } = field;
            const value = req.body[name];

            if (!value) {
                errors.push(`${name} es obligatorio.`);
            } else {
                if (type && typeof value !== type) {
                    errors.push(`${name} debe ser de tipo ${type}.`);
                }
                if (minLength && value.length < minLength) {
                    errors.push(`${name} debe tener al menos ${minLength} caracteres.`);
                }
                if (pattern && !pattern.test(value)) {
                    errors.push(`${name} no cumple con el formato requerido.`);
                }
            }
        });

       
        if (errors.length > 0) {
            return next(new ServerError(`Errores de validación: ${errors.join(', ')}`, 400));
        }

        next(); 
    };
};

export default validationMiddleware;