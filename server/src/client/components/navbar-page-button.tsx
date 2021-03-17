import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PageState } from "../store";
import Button from "./button";

interface Props
{
    readonly active: boolean;
    readonly page: PageState;
    readonly onClick: (page: PageState) => void;
}

export default class NavbarPageButton extends ClassComponent<Props>
{
    public render()
    {
        const { page, active } = this.props;

        return <Button active={active} onClick={this.onClick}>{page.title}</Button>
    }

    private onClick = () =>
    {
        this.props.onClick(this.props.page);
    }
}