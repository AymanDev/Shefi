import { ColorResolvable, DMChannel, Guild, Message, MessageEmbed, NewsChannel, TextChannel } from 'discord.js';
import axios from 'axios';
import { load } from 'cheerio';

import logger from './logger';
import client from './index';
import { URL } from 'url';
import { unix } from 'moment';

export const sendErrorMessage = (channel: TextChannel | DMChannel | NewsChannel) => async (e: Error) => {
    logger.error(e);
    const message = await channel.send(['`Unexpected error occured`', `\`\`\`${e.stack}\`\`\``]);
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

export const RULE34_BASE_PARAMS = {
    page: 'post',
    s: 'view',
    json: 1,
};
export const getOriginalImageUrlFromRule34 = async (id: string) => {
    const { data } = await axios.get(RULE34_API_ENDPOINT, { params: { ...RULE34_BASE_PARAMS, id } });
    const $ = load(data);

    return $("li:contains('Source:') > a").attr('href');
};

export const RULE34_DETERMINATION = 'rule34.xxx/index.php?page=post';
export const RULE34_MAX_TAGS_COUNT = 5;
const RULE34_API_BASE_PARAMS = {
    page: 'dapi',
    s: 'post',
    q: 'index',
    json: 1,
};

const RULE34_RATING: Record<string, ColorResolvable> = {
    'explicit': 'RED',
    'questionable': 'YELLOW',
};
const RULE34_API_ENDPOINT = 'https://rule34.xxx/index.php';
export const getPostFromUrl = async (url: string) => {
    const { searchParams } = new URL(url);
    const id = searchParams.get('id');
    const { data } = await axios.get<Response>(RULE34_API_ENDPOINT, {
        params: { ...RULE34_API_BASE_PARAMS, id },
    });
    return data[0];
};

export const sendPostToChannel = async (
    post: Post,
    url: string,
    channel: TextChannel | DMChannel | NewsChannel
): Promise<Message> => {
    let message;
    try {
        const embedMessage = await buildRule34Embed(post, url);
        message = await channel.send(embedMessage);
    } catch (e) {
        const embedMessage = await buildRule34Embed(post, url, false);
        message = await channel.send(embedMessage);
        await channel.send(post.file_url);
    }
    return message;
};

export const buildRule34EmbedFromUrl = async (url: string, allowFileAsAttachment = true) => {
    return buildRule34Embed(await getPostFromUrl(url), url, allowFileAsAttachment);
};

export const buildRule34Embed = async (post: Post, url: string, allowFileAsAttachment = true) => {
    const isPostAnimated = post.file_url.endsWith('.mp4');

    const creator = await getCreatorUser();
    const embedMessage = new MessageEmbed();
    embedMessage.setTitle(`${post.id} posted by ${post.owner}`);
    embedMessage.setURL(url);
    embedMessage.setColor(RULE34_RATING[post.rating]);

    if (isPostAnimated) {
        embedMessage.setImage(post.sample_url);
        embedMessage.addField(
            'Notice',
            "Discord don't support videos on the embed messages. Also there are limit for the file size, that's why video may not attached as file"
        );
    } else {
        embedMessage.setImage(post.file_url);
    }

    embedMessage.addField('Up votes', post.score, true);

    const tags = post.tags.split(' ');
    embedMessage.addField(
        'Tags',
        tags.length > RULE34_MAX_TAGS_COUNT ? tags.slice(0, RULE34_MAX_TAGS_COUNT).join(', ') : tags.join(', '),
        true
    );

    const originalImageUrl = await getOriginalImageUrlFromRule34(post.id.toString());
    originalImageUrl && embedMessage.addField('Original', originalImageUrl);

    embedMessage.setTimestamp(unix(post.change).toDate());
    embedMessage.setFooter(`Shefi was created by ${creator.username}`, creator.avatarURL());

    if (isPostAnimated && allowFileAsAttachment) {
        embedMessage.attachFiles([post.file_url]);
    }
    return embedMessage;
};

export interface Post {
    preview_url: string;
    sample_url: string;
    file_url: string;
    directory: string;
    hash: string;
    height: number;
    id: number;
    image: string;
    change: number;
    owner: string;
    parent_id: number;
    rating: string;
    sample: boolean;
    sample_height: number;
    sample_width: number;
    score: number;
    tags: string;
    width: number;
}
export type Response = Post[];
