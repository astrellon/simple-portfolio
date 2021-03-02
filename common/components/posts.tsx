import { FunctionalComponent, vdom } from "simple-tsx-vdom";
import { PostState } from "../store";
import { Post } from "./post";

interface Props
{
    readonly posts: PostState[];
}

export const Posts: FunctionalComponent<Props> = (props: Props) =>
{
    const { posts } = props;
    if (!posts)
    {
        return null;
    }

    return <div>
        {posts.map(post => <Post key={post.id} post={post} />)};
    </div>
}