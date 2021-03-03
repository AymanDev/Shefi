import logger from './logger';

require('dotenv').config();

import { Client, Message } from 'discord.js';
import onMessage from './messages';
import handleMessageReactionAdd from './reactions';
import { sendErrorMessage } from './utils';

const client = new Client();

const connect = async () => {
    await client.login(process.env.TOKEN);
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
};

connect().then().catch(console.error);

export default client;
