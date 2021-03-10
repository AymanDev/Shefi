import { Post } from '../types';
import { DMChannel, Message, MessageEmbed, NewsChannel, TextChannel } from 'discord.js';
import logger from '../logger';
import { RULE34_RATING } from '../consts';
import { unix } from 'moment';
import { fetchRule34PostOriginalImageUrlById } from './http';
import { getCreatorUser } from './common';

export const sendPostToChannel = async (
    post: Post,
    url: string,
    channel: TextChannel | DMChannel | NewsChannel
): Promise<Message> => {
    try {
        const embedMessage = await buildRule34Embed(post, url);
        logger.info(`Trying to send embed message ${JSON.stringify(embedMessage)}`);
        return await channel.send(embedMessage);
    } catch (e) {
        const embedMessage = await buildRule34Embed(post, url, false);
        logger.info(`Trying to send embed message ${JSON.stringify(embedMessage)}`);
        const message = await channel.send(embedMessage);
        if (arePostIsMp4(post)) {
            await channel.send(post.file_url);
        }
        return message;
    }
};

export const sendErrorMessage = (channel: TextChannel | DMChannel | NewsChannel) => async (e: Error) => {
    logger.error(e);
    const message = await channel.send(['`Unexpected error occurred`', `\`\`\`${e.stack}\`\`\``]);
    await message.react('🤷');
};

export const arePostIsMp4 = (post: Post) => {
    return post.file_url.endsWith('.mp4');
};
export const arePostIsGif = (post: Post) => {
    return post.file_url.endsWith('.gif');
};

export const buildRule34Embed = async (post: Post, url: string, allowFileAsAttachment = true) => {
    const isPostMp4 = arePostIsMp4(post);
    const isPostGif = arePostIsGif(post);

    const creator = await getCreatorUser();
    const embedMessage = new MessageEmbed();
    embedMessage.setTitle(`${post.id} posted by ${post.owner}`);
    embedMessage.setURL(url);
    embedMessage.setColor(RULE34_RATING[post.rating]);

    if (isPostMp4) {
        embedMessage.setImage(post.sample_url);
        embedMessage.addField(
            'Notice',
            "Discord don't support videos on the embed messages. Also there are limit for the file size, that's why video may not attached as file"
        );
    } else {
        if (isPostGif) {
            embedMessage.addField(
                'Notice',
                `Unfortunately discord compress gifs when renders them which results and much worse quality. Link for the best quality: ${post.file_url}`
            );
            if (allowFileAsAttachment) {
                embedMessage.attachFiles([post.file_url]);
            } else {
                embedMessage.setImage(post.file_url);
            }
        } else {
            embedMessage.setImage(post.file_url);
        }
    }

    embedMessage.addField('Up votes', post.score, true);

    const tags = post.tags.split(' ');
    embedMessage.addField('Tags', `\`\`\`${tags.join(', ').slice(0, 1010)}\`\`\``, true);

    const originalImageUrl = await fetchRule34PostOriginalImageUrlById(post.id.toString());
    originalImageUrl && embedMessage.addField('Original', originalImageUrl);

    embedMessage.setTimestamp(unix(post.change).toDate());
    embedMessage.setFooter(`Shefi was created by ${creator.username}`, creator.avatarURL());

    if (isPostMp4 && allowFileAsAttachment) {
        embedMessage.attachFiles([post.file_url]);
    }
    return embedMessage;
};