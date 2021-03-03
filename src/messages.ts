import { ColorResolvable, Message, MessageEmbed } from 'discord.js';
import { URL } from 'url';
import axios from 'axios';
import { unix } from 'moment';

import { getCreatorUser, getOriginalImageUrlFromRule34 } from './utils';
import { EMOTES } from './emotes';

export const COMMAND_PREFIX = 's!';
export const RULE34_ENDPOINT = 'https://rule34.xxx/index.php?page=post&s=view&id=4515544';
export const RULE34_BASE_PARAMS = {
    page: 'post',
    s: 'view',
    json: 1,
};

const RULE34_DETERMINATION = 'rule34.xxx/index.php?page=post';
const RULE34_API_ENDPOINT = 'https://rule34.xxx/index.php';
const RULE34_MAX_TAGS_COUNT = 5;
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

const handleMessage = async (message: Message) => {
    const { content, channel } = message;

    if (content.includes(RULE34_DETERMINATION)) {
        await handleRule34(message);
        return;
    }

    if (!content.startsWith(COMMAND_PREFIX)) {
        return;
    }

    const command = content.replace(COMMAND_PREFIX, '');
    if (command === 'help') {
        await channel.send([
            '* s!about - some info about this bot',
            `* React with ${EMOTES.VANILLA_SMUG.emoji} on bot rule34 embed message to save post in DM`,
            '* Questions, issues and etc here: https://github.com/AymanDev/Shefi',
        ]);
        return;
    }

    if (command === 'about') {
        await channel.send(
            'Bot can parse rule34 links and make embed message with some info, original images and etc.'
        );
        return;
    }
};

export const buildRule34Embed = async (url: string) => {
    const { searchParams } = new URL(url);
    const id = searchParams.get('id');
    const { data } = await axios.get<Response>(RULE34_API_ENDPOINT, {
        params: { ...RULE34_API_BASE_PARAMS, id },
    });
    const post = data[0];

    const isPostAnimated = post.file_url.endsWith('.mp4');

    const creator = await getCreatorUser();
    const embedMessage = new MessageEmbed();
    embedMessage.setTitle(`${post.id} posted by ${post.owner}`);
    embedMessage.setURL(url);
    embedMessage.setColor(RULE34_RATING[post.rating]);

    if (isPostAnimated) {
        embedMessage.setImage(post.sample_url);
        embedMessage.addField('Notice', `For now discord don't supports videos inside embed messages`);
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
    embedMessage.attachFiles([post.file_url]);
    return embedMessage;
};

const handleRule34 = async (message: Message) => {
    const { content, channel } = message;

    await message.react('📤');
    const embedMessage = await buildRule34Embed(content);
    await message.react('📥');

    const responseMessage = await channel.send(embedMessage);
    if (message.deletable) {
        await message.delete();
    }
    await responseMessage.react(EMOTES.VANILLA_SMUG.emoji.id);
};

export default handleMessage;
