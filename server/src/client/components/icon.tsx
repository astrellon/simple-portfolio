import { ClassComponent, vdom } from "simple-tsx-vdom";
import "./icon.scss";

type IconType = 'github' | 'npm' | 'youtube' | 'cog';

interface Props
{
    readonly icon: IconType;
    readonly size?: number;
}

const svgXmlNs = "http://www.w3.org/2000/svg";

export default class Icon extends ClassComponent<Props>
{
    public render()
    {
        const { icon, size } = this.props;

        const style: any = {}
        if (typeof(size) === 'number' && isFinite(size))
        {
            style['width'] = style['height'] = `${size}px`;
        }

        return <svg xmlns={svgXmlNs} style={style} viewBox='0 0 512 512' class='icon'>
            <use href={`#${icon}`}></use>
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
                    <path d="m255.98 28.622c-128.72 0-233.11 104.38-233.11 233.14 0 102.99 66.793 190.38 159.43 221.22 11.664 2.1339 15.915-5.0665 15.915-11.249 0-5.5387-.20287-20.194-.32456-39.646-64.846 14.083-78.529-31.257-78.529-31.257-10.605-26.935-25.89-34.105-25.89-34.105-21.167-14.455 1.6025-14.169 1.6025-14.169 23.4 1.6471 35.708 24.03 35.708 24.03 20.795 35.622 54.57 25.332 67.855 19.364 2.1177-15.056 8.1434-25.332 14.799-31.157-51.765-5.8966-106.19-25.89-106.19-115.23 0-25.461 9.0882-46.257 24.001-62.558-2.4058-5.8963-10.405-29.597 2.2881-61.699 0 0 19.564-6.2688 64.102 23.886 18.591-5.1665 38.542-7.7425 58.365-7.8429 19.808.12188 39.745 2.6776 58.365 7.8429 44.509-30.155 64.045-23.886 64.045-23.886 12.724 32.102 4.7231 55.801 2.3328 61.699 14.941 16.301 23.958 37.097 23.958 62.558 0 89.563-54.513 109.27-106.44 115.04 8.358 7.199 15.815 21.425 15.815 43.179 0 31.157-.28396 56.303-.28396 63.945 0 6.2401 4.2076 13.496 16.029 11.221 92.568-30.899 159.31-118.22 159.31-221.19 0-128.76-104.39-233.14-233.16-233.14"/>
                </g>

                <g id="npm">
                    <path d="M227.6 213.1H256v57.1h-28.4z"/><path d="M0 156v171.4h142.2V356H256v-28.6h256V156zm142.2 142.9h-28.4v-85.7H85.3v85.7H28.4V184.6h113.8zm142.2 0h-56.9v28.6h-56.9V184.6h113.8zm199.2 0h-28.4v-85.7h-28.4v85.7h-28.4v-85.7H370v85.7h-56.9V184.6h170.7v114.3z"/>
                </g>

                <g id="youtube">
                    <path d="m254.76 411.52s-143.55 0-179.35-9.5926c-19.75-5.2785-35.306-20.834-40.584-40.584-9.5929-35.8-9.5925-110.49-9.5925-110.49s0-74.696 9.5925-110.49c5.2784-19.749 20.834-35.307 40.584-40.584 35.8-9.5959 179.35-9.5926 179.35-9.5926s143.55-.0031 179.35 9.5926c19.751 5.2769 35.3 20.836 40.579 40.584 9.5904 35.799 9.5926 110.49 9.5926 110.49s-.004 74.695-9.5926 110.49c-5.2789 19.75-20.828 35.306-40.579 40.584-35.801 9.593-179.35 9.5926-179.35 9.5926zm-45.91-91.813 119.26-68.858-119.26-68.858z"/>
                </g>

                <g id="cog">
                    <path d="m210.06 28.037-11.908 75.133a163.48 163.48 0 0 0-45.559 26.342l-71.061-27.27-45.938 79.566 59.236 47.979a163.48 163.48 0 0 0-2.3125 26.213 163.48 163.48 0 0 0 2.2031 26.33l-59.127 47.889 45.938 79.566 71.084-27.279a163.48 163.48 0 0 0 45.51 26.18l11.934 75.303h91.875l11.912-75.16a163.48 163.48 0 0 0 45.535-26.322l71.08 27.279 45.938-79.566-59.24-47.982a163.48 163.48 0 0 0 2.3164-26.236 163.48 163.48 0 0 0-2.1992-26.307l59.123-47.885-45.938-79.566-71.061 27.27a163.48 163.48 0 0 0-45.537-26.199l-11.93-75.275h-91.875zm45.938 171.23a56.731 56.731 0 0 1 56.73 56.73 56.731 56.731 0 0 1-56.73 56.73 56.731 56.731 0 0 1-56.73-56.73 56.731 56.731 0 0 1 56.73-56.73z"/>
                </g>
            </defs>
        </svg>
    }
}