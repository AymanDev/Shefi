import { ColorResolvable } from 'discord.js';

export const HTTPS_REGEX = /(https?:\/\/rule34.xxx\/[^ !\n]*)/;

export const RULE34_BASE_PARAMS = {
    page: 'post',
    s: 'view',
    json: 1,
};
export const RULE34_DETERMINATION = 'https://rule34.xxx/index.php?page=post';
export const RULE34_MAX_TAGS_COUNT = 5;
export const RULE34_API_BASE_PARAMS = {
    page: 'dapi',
    s: 'post',
    q: 'index',
    json: 1,
};

export const RULE34_RATING: Record<string, ColorResolvable> = {
    'explicit': 'RED',
    'questionable': 'YELLOW',
};

export const RULE34_API_ENDPOINT = 'https://rule34.xxx/index.php';

export const COMMAND_PREFIX = 's!';
