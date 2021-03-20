import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostPictureState } from "../store";
import './post-picture.scss';

interface Props
{
    readonly picture: PostPictureState;
}

export class PostPicture extends ClassComponent<Props>
{
    public render()
    {
        const { position, url, caption } = this.props.picture;

        return <div class={`post-picture is--${position}`}>
            <img src={url} />
            {caption && <div class='post-picture__caption'>{caption}</div>}
        </div>
    }
}