import workspaceRepository from "../repositories/workspace.repository.js";
import ServerError from "../utils/errors.util.js";

export const createWorkspaceController = async (req, res, next) => {
    try {
        const { name } = req.body;
        const owner_id = req.user._id;
        const new_workspace = await workspaceRepository.createWorkspace({ name, owner_id });

        res.status(201).json({
            ok: true,
            status: 201,
            message: 'Workspace created',
            data: {
                new_workspace,
            },
        });
    } catch (error) {
        next(error); 
    }
};

export const invitedUserToWorkspaceController = async (req, res, next) => {
    try {
        const user_id = req.user._id;
        const { workspace_id, invited_id } = req.body;

        const workspace_found = await workspaceRepository.addNewMember({
            owner_id: user_id,
            invited_id,
            workspace_id,
        });

        res.status(201).json({
            ok: true,
            status: 201,
            message: 'Nuevo miembro agregado',
            data: {
                workspace: workspace_found,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getWorkspacesController = async (req, res, next) => {
    try {
        const owner_id = req.user._id; 
        const workspaces = await workspaceRepository.getAllWorkspaces(owner_id); // Obtenemos los workspaces del usuario

        if (workspaces.length === 0) {
            throw new ServerError('No workspaces found', 404);
        }

        res.status(200).json({
            ok: true,
            status: 200,
            message: 'Workspaces retrieved successfully',
            data: {
                workspaces,
            },
        });
    } catch (error) {
        next(error); 
    }
};

export const getWorkspaceByIdController = async (req, res, next) => {
    try {

        const workspaceId = req.params.workspace_id; 
      const workspace = await workspaceRepository.findWorkspaceById(workspaceId)


        if (!workspace) {
            throw new ServerError('Workspace not found', 404);
        }

        res.status(200).json({
            ok: true,
            data: workspace,
        });
    } catch (error) {
        next(error); 
    }
};

export const getWorkspaceChannelsController = async (req, res, next) => {
    try {
        const { workspace_id } = req.params; 

        const workspace = await workspaceRepository.findWorkspaceWithChannels(workspace_id);

        if (!workspace) {
            throw new ServerError('Workspace not found', 404);
        }

        res.status(200).json({
            ok: true,
            status: 200,
            message: 'Channels retrieved successfully',
            data: workspace.channels,
        });
    } catch (error) {
        next(error); 
    }
};