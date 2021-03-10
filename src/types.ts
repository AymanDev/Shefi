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
export type Rule34Response = Post[];