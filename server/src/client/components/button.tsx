import { ClassComponent, vdom } from "simple-tsx-vdom";
import "./button.scss";

interface Props<T>
{
    readonly active: boolean;
    readonly class: string;
    readonly onClick: (clickData?: T) => void;
    readonly clickData?: T;
}

export default class Button<T = void> extends ClassComponent<Props<T>>
{
    public render()
    {
        const { active } = this.props;

        return <button class={`button ${this.props.class}${active ? ' is--active' : ''}`} onclick={this.onClick}>{this.children}</button>
    }

    private onClick = () =>
    {
        this.props.onClick(this.props.clickData);
    }
}