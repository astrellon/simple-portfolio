import { ClassComponent, FinishUnmountHandler, FunctionalComponent, vdom } from "simple-tsx-vdom";
import { PageState, PostState } from "../store";
import { Post } from "./post";
import './posts.scss';

interface Props
{
    readonly category?: PageState;
    readonly posts: PostState[];
}

export class Posts extends ClassComponent<Props>
{
    public onMount()
    {
        const domElement = this.rootDomNode() as HTMLElement;
        if (!domElement)
        {
            return;
        }

        if (typeof window === 'undefined')
        {
            domElement.classList.add('mounted');
        }
        else
        {
            setTimeout(() => domElement.classList.add('mounted'), 0);
        }
    }

    public onUnmount(finishedHandler: FinishUnmountHandler)
    {
        const domElement = this.rootDomNode() as HTMLElement;
        if (!domElement)
        {
            finishedHandler();
            return;
        }

        domElement.classList.remove('mounted');
        domElement.classList.add('unmounted');

        setTimeout(finishedHandler, 300);
    }

    public render()
    {
        const { posts, category } = this.props;

        return <div class='posts'>
            <div class='posts__content'>
                {category && !category.singlePage &&
                    <h2>{category.title}</h2>}
                {posts && posts.map(post => <Post key={post.id} post={post} />)}
            </div>
        </div>
    }
}