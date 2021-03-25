import { ClassComponent, vdom } from "simple-tsx-vdom";
import "./footer.scss";

interface Props
{
    readonly postsHeight: number;
}

export class Footer extends ClassComponent<Props>
{
    private footerHeight: number = 0;

    public onMount()
    {
        if (typeof(window) !== 'undefined')
        {
            setTimeout(() =>
            {
                const domElement = this.rootDomNode() as HTMLElement;
                if (!domElement)
                {
                    return;
                }

                this.footerHeight = domElement.getBoundingClientRect().height;
                this.forceUpdate();
            })
        }
    }
    public render()
    {
        const { postsHeight } = this.props;

        let top = 0;
        if (typeof(window) !== 'undefined')
        {
            top = Math.max(postsHeight + 94, window.innerHeight) - this.footerHeight;
        }

        const style = {
            'top': top + 'px'
        }
        return <footer class='footer' style={style}>
            Alan Lawrey 2021
        </footer>
    }
}