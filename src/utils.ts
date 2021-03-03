import { DMChannel, Guild, NewsChannel, TextChannel, User } from 'discord.js';
import client from './index';
import axios from 'axios';
import { load } from 'cheerio';

import { RULE34_BASE_PARAMS, RULE34_ENDPOINT } from './messages';

export const sendErrorMessage = async (channel: TextChannel | DMChannel | NewsChannel) => {
    const message = await channel.send('`There is some problems with Rule34 API `');
    await message.react('🤷');
};

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

export const getOriginalImageUrlFromRule34 = async (id: string) => {
    const { data } = await axios.get(RULE34_ENDPOINT, { params: { ...RULE34_BASE_PARAMS, id } });
    const $ = load(data);

    return $("li:contains('Source:') > a").attr('href');
};
