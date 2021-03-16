import parse from "node-html-parser";
import DataStore from "simple-data-store";
import { render, vdom, VDom } from "simple-tsx-vdom";
import { SSRDomDocument } from "simple-tsx-vdom-ssr";
import { App } from "./client/components/app";
import { State } from "./client/store";
import equal from 'fast-deep-equal';

interface PreviousRender
{
    readonly state: Partial<State>;
    readonly htmlText: string;
}

export class PageRenderer
{
    public readonly rawClientHtml: string;
    public readonly store: DataStore<State>;

    private previousRenders: PreviousRender[] = [];

    constructor (rawClientHtml: string)
    {
        this.rawClientHtml = rawClientHtml;
        this.store = new DataStore<State>({
            pages: [],
            posts: {},
            selectedPageId: ''
        });

        this.store.subscribeAny(() =>
        {
            this.previousRenders = [];
        });
    }

    public isCategory(category?: string)
    {
        return category != undefined && this.store.state().pages.findIndex(c => c.id === category) >= 0;
    }

    public defaultCategory()
    {
        return this.store.state().selectedPageId;
    }

    public render(withPartialStore: Partial<State>)
    {
        const state = Object.assign({}, this.store.state(), withPartialStore);
        const previousRender = this.findPreviousState(state);

        if (!previousRender)
        {
            const ssrDomDocument = new SSRDomDocument();
            const ssrVDom = new VDom(ssrDomDocument);
            VDom.current = ssrVDom;

            const clientDoc = parse(this.rawClientHtml);
            const rootEl = clientDoc.querySelector('body');

            const parent = SSRDomDocument.emptyElement();

            render(vdom(App, { state }), parent);
            const parsedParent = parse(parent.hydrateToString());

            const headEl = clientDoc.querySelector('head');
            headEl.insertAdjacentHTML('beforeend', `<script>window.__state=${JSON.stringify(state)}</script>`);

            rootEl.childNodes.splice(0, 0, parsedParent);
            const htmlText = clientDoc.toString();
            this.previousRenders.push({ htmlText, state });

            console.log('New render response for: ', withPartialStore);

            return htmlText;
        }

        console.log('Cached previous render response for: ', withPartialStore);
        return previousRender.htmlText;
    }

    private findPreviousState(withPartialState: Partial<State>)
    {
        for (let i = 0; i < this.previousRenders.length; i++)
        {
            const previousRender = this.previousRenders[i];
            if (equal(previousRender.state, withPartialState))
            {
                return previousRender;
            }
        }

        return undefined;
    }
}