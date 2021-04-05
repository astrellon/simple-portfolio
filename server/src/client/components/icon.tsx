import { ClassComponent, FinishUnmountHandler, vdom } from "simple-tsx-vdom";
import "./icon.scss";

export type IconType = 'github' | 'npm' | 'youtube' | 'cog' | 'ripples' | 'theme';

interface Props
{
    readonly icon: IconType;
    readonly size?: number;
    readonly class?: string;
    readonly active?: boolean;
    readonly disabled?: boolean;
}

interface ThemeProps
{
    readonly class?: string;
}

const classesToAdd: { readonly [iconType: string]: string } = {
    'npm': 'has-fill',
    'github': 'fill-on-hover has-stroke',
    'cog': 'fill-on-hover has-stroke',
    'youtube': 'fill-on-hover has-stroke',
    'ripples': 'has-fill',
    'theme': 'theme-icon has-stroke'
}

const svgXmlNs = "http://www.w3.org/2000/svg";
const viewbox = "0 0 512 512";

export default class Icon extends ClassComponent<Props>
{
    public render()
    {
        const { icon, size, active, disabled } = this.props;

        const style: any = {}
        if (typeof(size) === 'number' && isFinite(size))
        {
            style['width'] = style['height'] = `${size}px`;
        }

        const classNames = `icon ${this.props.class || ''} ${classesToAdd[icon] || ''} ${active ? 'active' : ''}`;

        if (icon === 'theme')
        {
            return <ThemeIcon class={classNames} />
        }
        return <svg xmlns={svgXmlNs} style={style} viewBox={viewbox} class={classNames}>
            <use href={`#${icon}`}></use>
            { disabled && <DisableIcon /> }
        </svg>
    }
}

class ThemeIcon extends ClassComponent<ThemeProps>
{
    public render()
    {
        const classNames = this.props.class;
        if (classNames?.includes('active'))
        {
            setTimeout(() => this.gotoMoon());
        }
        else
        {
            setTimeout(() => this.gotoSun());
        }

        return <svg class={classNames || ''} xmlns={svgXmlNs} viewBox={viewbox}>
            <g>
                <animateTransform class='begin-animation' attributeName="transform" type="rotate" dur="0.5" repeatCount="1" fill="freeze" calcMode="spline" begin="indefinite" keySplines="0.7 0 0.3 1" values="0 256 512 ; 180 256 512"/>
                <animateTransform class='end-animation' attributeName="transform" type="rotate" dur="0.5" repeatCount="1" fill="freeze" calcMode="spline" begin="indefinite" keySplines="0.7 0 0.3 1" values="180 256 512 ; 360 256 512"/>

                <path d="m291 571a187 187 0 00-187 187 187 187 0 00187 187 187 187 0 0098.51-28 164 164 0 01-125.5-159 164 164 0 01125-159 187 187 0 00-98-28z" stroke-linecap="round" />
                <circle cx="256" cy="256" r="88" />
                <g stroke-linecap="round">
                    <path d="m256 44v81" />
                    <path d="m406 106-57.5 57.5" />
                    <path d="m468 256h-81" />
                    <path d="m406 406-57.5-57.5" />
                    <path d="m256 468v-81" />
                    <path d="m106 106 57.5 57.5" />
                    <path d="m44 256h81" />
                    <path d="m106 406 57.5-57.5" />
                    <path d="m256 44v81" />
                </g>
            </g>
        </svg>
    }

    private gotoMoon = () =>
    {
        const beginAni = (this.rootDomNode()?.parentElement as HTMLElement)?.querySelector('.begin-animation') as SVGAnimateTransformElement;
        if (beginAni)
        {
            (beginAni as any).beginElement();
        }
    }

    private gotoSun = () =>
    {
        const endAni = (this.rootDomNode()?.parentElement as HTMLElement)?.querySelector('.end-animation') as SVGAnimateTransformElement;
        if (endAni)
        {
            (endAni as any).beginElement();
        }
    }
}

class DisableIcon extends ClassComponent
{
    private path: SVGPathElement | null = null;

    public onMount()
    {
        const domElement = this.rootDomNode() as HTMLElement;
        if (!domElement)
        {
            return;
        }

        this.path = domElement.querySelector('path');

        if (typeof window === 'undefined')
        {
            this.path?.classList.add('mounted');
        }
        else
        {
            setTimeout(() =>
                this.path?.classList.add('mounted') , 50);
        }
    }

