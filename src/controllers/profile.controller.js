import userRepository from '../repositories/user.repository.js';
import { ServerError } from '../utils/errors.util.js';

export const ProfileController = async (req, res, next) => {
    try {
      
        const userId = req.user._id;

        
        const user = await userRepository.findProfileUserById(userId);

        if (!user) {
            throw new ServerError('User profile not found', 404);
        }

        return res.status(200).json({
            ok: true,
            message: 'Profile found',
            data: user,
        });
    } catch (error) {
        next(error); 
    }
};
