import { Message } from 'discord.js';

import {
    getPostFromUrl,
    RULE34_DETERMINATION,
    sendPostToChannel,
} from './utils';
import { EMOTES } from './emotes';
import client from './index';

export const COMMAND_PREFIX = 's!';

const onMessage = async (message: Message) => {
    const { content, author, reply } = message;

    if (author.bot || author.id === client.user.id) {
        return;
    }

    if (content.includes(RULE34_DETERMINATION)) {
        await handleRule34(message);
        return;
    }

    if (!content.startsWith(COMMAND_PREFIX)) {
        return;
    }

    const command = content.replace(COMMAND_PREFIX, '');
    if (command === 'help') {
        await reply(
            [
                '* s!about - some info about this bot',
                `* React with ${EMOTES.VANILLA_SMUG.emoji} on bot rule34 embed message to save post in DM`,
                '* Questions, issues and etc here: https://github.com/AymanDev/Shefi',
            ],
            {}
        );
        return;
    }

    if (command === 'about') {
        await reply('Bot can parse rule34 links and make embed message with some info, original images and etc.');
        return;
    }
};

const handleRule34 = async (message: Message) => {
    const { content, channel } = message;

    const test = content.match(/(https?:\/\/[^ ]*)/);
    const url = test && test[1];

    await message.react(EMOTES.LOADING.emoji.id);
    const post = await getPostFromUrl(url);

    const responseMessage = await sendPostToChannel(post, url, channel);

    await message.react(EMOTES.OK.emoji.id);

    if (message.deletable) {
        await message.delete();
    }
    await responseMessage.react(EMOTES.VANILLA_SMUG.emoji.id);
};

export default onMessage;
