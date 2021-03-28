import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostParagraphState } from "../store";
import { PostPicture } from "./post-picture";
import "./post-paragraph.scss";
import PostLink from "./post-link";
import FormattedText from "./formatted-text";

interface Props
{
    readonly content: PostParagraphState;
}

export class PostParagraph extends ClassComponent<Props>
{
    public render()
    {
        const { text, pictures, list, picturePosition, links } = this.props.content;

        return <div class='post-paragraph'>
            { pictures && <div class={`post-paragraph__pictures is--${picturePosition || 'right'}`}>
                { pictures.map(picture => <PostPicture picture={picture} />) }
            </div> }
            { text && <FormattedText text={text} /> }
            { list && <ul>
                {list.map(item => <li><FormattedText text={item} /></li>)}
            </ul>}
            { links && <div class='post-paragraph__links'>
                { links.map(link => <PostLink link={link} />) }
            </div> }
        </div>
    }

}