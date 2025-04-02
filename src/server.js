import ENVIROMENT from './config/enviroment.config.js'; 
import express from 'express'
import authRouter from "./routes/auth.routes.js";
import mongoose from "./config/mongodb.config.js";
import cors from 'cors'
import { authMiddleware } from './middlewares/authMiddleware.js';
import workspace_router from './routes/workspace.router.js';
import channelRouter from './routes/channel.router.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

const app = express()

// Configuración de middlewares
app.use(cors())
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/workspaces', workspace_router);
app.use('/api/channel', channelRouter);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandlerMiddleware);

app.listen(ENVIROMENT.PORT, () => {
    console.log(`El servidor se está escuchando en http://localhost:${ENVIROMENT.PORT}`);
})


