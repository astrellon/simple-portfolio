import { FunctionalComponent, vdom } from "simple-tsx-vdom";
import { State } from "../store";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Posts } from "./posts";

interface Props
{
    readonly state: State;
}

export const App: FunctionalComponent<Props> = (props: Props) =>
{
    const { pages: categories, posts, selectedPageId: selectedCategoryId } = props.state;

    return <main>
        <Navbar categories={categories} />
        <Posts category={categories.find(c => c.id === selectedCategoryId)} posts={posts[selectedCategoryId]} />
        <Footer />
    </main>
}