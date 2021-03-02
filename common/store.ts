import DataStore, { Modifier } from 'simple-data-store';
import { Editable, Opaque } from './common-types';

export type PostAssetType = 'text' | 'intrinsic' | 'component';
export type CategoryId = Opaque<string, 'CategoryId'>;

export interface PostAssetAttributes
{
    readonly [key: string]: string;
}

export interface Category
{
    readonly id: CategoryId;
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
    readonly categoryId: CategoryId;
    readonly title: string;
    readonly contents: PostParagraphState[];
}

export interface PostStateMap
{
    readonly [category: string]: PostState[];
}

export interface State
{
    readonly categories: Category[];
    readonly posts: PostStateMap;
    readonly selectedCategoryId: string;
}

///////

export function setPosts(newPosts: PostState[]): Modifier<State>
{
    return () =>
    {
        const posts: Editable<PostStateMap> = {};
        for (const post of newPosts)
        {
            const list = posts[post.categoryId] || (posts[post.categoryId] = [])
            list.push(post);
        }
        return { posts }
    }
}

export function setCategories(categories: Category[]): Modifier<State>
{
    return () => { return { categories } }
}

export function setSelectedCategoryId(categoryId: CategoryId): Modifier<State>
{
    return () => { return {selectedCategoryId: categoryId } }
}

///////

export let store: DataStore<State>;

export function setStore(s: DataStore<State>)
{
    store = s;
}