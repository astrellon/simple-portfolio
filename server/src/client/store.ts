import DataStore, { Modifier } from 'simple-data-store';
import { Editable, Opaque } from './common-types';

export type PostAssetType = 'text' | 'intrinsic' | 'component';
export type PageId = Opaque<string, 'PageId'>;
export type Url = Opaque<string, 'Url'>;

export interface PostAssetAttributes
{
    readonly [key: string]: string;
}

export interface PageState
{
    readonly id: PageId;
    readonly title: string;
    readonly singlePage: boolean;
}

export interface PageStored extends PageState
{
    readonly type: "page";
    readonly defaultPage?: boolean;
}

export interface PostPictureState
{
    readonly url: Url;
    readonly fullSizeUrl?: Url;
    readonly caption: string;
}

export interface PostLinkState
{
    readonly url: Url;
    readonly icon: string;
}

export interface PostParagraphState
{
    readonly text?: string;
    readonly list?: string[];
    readonly pictures?: PostPictureState[];
    readonly picturePosition?: 'left' | 'right' | 'center';
    readonly links?: PostLinkState[];
}

export interface PostState
{
    readonly id: string;
    readonly pageId: PageId;
    readonly title: string;
    readonly contents: PostParagraphState[];
}

export interface PostStored extends PostState
{
    readonly type: "post";
}

export interface PostStateMap
{
    readonly [pageId: string]: PostState[];
}

export interface State
{
    readonly pages: PageState[];
    readonly posts: PostStateMap;
    readonly selectedPageId: string;
    readonly darkTheme: boolean;
    readonly postsHeight: number;
}

export type DataStored = PageStored | PostStored;

export interface WindowHistory
{
    readonly pageId: PageId;
}

///////

export function setPosts(newPosts: PostState[]): Modifier<State>
{
    return () =>
    {
        const posts: Editable<PostStateMap> = {};
        for (const post of newPosts)
        {
            const list = posts[post.pageId] || (posts[post.pageId] = [])
            list.push(post);
        }
        return { posts }
    }
}

export function setPostsHeight(postsHeight: number): Modifier<State>
{
    return () => { return { postsHeight } }
}

export function setPages(pages: PageState[]): Modifier<State>
{
    return () => { return { pages } }
}

export function setSelectedPageId(pageId: PageId): Modifier<State>
{
    return () => { return { selectedPageId: pageId } }
}

export function addData(newData: DataStored[]): Modifier<State>
{
    return (state: State) =>
    {
        let pages = [...state.pages];
        let posts = {...state.posts};
        let selectedPageId = state.selectedPageId;

        for (const data of newData)
        {
            if (data.type === 'page')
            {
                pages.push(data);
                if (data.defaultPage === true)
                {
                    selectedPageId = data.id;
                }
            }
            else if (data.type === 'post')
            {
                const list = posts[data.pageId] || (posts[data.pageId] = [])
                list.push(data);
            }
        }

        return { pages, posts, selectedPageId }
    }
}

export function setDarkTheme(darkTheme: boolean): Modifier<State>
{
    return () => { return { darkTheme } }
}

///////

export let store: DataStore<State>;

export function setStore(s: DataStore<State>)
{
    store = s;
}