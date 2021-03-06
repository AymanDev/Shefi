import axios from 'axios';
import { load } from 'cheerio';
import { URL } from 'url';

import { RULE34_API_BASE_PARAMS, RULE34_API_ENDPOINT, RULE34_BASE_PARAMS } from '../consts';
import { Rule34Response } from '../types';

/**
 * Fetching post info from rule34 html url via API
 * 
 * @param url Url for rule34 post
 * @returns Api response with post
 */
export const fetchRule34PostByUrl = async (url: string) => {
    const { searchParams } = new URL(url);
    const id = searchParams.get('id');
    const { data } = await axios.get<Rule34Response>(RULE34_API_ENDPOINT, {
        params: { ...RULE34_API_BASE_PARAMS, id },
    });
    return data[0];
};

/**
 * Fetching html page from rule34 for parsing info from page which don't get returned in API
 * 
 * @param id Id of the rule34 post
 * @returns Link for source of the post
 */
export const fetchRule34PostOriginalImageUrlById = async (id: string) => {
    const { data } = await axios.get(RULE34_API_ENDPOINT, { params: { ...RULE34_BASE_PARAMS, id } });
    const $ = load(data);

    return $("li:contains('Source:') > a").attr('href');
};
