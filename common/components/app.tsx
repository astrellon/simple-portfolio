import { FunctionalComponent, vdom } from "simple-tsx-vdom";
import { PageState, setSelectedPageId, State, store, WindowHistory } from "../store";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Posts } from "./posts";

interface Props
{
    readonly state: State;
}

export const App: FunctionalComponent<Props> = (props: Props) =>
{
    const { pages, posts, selectedPageId } = props.state;

    return <main>
        <Navbar pages={pages} onPageChange={onPageChange} />
        <Posts category={pages.find(c => c.id === selectedPageId)} posts={posts[selectedPageId]} />
        <Footer />
    </main>
}

function onPageChange(page: PageState)
{
    const pushedState: WindowHistory = {
        pageId: page.id
    }

    window.history.pushState(pushedState, page.title, `/${page.id}`);
    store.execute(setSelectedPageId(page.id));
}