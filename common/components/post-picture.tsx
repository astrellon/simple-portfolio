import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostPictureState } from "../store";

interface Props
{
    readonly picture: PostPictureState;
}

export class PostPicture extends ClassComponent<Props>
{
    public render()
    {
        const { position, url } = this.props.picture;

        return <img src={url} />
    }
}