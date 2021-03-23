import { RemoveListener } from "simple-signals";
import { ClassComponent, FinishUnmountHandler, vdom } from "simple-tsx-vdom";
import Ripples from "../ripples/ripples";
import { store } from "../store";
import './ripples-comp.scss';
import { hoverOutElement, hoverOverElement } from "./signals";

interface Props
{
    readonly darkTheme: boolean;
}

export default class RipplesComp extends ClassComponent<Props>
{
    private ripple: Ripples | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private removeOnHoverOver: RemoveListener | null = null;
    private removeOnHoverOut: RemoveListener | null = null;
    private darkTheme?: boolean;

    private hoverCount: number = 0;

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
            this.checkBackground(store.state().darkTheme);
        }

        window.addEventListener('resize', this.onResize);

        this.removeOnHoverOver = hoverOverElement.add(this.onHoverOver);
        this.removeOnHoverOut = hoverOutElement.add(this.onHoverOut);
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
        this.checkBackground(this.props.darkTheme);
        return <canvas class='ripples' />;
    }

    private checkBackground = (nowDarkTheme: boolean) =>
    {
        if (this.ripple && nowDarkTheme !== this.darkTheme)
        {
            const url = nowDarkTheme ? '/assets/gridDark.png' : '/assets/gridBlue.png';
            this.ripple.loadBackground(url);
            this.darkTheme = nowDarkTheme;
        }
    }

    private onHoverOver = (element: HTMLElement) =>
    {
        if (!this.ripple)
        {
            return;
        }

        this.hoverCount++;
        this.onHoverElement(element, 0.01);
    }

    private onHoverOut = (element: HTMLElement) =>
    {
        if (!this.ripple)
        {
            return;
        }

        this.hoverCount--;
        this.onHoverElement(element, -0.01);
    }

    private onHoverElement = (element: HTMLElement, strength: number) =>
    {
        if (!this.ripple)
        {
            return;
        }

        this.ripple.interactive = this.hoverCount <= 0;
        const bounds = element.getBoundingClientRect();
        this.ripple.dropQuad(bounds.x, bounds.y, bounds.width, bounds.height, strength);
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