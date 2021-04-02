import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PageId, PageState, setDarkTheme, store } from "../store";
import Button from "./button";
import CircleButton from "./circle-button";
import Menu from "./menu";
import NavbarPageButton from "./navbar-page-button";
import './navbar.scss';

interface Props
{
    readonly selectedPageId: PageId;
    readonly pages: PageState[];
    readonly darkTheme: boolean;
    readonly onPageChange: (page: PageState) => void;
}

export class Navbar extends ClassComponent<Props>
{
    public render()
    {
        const { pages, selectedPageId, darkTheme } = this.props;

        return <nav class='navbar'>
            <h1>Alan Lawrey</h1>
            <div class='navbar__page-buttons'>
                { pages.map(page => <NavbarPageButton active={page.id === selectedPageId} page={page} onClick={this.onClickPage} />) }
            </div>

            <Menu>
                <CircleButton icon='cog' text={`${darkTheme ? 'Light' : 'Dark'} Theme`} onclick={this.toggleDarkTheme} />
                <CircleButton icon='cog' text='Ripples' />
            </Menu>
        </nav>
    }

    private onClickPage = (page: PageState) =>
    {
        this.props.onPageChange(page);
    }

    private toggleDarkTheme = () =>
    {
        store.execute(setDarkTheme(!this.props.darkTheme));
    }
}