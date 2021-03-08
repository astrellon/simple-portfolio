import { FunctionalComponent, vdom } from "simple-tsx-vdom";
import { Category, PostState } from "../store";
import { Post } from "./post";

interface Props
{
    readonly category?: Category;
    readonly posts: PostState[];
}

export const Posts: FunctionalComponent<Props> = (props: Props) =>
{
    const { posts, category } = props;

    return <div>
        { category &&
        <h2>{category.title}</h2> }
        {posts && posts.map(post => <Post key={post.id} post={post} />)};
    </div>
}