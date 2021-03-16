import { CommandHandler } from '../types';

const handler: CommandHandler = async (message, clearedContent) => {
    const { channel, mentions } = message;

    await message.delete();
    if (mentions.channels.size === 0) {
        await channel.send('You have to mention text channel once somewhere in the text!');
        return;
    }

    const textChannel = mentions.channels.first();

    const text = clearedContent.replace(`say ${textChannel.toString()} `, '');

    await textChannel.send(text);
};

export default handler;
