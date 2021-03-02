import { ClassComponent, vdom } from "simple-tsx-vdom";
import { Category } from "../store";

interface Props
{
    readonly categories: Category[];
}

export class Navbar extends ClassComponent<Props>
{
    public render()
    {
        const { categories } = this.props;

        return <nav>
            <h1>Simple CMS</h1>
            <div>
                { categories.map(category => <button data-category-id={category.id} onclick={this.onClickCategory}>{category.title}</button>)}
            </div>
        </nav>
    }

    private onClickCategory = (e: MouseEvent) =>
    {
        console.log(e.target);
    }
}