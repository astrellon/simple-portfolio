import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostPictureState } from "../store";
import './post-picture.scss';
import { hoverOutElement, hoverOverElement } from "./signals";

interface Props
{
    readonly picture: PostPictureState;
}

export class PostPicture extends ClassComponent<Props>
{
    public render()
    {
        const { url, caption, dimension } = this.props.picture;

        const extraProps: { [key: string]: any } = {};
        if (dimension)
        {
            const aspectRatio = dimension.width / dimension.height;
            let width = 360;
            let height = width / aspectRatio;
            if (height > 420)
            {
                height = 420;
                width = height * aspectRatio;
            }
            extraProps.width = width;
            extraProps.height = height;
        }

        return <div class='post-picture' onmouseenter={this.onMouseEnter} onmouseleave={this.onMouseLeave}>
            <img loading='lazy' src={url} alt={caption} {...extraProps} />
            {caption && <div class='post-picture__caption'>{caption}</div>}
        </div>
    }

    private onMouseEnter = (e: MouseEvent) =>
    {
        const el = e.target as HTMLElement;
        hoverOverElement.trigger(el);
    }

    private onMouseLeave = (e: MouseEvent) =>
    {
        const el = e.target as HTMLElement;
        hoverOutElement.trigger(el);
    }
}