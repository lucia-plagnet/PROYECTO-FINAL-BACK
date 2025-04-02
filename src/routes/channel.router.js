import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createChannelController, getMessagesListFromChannelController, sendMessageToChannelController } from "../controllers/channel.controller.js"

const channelRouter = Router()


channelRouter.post('/:workspace_id', authMiddleware, createChannelController);
channelRouter.post('/:channel_id/messages', authMiddleware, sendMessageToChannelController)
channelRouter.get('/:channel_id/messages', authMiddleware, getMessagesListFromChannelController)




export default channelRouter