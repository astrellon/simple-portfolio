import '../normalize.css';
import '../styles.scss';
import '../grid.scss';

import { FunctionalComponent, vdom } from "simple-tsx-vdom";
import { PageState, setSelectedPageId, State, store, WindowHistory } from "../store";
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

    return <div>
        <main class='container'>
            <Navbar selectedPageId={selectedPageId} pages={pages} onPageChange={onPageChange} darkTheme={darkTheme} />
            <Posts key={selectedPageId} category={pages.find(c => c.id === selectedPageId)} posts={posts[selectedPageId]} />
            <Footer postsHeight={postsHeight} />
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