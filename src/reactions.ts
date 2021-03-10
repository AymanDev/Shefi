import { MessageReaction, PartialUser, User } from 'discord.js';

import { EMOTES } from './emotes';
import logger from './logger';

import { sendPostToChannel } from './utils/discord';
import { fetchRule34PostByUrl } from './utils/http';

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

    if (!user.dmChannel) {
        await user.createDM();
    }
    const post = await fetchRule34PostByUrl(rule34Link);
    await sendPostToChannel(post, rule34Link, user.dmChannel);
    logger.info(`Respond to react, dm:${!!user.dmChannel}`);
};

export default handleMessageReactionAdd;
