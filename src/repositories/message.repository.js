import Message from "../models/Message.model.js";
import ServerError from "../utils/errors.util.js";
import channelRepository from "./channel.repository.js";
import workspaceRepository from "./workspace.repository.js";

class MessageRepository {
    async create({ channel_id, sender_id, content }) {
       
        const channel_found = await channelRepository.findChannelById(channel_id);
        if (!channel_found) {
            throw new ServerError('Channel not found', 404);
        }

       
        if (!channel_found.workspace.members.includes(sender_id)) {
            throw new ServerError('No eres miembro de este espacio de trabajo', 403);
        }

      
        const new_message = await Message.create({
            channel: channel_id,
            sender: sender_id,
            content,
        });

        return new_message;
    }

    async findMessagesFromChannel({ channel_id, user_id }) {
       
        const channel_found = await channelRepository.findChannelById(channel_id);
        if (!channel_found) {
            throw new ServerError('Channel not found', 404);
        }

      
        if (!channel_found.workspace.members.includes(user_id)) {
            throw new ServerError('No eres miembro de este espacio de trabajo', 403);
        }

     
        const messages_list = await Message.find({ channel: channel_id })
            .populate('sender', 'username'); // Solo obtener el username del sender

        return messages_list;
    }
}

const messageRepository = new MessageRepository();
export default messageRepository;