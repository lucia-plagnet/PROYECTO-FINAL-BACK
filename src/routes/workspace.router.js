import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createWorkspaceController, invitedUserToWorkspaceController, getWorkspaceByIdController, getWorkspaceChannelsController} from "../controllers/workspace.controller.js";

const workspace_router = Router()

workspace_router.post ('/', authMiddleware, createWorkspaceController)
workspace_router.post('/:workspace_id/invite/:invited_id', authMiddleware, invitedUserToWorkspaceController)
workspace_router.get('/:workspace_id', authMiddleware, getWorkspaceByIdController);
workspace_router.get('/:workspace_id/channels', authMiddleware, getWorkspaceChannelsController);

export default workspace_router