    public onUnmount(finishedHandler: FinishUnmountHandler)
    {
        if (!this.path)
        {
            finishedHandler();
            return;
        }

        this.path?.classList.remove('mounted');
        this.path?.classList.add('unmounted');

        setTimeout(finishedHandler, 300);
    }

    public render()
    {
        return <svg xmlns={svgXmlNs} viewBox={viewbox}>
            <path class="disabled-icon" d="M60,60 L452,452" stroke="#a50505" stroke-width="36" />
        </svg>
    }
}

// This keeps all the icons in one SVG atlas which can then be used by id ref by individual Icon components.
export class AllIcons extends ClassComponent
{
    public render()
    {
        return <svg xmlns={svgXmlNs} style={{'display': 'none'}}>
            <defs>
                <g id="github">
                    <path d="m256.04 40.719a12.101 12.101 0 01-.0586.002c-122.18 0-221.01 98.821-221.01 221.04 0 97.422 62.943 179.91 150.26 209.4.38186.0493.69175.0942.87891.10156-.003-3.4698-.11415-15.222-.20508-25.107-27.464 2.7336-47.158-5.0022-59.33-15.113-14.232-11.822-18.799-26.721-18.799-26.721l.32618.9375c-4.7106-11.964-10.209-19.009-14.23-23.041-4.0218-4.0316-5.541-4.543-5.541-4.543a12.101 12.101 0 01-1.6855-.96289c-6.1107-4.173-10.297-7.152-13.012-13.621-1.3576-3.2345-1.7567-8.1312-.04883-12.045 1.7079-3.9138 4.5608-6.0923 6.7617-7.3457 4.4017-2.5068 7.6019-2.7105 10.174-2.9941 2.572-.28365 4.7051-.25391 4.7051-.25391a12.101 12.101 0 01.69727.0293c30.762 2.1653 45.461 30.27 45.461 30.27l-.1543-.26953c8.7038 14.91 17.877 18.479 27.371 19.326 6.9177.61754 14.097-.96515 19.641-2.8203 1.117-4.7619 2.5325-9.1837 4.332-13.15-20.939-4.0467-41.963-11.405-59.438-26.117-22.933-19.308-37.99-51.035-37.99-98.162 0-25.618 8.5952-47.73 22.586-65.25-3.4062-12.042-6.7793-34.8 4.5508-63.455a12.101 12.101 0 017.5586-7.0742s3.2924-.90645 6.8887-1.0723 8.4788.0901 14.646 1.3887c11.453 2.4114 27.524 8.7025 48.361 22.156 18.177-4.5474 37.226-6.9097 56.203-7.0059a12.101 12.101 0 01.13476 0c18.951.11661 37.987 2.4616 56.186 7.0059 20.822-13.453 36.88-19.742 48.324-22.154 6.1631-1.2988 11.042-1.5566 14.637-1.3906 3.5946.16595 6.8867 1.0742 6.8867 1.0742a12.101 12.101 0 017.5508 7.0625c11.354 28.646 7.9789 51.431 4.5938 63.453 14.015 17.535 22.549 39.66 22.549 65.262 0 47.236-15.086 78.97-38.08 98.221-17.459 14.616-38.446 21.904-59.361 25.895 4.2183 9.2458 6.8164 20.618 6.8164 34.104 0 31.009-.2792 55.947-.2832 63.49.20492-.0115.50996-.0576.93555-.11914 87.287-29.535 150.2-111.97 150.2-209.39 0-122.2-98.794-221-220.99-221.04z"/>
                </g>

                <g id="npm">
                    <path d="M227.6 213.1H256v57.1h-28.4z"/><path d="M0 156v171.4h142.2V356H256v-28.6h256V156zm142.2 142.9h-28.4v-85.7H85.3v85.7H28.4V184.6h113.8zm142.2 0h-56.9v28.6h-56.9V184.6h113.8zm199.2 0h-28.4v-85.7h-28.4v85.7h-28.4v-85.7H370v85.7h-56.9V184.6h170.7v114.3z"/>
                </g>

                <g id="youtube">
                    <path d="m254.76 102.98s-35.734-.00038-75.871 1.1914-86.398 4.2719-100.17 7.9629a12.791 12.791 0 01-.0098.004c-15.311 4.091-27.437 16.217-31.529 31.529a12.791 12.791 0 01-.002.008c-4.2204 15.748-6.7922 43.226-7.9727 66.02-1.1805 22.793-1.1816 41.16-1.1816 41.16s-.000768 18.366 1.1797 41.158c1.1805 22.793 3.7538 50.27 7.9746 66.021a12.791 12.791 0 01.0039.008c4.0921 15.312 16.216 27.437 31.529 31.529a12.791 12.791 0 01.0078.004c13.772 3.6901 60.032 6.7707 100.17 7.9629 40.137 1.1922 75.869 1.1914 75.869 1.1914s35.732.00073 75.869-1.1914c40.137-1.1921 86.398-4.2726 100.17-7.9629a12.791 12.791 0 01.008-.004c15.313-4.092 27.434-16.214 31.527-31.529a12.791 12.791 0 010-.006c4.219-15.75 6.7936-43.228 7.9746-66.021 1.181-22.794 1.1816-41.16 1.1816-41.16s-.00086-18.365-1.1816-41.158c-1.1808-22.793-3.7547-50.27-7.9746-66.021a12.791 12.791 0 010-.008c-4.0936-15.313-16.214-27.439-31.525-31.529a12.791 12.791 0 01-.01-.004c-13.77-3.691-60.031-6.7711-100.17-7.9629-40.137-1.1918-75.871-1.1914-75.871-1.1914zm-45.533 66.229a12.791 12.791 0 016.0176 1.707l119.26 68.859a12.791 12.791 0 010 22.152l-119.26 68.857a12.791 12.791 0 01-19.186-11.076v-137.72a12.791 12.791 0 0113.168-12.783z"/>
                </g>

                <g id="cog">
                    <path d="m210.06 28.039-11.908 75.131c-16.509 6.2627-31.895 15.159-45.559 26.342l-71.063-27.27-45.938 79.566 59.236 47.979c-1.474 8.6613-2.2473 17.427-2.3125 26.213.02275 8.8217.75954 17.627 2.2031 26.33l-59.127 47.889 45.938 79.566 71.084-27.279c13.66 11.122 29.029 19.962 45.51 26.18l11.934 75.303h91.875l11.912-75.16c16.5-6.2589 31.877-15.146 45.535-26.32l71.08 27.277 45.939-79.564-59.24-47.982c1.4765-8.6688 2.2511-17.443 2.3164-26.236-.0227-8.814-.75818-17.612-2.1992-26.307l59.123-47.885-45.939-79.566-71.061 27.27c-13.667-11.131-29.045-19.978-45.537-26.199l-11.93-75.275zm45.938 171.23c31.331.00055 56.729 25.398 56.73 56.729-.00055 31.331-25.399 56.729-56.73 56.73-31.331-.00055-56.729-25.399-56.73-56.73.00056-31.331 25.399-56.728 56.73-56.729z"/>
                </g>

                <g id="ripples">
                    <path d="m261.67 56.04c-111.05.000579-201.08 90.026-201.08 201.08.000592 111.05 90.026 201.08 201.08 201.08 26.87-.0713 53.454-5.5275 78.18-16.046-11.413 2.1765-23.004 3.2923-34.623 3.3332-104.03.003-188.37-84.333-188.37-188.37.002-104.03 84.336-188.36 188.37-188.36 11.858.03128 23.687 1.1823 35.329 3.4378-24.937-10.651-51.771-16.147-78.887-16.16zm47.824 33c-52.705-1.2442-101.89 26.381-128.25 72.037-9.5874 16.708-15.729 35.168-18.062 54.29 2.7419-7.868 6.2062-15.465 10.348-22.695 68.975-52.911 138.66-79.791 184.47-49.421 64.587 37.29 86.717 119.88 49.43 184.47-4.27 7.3523-9.2248 14.285-14.798 20.706 15.552-11.664 28.585-26.352 38.314-43.182 39.807-68.952 16.18-157.12-52.772-196.93-20.917-12.077-44.532-18.704-68.678-19.275zm17.669 83.328c5.0987 3.4673 9.8656 7.3989 14.24 11.744 39.036 39.039 39.036 102.33 0 141.37-39.039 39.036-102.33 39.036-141.37 0-4.4394-4.4608-8.4476-9.3309-11.971-14.545 5.3627 13.353 13.37 25.483 23.541 35.661v.009c41.675 41.672 109.24 41.672 150.92 0 41.677-41.676 41.677-109.25 0-150.92-10.109-10.055-22.131-17.983-35.356-23.314z"/>
                </g>
            </defs>
        </svg>
    }
}