import channelRepository from "../repositories/channel.repository.js";
import messageRepository from "../repositories/message.repository.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import { ServerError } from "../utils/errors.util.js";

export const createChannelController = async (req, res, next) => {
    try {
      
        const { name } = req.body;

      
        const user_id = req.user.owner_id;

     
        const { workspace_id } = req.params;

      
        const workspace_found = await workspaceRepository.findWorkspaceById(workspace_id);
        if (!workspace_found) {
            throw new ServerError('Workspace not found', 404);
        }

      
        const new_channel = await channelRepository.createChannel({ name, owner_id: user_id, workspace_id });

       
        workspace_found.channels.push(new_channel._id);
        await workspace_found.save();

        res.json({
            ok: true,
            status: 200,
            message: 'Channel created',
            data: {
                new_channel,
            },
        });
    } catch (error) {
        next(error); 
    }
};

export const sendMessageToChannelController = async (req, res, next) => {
    try {
        const { channel_id } = req.params;
        const user_id = req.user._id;
        const { content } = req.body;

        const new_message = await messageRepository.create({ channel_id, sender_id: user_id, content });

        res.json({
            ok: true,
            status: 201,
            message: 'Message created',
            data: {
                new_message,
            },
        });
    } catch (error) {
        next(error); 
    }
};

export const getMessagesListFromChannelController = async (req, res, next) => {
    try {
        const user_id = req.user._id;
        const { channel_id } = req.params;

        const messages = await messageRepository.findMessagesFromChannel({ channel_id, user_id });

        res.json({
            ok: true,
            status: 200,
            message: 'Messages list',
            data: {
                messages,
            },
        });
    } catch (error) {
        next(error); 
    }
};

