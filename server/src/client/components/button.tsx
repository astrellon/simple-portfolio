import { ClassComponent, vdom } from "simple-tsx-vdom";
import "./button.scss";
import { hoverOutElement, hoverOverElement } from "./signals";

interface Props<T>
{
    readonly active?: boolean;
    readonly class?: string;
    readonly onClick: (clickData?: T) => void;
    readonly clickData?: T;
}

export default class Button<T = void> extends ClassComponent<Props<T>>
{
    public render()
    {
        const { active } = this.props;

        return <button onmouseenter={this.onMouseEnter} onmouseleave={this.onMouseLeave} class={`button ${this.props.class || ''}${active ? ' is--active' : ''}`} onclick={this.onClick}>{this.children}</button>
    }

    private onClick = () =>
    {
        this.props.onClick(this.props.clickData);
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