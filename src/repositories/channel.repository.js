import Channel from "../models/Channel.model.js";
import ServerError from "../utils/errors.util.js";
import workspaceRepository from "./workspace.repository.js";

class ChannelRepository {
    async findChannelById(channel_id) {
        
        return Channel.findById(channel_id).populate('workspace');
    }

    async createChannel({ name, workspace_id, user_id }) {
       
        const workspace_found = await workspaceRepository.findWorkspaceById(workspace_id);
        if (!workspace_found) {
            throw new ServerError('Workspace not found', 403);
        }

        try {
           
            const channel = await Channel.create({
                name: name,
                workspace: workspace_id,
                created_by: user_id,
            });
            return channel;
        } catch (error) {
           
            throw new ServerError('Error al crear el canal', 500);
        }
    }
}

const channelRepository = new ChannelRepository();
export default channelRepository;