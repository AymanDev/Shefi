import client from '../..';
import { HTTPS_REGEX, RULE34_DETERMINATION } from '../../consts';
import { EMOTES } from '../../guilds/emotes';
import logger from '../../logger';
import { handleRule34 } from '../messages';
import { CommandHandler } from '../types';
import registerCommand from './factory';

const handler: CommandHandler = async message => {
    const { channel } = message;

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
            !!m.content.match(HTTPS_REGEX) && m.author.id !== client.user.id && m.content.includes(RULE34_DETERMINATION)
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
};

registerCommand('convert', handler)