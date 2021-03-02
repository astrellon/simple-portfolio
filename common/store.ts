export type PostAssetType = 'text' | 'intrinsic' | 'component';

export interface PostAssetAttributes
{
    readonly [key: string]: string;
}

export interface Category
{
    readonly id: string;
    readonly title: string;
}

export interface PostPictureState
{
    readonly url: string;
    readonly position: 'left' | 'right' | 'center';
}

export interface PostParagraphState
{
    readonly text?: string;
    readonly pictures: PostPictureState[];
}

export interface PostState
{
    readonly id: string;
    readonly categoryId: string;
    readonly title: string;
    readonly contents: PostParagraphState[];
}

export interface State
{
    readonly categories: Category[];
    readonly posts: PostState[];
}