import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PostState } from "../store";

interface Props
{
    readonly post: PostState;
}

export class Post extends ClassComponent<Props>
{
    public render()
    {
        const { title, contents } = this.props.post;

        return <div onclick={this.onClick}>
            <h2>{title}</h2>
            <p>{contents}</p>
        </div>
    }

    private onClick = () =>
    {
        alert('Clicked!');
    }
}