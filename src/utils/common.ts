import client from '../index';
import { Guild } from 'discord.js';

export const getCreatorUser = async () => {
    if (!process.env.CREATOR_ID) {
        return null;
    }

    return await client.users.fetch(process.env.CREATOR_ID);
};

export const getEmojiGuild = (): Guild => {
    if (!process.env.EMOJI_GUILD_ID) {
        return null;
    }

    return client.guilds.resolve(process.env.EMOJI_GUILD_ID);
};
