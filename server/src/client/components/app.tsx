import "../normalize.css";
import "../styles.scss";
import "../grid.scss";
import "./app.scss";

import { FunctionalComponent, vdom } from "simple-tsx-vdom";
import { PageId, PageState, setSelectedPageId, State, store, WindowHistory } from "../store";
import { Navbar } from "./navbar";
import { Posts } from "./posts";
import RipplesComp from "./ripples-comp";
import { AllIcons } from "./icon";
import MobileNavbar from "./mobile-navbar";
import smoothscroll from "smoothscroll-polyfill"

interface Props
{
    readonly state: State;
}

if (typeof(window) !== 'undefined')
{
    smoothscroll.polyfill();
}

export const App: FunctionalComponent<Props> = (props: Props) =>
{
    const { pages, posts, selectedPageId, darkTheme, postsHeight, isMobile, ripplesEnabled, backgrounds } = props.state;

    // The extra div around posts is for handling the unmounting stage and we don't want the old posts to be suddenly after the footer (which would push it up).

    return <div class='app-wrapper'>
        <AllIcons />
        <main class='app'>
            { !isMobile && <Navbar
                selectedPageId={selectedPageId}
                pages={pages}
                onPageChange={onPageChange}
                darkTheme={darkTheme}
                ripplesEnabled={ripplesEnabled} /> }

            <div class='container'>
                <Posts key={selectedPageId} category={pages.find(c => c.id === selectedPageId)} posts={posts[selectedPageId]} />
            </div>
            <div class='app__spacer' style={{'min-height': postsHeight + 'px'}}/>
            { isMobile && <div class='app__mobile-spacer'/> }
            { isMobile && <MobileNavbar selectedPageId={selectedPageId} pages={pages} onPageChange={onPageChange} /> }
        </main>

        { ripplesEnabled &&
        <RipplesComp darkTheme={darkTheme} backgrounds={backgrounds} /> }
    </div>
}

function onPageChange(page: PageState)
{
    const pushedState: WindowHistory =
    {
        pageId: page.id
    }

    window.history.pushState(pushedState, page.title, `/${page.id}`);
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: 0
    });

    scrollCheckTo(page.id);
}

function scrollCheckTo(pageId: PageId)
{
    const scrollTop = document.body.parentElement?.scrollTop || 0;
    if (Math.abs(scrollTop) < 5)
    {
        store.execute(setSelectedPageId(pageId));
    }
    else
    {
        setTimeout(() => scrollCheckTo(pageId), 10);
    }
}