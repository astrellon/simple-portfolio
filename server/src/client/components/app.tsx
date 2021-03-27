import '../normalize.css';
import '../styles.scss';
import '../grid.scss';
import './app.scss';

import { FunctionalComponent, vdom } from "simple-tsx-vdom";
import { PageId, PageState, setSelectedPageId, State, store, WindowHistory } from "../store";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Posts } from "./posts";
import RipplesComp from './ripples-comp';

interface Props
{
    readonly state: State;
}

export const App: FunctionalComponent<Props> = (props: Props) =>
{
    const { pages, posts, selectedPageId, darkTheme, postsHeight } = props.state;

    // The extra div around posts is for handling the unmounting stage and we don't want the old posts to be suddenly after the footer (which would push it up).

    return <div class='app-wrapper'>
        <main class='container app'>
            <Navbar selectedPageId={selectedPageId} pages={pages} onPageChange={onPageChange} darkTheme={darkTheme} />
            <div>
                <Posts key={selectedPageId} category={pages.find(c => c.id === selectedPageId)} posts={posts[selectedPageId]} />
            </div>
            <div class='app__spacer' style={{'min-height': postsHeight + 'px'}}/>
            <Footer />
        </main>
        <RipplesComp darkTheme={darkTheme} />
    </div>
}

function onPageChange(page: PageState)
{
    const pushedState: WindowHistory =
    {
        pageId: page.id
    }

    window.history.pushState(pushedState, page.title, `/${page.id}`);
    store.execute(setSelectedPageId(page.id));
}