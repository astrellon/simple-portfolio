import { ClassComponent, vdom } from "simple-tsx-vdom";
import CircleButton from "./circle-button";
import "./menu.scss";

interface Props
{
    readonly class?: string;
}

export default class Menu extends ClassComponent<Props>
{
    private showMenu: boolean = false;

    public render()
    {
        const classNames = 'menu ' + (this.props.class || '');

        return <div class={classNames}>
            <CircleButton onclick={this.toggleMenu} icon='cog' />

            { this.showMenu && <div class='menu__dropdown'>
                { this.children.map(c => <div class='menu__row'>{c}</div>) }
            </div> }
        </div>
    }

    private toggleMenu = () =>
    {
        this.showMenu = !this.showMenu;
        this.forceUpdate();
    }
}