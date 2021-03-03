import { MessageReaction, PartialUser, User } from 'discord.js';
import { EMOTES } from './emotes';
import { buildRule34Embed } from './messages';
import logger from './logger';

const handleMessageReactionAdd = async (messageReaction: MessageReaction, user: User | PartialUser) => {
    const { message, emoji, me } = messageReaction;

    logger.info(
        `${user.username}:${user.discriminator} reacted with ${emoji.name}:${emoji.id}, required ${EMOTES.VANILLA_SMUG.emoji.id}`
    );

    logger.info(`Reacted message embeds ${message.embeds.length} ${JSON.stringify(message.embeds)}`);
    if (me || message.embeds.length === 0 || emoji.id !== EMOTES.VANILLA_SMUG.emoji.id) {
        return;
    }

    const embedMessage = message.embeds[0];
    const rule34Link = embedMessage.url;
    const rule34Embed = await buildRule34Embed(rule34Link);

    if (!user.dmChannel) {
        await user.createDM();
    }
    logger.info(`Respond to react, dm:${!!user.dmChannel}`);
    await user.dmChannel.send(rule34Embed);
};

export default handleMessageReactionAdd;
