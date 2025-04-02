import Workspace from "../models/Workspace.model.js";
import ServerError from "../utils/errors.util.js";
import Message from "../models/message.model.js";

class WorkspaceRepository {
    async findWorkspaceById(_id) {
        return await Workspace.findById(_id).populate('members', 'username');
    }

    async createWorkspace({ name, owner_id }) {
        const workspace = await Workspace.create({
            name,
            owner: owner_id,
            members: [owner_id],
        });
        return workspace;
    }

    async findWorkspaceWithChannels(workspace_id) {
        return await Workspace.findById(workspace_id).populate('channels', 'name created_at');
    }

    async addNewMember({ workspace_id, owner_id, invited_id }) {
        const workspace_found = await this.findWorkspaceById(workspace_id);

        if (!workspace_found) {
            throw new ServerError('Workspace not found', 404);
        }

        if (!workspace_found.owner.equals(owner_id)) {
            throw new ServerError('No eres el owner de este espacio de trabajo', 403);
        }

        if (workspace_found.members.includes(invited_id)) {
            throw new ServerError('Ya perteneces a este espacio de trabajo', 400);
        }

        workspace_found.members.push(invited_id);
        await workspace_found.save();
        return workspace_found;
    }

    async getAllWorkspaces(user_id) {
       
        const workspaces = await Workspace.find({ members: user_id }).populate('members', 'username');

        if (!workspaces.length) {
            throw new ServerError('No perteneces a ningún workspace', 404);
        }

        return workspaces;
    }

    async getWorkspaceChannelsAndMessages(workspace_id) {
        const workspace = await Workspace.findById(workspace_id).populate('channels');
        if (!workspace) {
            throw new ServerError('Workspace not found', 404);
        }

        const channelsWithMessages = await Promise.all(
            workspace.channels.map(async (channel) => {
                const messages = await Message.find({ channel: channel._id }).populate('sender', 'username');
                return {
                    channel,
                    messages,
                };
            })
        );

        return {
            workspace,
            channels: channelsWithMessages,
        };
    }
}

const workspaceRepository = new WorkspaceRepository();

export default workspaceRepository;