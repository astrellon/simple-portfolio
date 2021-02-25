import { DomElement, DomNodeList, DomNode, DomText, DomInlineStyle, DomDocument, VDom, Props, VirtualElement, VirtualIntrinsicElement } from 'simple-tsx-vdom';

export class SSRDomNodeList implements DomNodeList
{
    public get length()
    {
        return this.nodes.length;
    }

    public nodes: DomNode[] = [];

    public item(index: number): DomNode
    {
        return this.nodes[index];
    }
}

export abstract class SSRDomNode implements DomNode
{
    public parentElement: DomElement | null = null;

    public nodeType: number = 0;

    public abstract toString(previousNode?: SSRDomNode): string;
}

export class SSRDomText extends SSRDomNode implements DomText
{
    public nodeValue: string;

    constructor (nodeValue: string)
    {
        super();
        this.nodeValue = nodeValue;
    }

    public toString(previousNode?: SSRDomNode)
    {
        if (previousNode instanceof SSRDomText)
        {
            return '<!-- -->' + this.nodeValue;
        }
        return this.nodeValue;
    }
}

interface InlineStyle
{
    [key: string]: any;
}

export class SSRDomInlineStyle implements DomInlineStyle
{
    public values: InlineStyle = {};

    public setProperty(key: string, value: any)
    {
        this.values[key] = value;
    }
    public removeProperty(key: string)
    {
        delete this.values[key];
    }

    public toString()
    {
        let result = '';
        for (const key in this.values)
        {
            const value = this.values[key];
            result += `${key}`;
            result += `:${escape(value)};`;
        }
        return result;
    }
}

interface Attributes
{
    [key: string]: string;
}

export class SSRDomElement extends SSRDomNode implements DomElement
{
    public readonly nodeName: string
    public childNodes: SSRDomNodeList = new SSRDomNodeList();
    public style: SSRDomInlineStyle = new SSRDomInlineStyle();

    constructor (nodeName: string, xmlns: string = '')
    {
        super();
        this.nodeName = nodeName;
        if (xmlns.length > 0)
        {
            this.attributes['xmlns'] = xmlns;
        }
    }

    private attributes: Attributes = {};

    [key: string]: any;

    public setAttribute(qualifiedName: string, value: string)
    {
        this.attributes[qualifiedName] = value;
    }
    public removeAttribute(qualifiedName: string)
    {
        delete this.attributes[qualifiedName];
    }

    public addEventListener(type: any, listener: any, options?: any)
    {
        // Ignore
    }
    public removeEventListener(type: any, listener: any, options?: any)
    {
        // Ignore
    }

    public appendChild(node: any)
    {
        this.childNodes.nodes.push(node);
        return node;
    }

    public removeChild(node: any)
    {
        const index = this.childNodes.nodes.indexOf(node);
        if (index >= 0)
        {
            this.childNodes.nodes.splice(index, 1);
        }
        return node;
    }

    public toString(previousNode?: SSRDomNode)
    {
        let innerHtml = '';
        for (let i = 0; i < this.childNodes.nodes.length; i++)
        {
            const prevNode = i > 0 ? this.childNodes.nodes[i - 1] as SSRDomNode: undefined;
            const node = this.childNodes.nodes[i] as SSRDomNode;
            innerHtml += node.toString(prevNode);
        }

        if (this.nodeName === 'EMPTY')
        {
            return innerHtml;
        }
        return `<${this.nodeName}${this.toStringAttributes()}${this.toStringStyle()}>${innerHtml}</${this.nodeName}>`;
    }

    public toStringStyle()
    {
        const result = this.style.toString();
        if (result.length === 0)
        {
            return result;
        }

        return ` style="${result}"`;
    }

    public toStringAttributes()
    {
        let result = '';
        for (const key in this.attributes)
        {
            const value = this.attributes[key];
            result += ` ${key}`;
            result += `="${escape(value)}"`;
        }
        return result;
    }
}

export class SSRDomDocument implements DomDocument
{
    public createElement(type: string): SSRDomElement
    {
        return new SSRDomElement(type);
    }
    public createEmpty(): SSRDomElement
    {
        return this.createElement('EMPTY');
    }
    public createElementNS(namespace: string, type: string): SSRDomElement
    {
        return new SSRDomElement(namespace, type);
    }
    public createTextNode(text: string): SSRDomText
    {
        return new SSRDomText(text);
    }
}

export class SSRVDom extends VDom
{
    public createIntrinsicNode(intrinsicType: string, inputProps: Props, children: VirtualElement[]): VirtualIntrinsicElement
    {
        const result = super.createIntrinsicNode(intrinsicType, inputProps, children);
        (result as any).listeners = {};
        return result;
    }
}