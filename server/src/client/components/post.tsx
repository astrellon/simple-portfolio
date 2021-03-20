import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostState } from "../store";
import { PostParagraph } from "./post-paragraph";
import './post.scss';

interface Props
{
    readonly post: PostState;
}

export class Post extends ClassComponent<Props>
{
    public render()
    {
        const { title, contents } = this.props.post;

        return <div class='post'>
            <h2>{title}</h2>
            <div>{contents.map(content => <PostParagraph content={content} />)}</div>
        </div>
    }
}