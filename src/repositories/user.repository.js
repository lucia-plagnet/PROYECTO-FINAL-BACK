//modelo para guardar nuevo usuario en base de datos?
import { ServerError } from '../utils/errors.util.js'
import User, { USER_PROPS } from "../models/User.model.js";

class UserRepository {
    async create({
        username,
        email,
        password,
        verification_token,
        image
    }) {
        try {
            await User.create({
                [USER_PROPS.USERNAME]: username,
                [USER_PROPS.EMAIL]: email,
                [USER_PROPS.PASSWORD]: password,
                [USER_PROPS.VERIFICATION_TOKEN]: verification_token,
            })
        }
        catch (error) {
            if (error.code === 11000) {

                if (error.keyPattern.username) {
                    throw new ServerError('Username already registered', 400)
                }
                if (error.keyPattern.email) {
                    throw new ServerError('Email already registered', 400)
                }
            }
            throw error; 
        }
    }

    async verifyUserByEmail(email) {
        const user_found = await User.findOne({ [USER_PROPS.EMAIL]: email })
        if (!user_found) {
            throw new ServerError('user not found', 404)
        }
        if (user_found.verified) {
            throw new ServerError('User has already been virified', 400)
        }
        user_found.verified = true
        await user_found.save()
        return user_found
    }

    async findUserByEmail(email) {
        return await User.findOne({ [USER_PROPS.EMAIL]: email })
    }

    async changeUserPassword(id, newPassword) {
        const foundUser = await User.findById(id) 
        if (!foundUser) {
            throw new ServerError('Usuario no encontrado', 404)
        }
        foundUser.password = newPassword
        await foundUser.save()
    }


   
    async findProfileUserById(id) {
        try {
            const user = await User.findById(id).select(
                `${USER_PROPS.USERNAME} ${USER_PROPS.EMAIL} ${USER_PROPS.IMAGE}`
            );

            if (!user) {
                throw new ServerError('User not found', 404);
            }

            return user
        } catch (error) {
            throw error; 
        }
    }
}




export default new UserRepository()