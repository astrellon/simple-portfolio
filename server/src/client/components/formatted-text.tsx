import { ClassComponent, vdom } from "simple-tsx-vdom";

interface Props
{
    readonly text: string;
}

const formattingRegex = /(\[([^\]]+)\]\(([^\)]+)\))/;
const globalFormattingRegex = new RegExp(formattingRegex, 'g');

export default class FormattedText extends ClassComponent<Props>
{
    public render()
    {
        return <span>{this.processText()}</span>
    }

    private processText = () =>
    {
        const { text } = this.props;
        const split = text.split(globalFormattingRegex);
        const result: any[] = [];

        for (let i = 0; i < split.length; i++)
        {
            const token = split[i];

            if (!token)
            {
                continue;
            }

            if (token[0] === '[' && formattingRegex.test(token))
            {
                // Handle token
                const type = split[i + 1];
                const value = split[i + 2];
                i += 2;

                if (type === 'link')
                {
                    const linkSplit = value.split('|');
                    const text = linkSplit[0].trim();
                    const url = linkSplit[1].trim();

                    result.push(<a href={url}>{text}</a>);
                }
                else if (type === 'strong' || type === 'h1' || type === 'h2')
                {
                    result.push(vdom(type, {}, value));
                }
            }
            else
            {
                result.push(token);
            }
        }

        return result;
    }
}
