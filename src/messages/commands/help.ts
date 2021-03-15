import { EMOTES } from '../../guilds/emotes';
import { CommandHandler } from '../types';

const handler: CommandHandler = async message => {
    await message.channel.send(
        [
            '* s!about - some info about this bot',
            `* React with ${EMOTES.VANILLA_SMUG.emoji} on bot rule34 embed message to save post in DM`,
            '* Questions, issues and etc here: https://github.com/AymanDev/Shefi',
        ],
        {}
    );
};

export default handler ;