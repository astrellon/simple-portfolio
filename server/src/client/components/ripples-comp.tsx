import { RemoveListener } from "simple-signals";
import { ClassComponent, FinishUnmountHandler, vdom } from "simple-tsx-vdom";
import Ripples from "../ripples/ripples";
import './ripples-comp.scss';
import { hoverOutElement, hoverOverElement } from "./signals";

interface Props
{
}

export default class RipplesComp extends ClassComponent<Props>
{
    private ripple: Ripples | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private removeOnHoverOver: RemoveListener | null = null;
    private removeOnHoverOut: RemoveListener | null = null;

    public onMount()
    {
        if (typeof window === 'undefined')
        {
            return;
        }

        this.canvas = this.rootDomNode() as HTMLCanvasElement;

        if (this.canvas)
        {
            this.onResize();
            this.ripple = new Ripples(this.canvas, 512);
            this.ripple.loadBackground('/assets/bg2.jpg');
        }

        window.addEventListener('resize', this.onResize);

        this.removeOnHoverOver = hoverOverElement.add(this.onHoverElement);
        this.removeOnHoverOut = hoverOutElement.add(this.onHoverElement);
    }

    public onUnmount(finished: FinishUnmountHandler)
    {
        window.removeEventListener('resize', this.onResize);

        if (this.removeOnHoverOver) this.removeOnHoverOver();
        if (this.removeOnHoverOut) this.removeOnHoverOut();

        finished();
    }

    public render()
    {
        return <canvas class='ripples' />
    }

    private onHoverElement = (element: HTMLElement) =>
    {
        if (!this.ripple)
        {
            return;
        }

        const bounds = element.getBoundingClientRect();
        console.log('Hover change', element, bounds);
        this.ripple.dropQuad(bounds.x, bounds.y, bounds.width, bounds.height, 0.005);
    }

    private onResize = () =>
    {
        if (this.canvas)
        {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
}