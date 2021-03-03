import { Emoji, Guild } from 'discord.js';
import { getEmojiGuild } from './utils';

export const getGuildEmoteByName = (guild: Guild, emoteName: string) => {
    return guild.emojis.cache.find(e => e.name === emoteName);
};

class Emote {
    name: string;
    private _emoji: Emoji;

    constructor(name: string) {
        this.name = name;
    }

    get emoji() {
        if (!this._emoji) {
            this._emoji = getGuildEmoteByName(getEmojiGuild(), this.name);
        }
        return this._emoji;
    }
}

export const EMOTES = {
    VANILLA_SMUG: new Emote('vanillaSmug'),
};
