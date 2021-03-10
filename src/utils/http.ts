import { URL } from 'url';
import axios from 'axios';
import { Rule34Response } from '../types';
import { RULE34_API_BASE_PARAMS, RULE34_API_ENDPOINT, RULE34_BASE_PARAMS } from '../consts';
import { load } from 'cheerio';

export const fetchRule34PostByUrl = async (url: string) => {
    const { searchParams } = new URL(url);
    const id = searchParams.get('id');
    const { data } = await axios.get<Rule34Response>(RULE34_API_ENDPOINT, {
        params: { ...RULE34_API_BASE_PARAMS, id },
    });
    return data[0];
};

export const fetchRule34PostOriginalImageUrlById = async (id: string) => {
    const { data } = await axios.get(RULE34_API_ENDPOINT, { params: { ...RULE34_BASE_PARAMS, id } });
    const $ = load(data);

    return $("li:contains('Source:') > a").attr('href');
};
