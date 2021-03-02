import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostParagraphState } from "../store";
import { PostPicture } from "./post-picture";

interface Props
{
    readonly content: PostParagraphState;
}

export class PostParagraph extends ClassComponent<Props>
{
    public render()
    {
        const { text, pictures } = this.props.content;

        return <p>
            { text }
            { pictures.map(picture => <PostPicture picture={picture} />) }
        </p>
    }
}