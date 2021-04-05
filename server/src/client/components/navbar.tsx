import { ClassComponent, vdom } from "simple-tsx-vdom";
import { PageId, PageState, setDarkTheme, setEnableRipples, store } from "../store";
import CircleButton from "./circle-button";
import Menu from "./menu";
import NavbarPageButton from "./navbar-page-button";
import './navbar.scss';

interface Props
{
    readonly selectedPageId: PageId;
    readonly pages: PageState[];
    readonly darkTheme: boolean;
    readonly ripplesEnabled: boolean;
    readonly onPageChange: (page: PageState) => void;
}

export class Navbar extends ClassComponent<Props>
{
    public render()
    {
        const { pages, selectedPageId, darkTheme, ripplesEnabled } = this.props;

        return <nav class='navbar'>
            <h1>Alan Lawrey</h1>
            <div class='navbar__page-buttons'>
                { pages.map(page => <NavbarPageButton active={page.id === selectedPageId} page={page} onClick={this.onClickPage} />) }
            </div>

            <Menu>
                <CircleButton icon='theme' text={`${darkTheme ? 'Light' : 'Dark'} Theme`} onclick={this.toggleDarkTheme} active={darkTheme} />
                <CircleButton icon='ripples' text='Ripples' disableIcon={!ripplesEnabled} onclick={this.toggleRipples} />
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

    private toggleRipples = () =>
    {
        store.execute(setEnableRipples(!this.props.ripplesEnabled));
    }
}