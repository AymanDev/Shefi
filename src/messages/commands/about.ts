import { CommandHandler } from '../types';
import registerCommand from './factory';

const handler: CommandHandler = async message => {
    await message.channel.send(
        'Bot can parse rule34 links and make embed message with some info, original images and etc.'
    );
};

registerCommand('about', handler);
