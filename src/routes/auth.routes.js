import express from 'express'
import  { loginController, registerController, resetPasswordController, rewritePasswordController, verifyEmailController } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { ProfileController } from '../controllers/profile.controller.js'
import { getWorkspacesController } from '../controllers/workspace.controller.js'
import { loginValidationRules, registerValidationRules, resetPasswordValidationRules, rewritePasswordValidationRules } from '../utils/validation.util.js'
import validationMiddleware from '../middlewares/validationMiddleware.js'




const authRouter = express.Router()

authRouter.post("/register",validationMiddleware(registerValidationRules), registerController )
authRouter.get('/verify-email', verifyEmailController)
authRouter.post('/login',validationMiddleware(loginValidationRules),loginController)
authRouter.post('/reset-password',validationMiddleware(resetPasswordValidationRules) ,resetPasswordController)
authRouter.put('/rewrite-password',validationMiddleware(rewritePasswordValidationRules), rewritePasswordController)
authRouter.get('/profile',authMiddleware,ProfileController)
authRouter.get('/workspaces', authMiddleware, getWorkspacesController)




export default authRouter