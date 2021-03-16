import { Client, DMChannel, Message, NewsChannel, TextChannel } from 'discord.js';

import logger from './logger';
import onMessage from './messages';
import handleMessageReactionAdd from './messages/reactions';
import { sendErrorMessage } from './utils/discord';

require('dotenv').config();

const { TOKEN, CREATOR_ID, EMOJI_GUILD_ID } = process.env;

if (!TOKEN || !CREATOR_ID || !EMOJI_GUILD_ID) {
    logger.error('Provide TOKEN, CREATOR_ID and EMOJI_GUILD_ID values for environment');
    process.exit();
}

const client = new Client();

const connect = async () => {
    logger.info('Connecting to Discord API...');
    await client.login(TOKEN);
    logger.info('Bot connected to Discord API');

    await client.user.setPresence({
        activity: {
            type: 'WATCHING',
            name: 's!help',
        },
    });
    logger.info('Updated user presence');

    const handleMessage = async (message: Message) => {
        await onMessage(message).catch(sendErrorMessage(message.channel));
    };

    client.on('message', handleMessage);
    client.on('messageReactionAdd', handleMessageReactionAdd);

    // Handling raw event, because discordjs won't handle uncached messages
    client.on('raw', async packet => {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
            return;
        }

        const channel = client.channels.cache.get(packet.d.channel_id);

        if (channel.type !== 'text' && channel.type !== 'news' && channel.type !== 'dm') {
            return;
        }

        const textChannel = channel as TextChannel | NewsChannel | DMChannel;

        if (textChannel.messages.cache.has(packet.d.message_id)) {
            return;
        }

        const message = await textChannel.messages.fetch(packet.d.message_id);
        const emoji = packet.d.emoji.id ? packet.d.emoji.id : packet.d.emoji.name;
        const reaction = (await message.fetch(true)).reactions.resolve(emoji.id);

        if (!reaction) {
            logger.info(`Can't found reaction for message ${message.id} with emoji ${emoji}`);
            return;
        }
        reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
        }
    });
};

connect().then().catch(console.error);

export default client;
