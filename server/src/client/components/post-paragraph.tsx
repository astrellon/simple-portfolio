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

        return <div class={`post-paragraph is--${picturePosition || 'right'}`}>

            { (text || list || links) && <div class='post-paragraph__text-content'>
                { text &&
                    text.map(t => <div><FormattedText text={t} /></div>) }
                { list && <ul>
                    {list.map(item => <li><FormattedText text={item} /></li>)}
                </ul>}
                { links && <div class='post-paragraph__links'>
                    { links.map(link => <PostLink link={link} />) }
                </div> }
            </div>}

            { pictures && <div class='post-paragraph__pictures'>
                { pictures.map(picture => <PostPicture picture={picture} />) }
            </div> }

        </div>
    }

}