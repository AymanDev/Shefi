import { CommandHandler } from '../types';

const handler: CommandHandler = async message => {
    await message.channel.send(
        'Bot can parse rule34 links and make embed message with some info, original images and etc.'
    );
};

export default handler;