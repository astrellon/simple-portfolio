import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PageState } from "../store";
import "./navbar-page-button.scss";

interface Props
{
    readonly page: PageState;
    readonly onClick: (page: PageState) => void;
}

export default class NavbarPageButton extends ClassComponent<Props>
{
    public render()
    {
        const { page } = this.props;

        return <button class='navbar-page-button' onclick={this.onClick}>{page.title}</button>
    }

    private onClick = () =>
    {
        this.props.onClick(this.props.page);
    }
}