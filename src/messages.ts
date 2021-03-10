import { Message } from 'discord.js';

import { EMOTES } from './emotes';
import client from './index';
import logger from './logger';
import { COMMAND_PREFIX, HTTPS_REGEX, RULE34_DETERMINATION } from './consts';
import { fetchRule34PostByUrl } from './utils/http';
import { sendPostToChannel } from './utils/discord';


const onMessage = async (message: Message) => {
    const { content, author, cleanContent, channel } = message;

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

    const command = content.replace(COMMAND_PREFIX, '');
    if (command === 'help') {
        await channel.send(
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
        await channel.send(
            'Bot can parse rule34 links and make embed message with some info, original images and etc.'
        );
        return;
    }

    if (command === 'convert') {
        const agreeMessage = await channel.send(
            `This command can take a lot more time than you can expect! React with ${EMOTES.OK.emoji} to accept it. Notify and agree messages will be deleted after conversion!`
        );
        await agreeMessage.react(EMOTES.OK.emoji.id);
        const collection = await agreeMessage.awaitReactions(
            (reaction, user) => reaction.emoji.id === EMOTES.OK.emoji.id && user.id !== client.user.id,
            { max: 1 }
        );
        logger.info(`Finished reaction await ${collection.size}`);
        if (collection.size === 0) {
            return;
        }

        await message.delete();
        const messageCollection = (await channel.messages.fetch()).filter(
            m =>
                !!m.content.match(HTTPS_REGEX) &&
                m.author.id !== client.user.id &&
                m.content.includes(RULE34_DETERMINATION)
        );
        let completedMessages = 0;
        const countMessage = await channel.send(`Processing messages [${completedMessages}/${messageCollection.size}]`);
        await countMessage.react(EMOTES.LOADING.emoji.id);

        for (const message of messageCollection.array().reverse()) {
            await handleRule34(message);
            completedMessages++;
            await countMessage.edit(`Processing messages [${completedMessages}/${messageCollection.size}]`);
        }

        await countMessage.delete();
        await agreeMessage.delete();

        const finishMessage = await channel.send(
            'Finished converting all available! `*`(This message will be deleted automatically)`*`'
        );
        await finishMessage.delete({ timeout: 5000 });
    }
};

const handleRule34 = async (message: Message) => {
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
