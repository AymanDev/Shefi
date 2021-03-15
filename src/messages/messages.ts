import { Message } from 'discord.js';

import { COMMAND_PREFIX, HTTPS_REGEX, RULE34_DETERMINATION } from '../consts';
import { EMOTES } from '../guilds/emotes';
import client from '../index';
import { sendPostToChannel } from '../utils/discord';
import { fetchRule34PostByUrl } from '../utils/http';
import { getCommand } from './commands/factory';

const onMessage = async (message: Message) => {
    const { content, author, cleanContent } = message;

    if (author.bot || author.id === client.user.id) {
        return;
    }

    if (cleanContent.includes('gachi')) {
        await message.react(EMOTES.HYPER_GACHI.emoji.id);
    }

    if (content.includes(RULE34_DETERMINATION)) {
        await handleRule34(message);
        return;
    }

    if (!content.startsWith(COMMAND_PREFIX)) {
        return;
    }

    const commandName = content.replace(COMMAND_PREFIX, '');
    const { handler } = getCommand(commandName);
    await handler(message);
};

export const handleRule34 = async (message: Message) => {
    const { content, channel } = message;

    const test = content.match(HTTPS_REGEX);
    const url = test && test[1];

    await message.react(EMOTES.LOADING.emoji.id);
    const post = await fetchRule34PostByUrl(url);

    const responseMessage = await sendPostToChannel(post, url, channel);

    await message.react(EMOTES.OK.emoji.id);

    if (message.deletable) {
        await message.delete();
    }
    await responseMessage.react(EMOTES.VANILLA_SMUG.emoji.id);
};

export default onMessage;
