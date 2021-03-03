import logger from './logger';

require('dotenv').config();

import { Client } from 'discord.js';
import handleMessage from './messages';
import handleMessageReactionAdd from './reactions';

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

    client.on('message', handleMessage);
    client.on('messageReactionAdd', handleMessageReactionAdd);
};

connect().then().catch(console.error);

export default client;
