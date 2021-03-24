import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostParagraphState } from "../store";
import { PostPicture } from "./post-picture";
import "./post-paragraph.scss";

interface Props
{
    readonly content: PostParagraphState;
}

export class PostParagraph extends ClassComponent<Props>
{
    public render()
    {
        const { text, pictures, list, picturePosition } = this.props.content;

        return <div>
            { pictures && <div class={`post-paragraph__pictures is--${picturePosition || 'right'}`}>
                { pictures.map(picture => <PostPicture picture={picture} />) }
            </div> }
            { text }
            { list && <ul>
                {list.map(item => <li>{item}</li>)}
            </ul>}
        </div>
    }
}