import parse from "node-html-parser";
import DataStore from "simple-data-store";
import { render, vdom, VDom } from "simple-tsx-vdom";
import { SSRDomDocument } from "simple-tsx-vdom-ssr";
import { App } from "../../common/components/app";
import { State } from "../../common/store";

export class PageRenderer
{
    public readonly rawClientHtml: string;
    public readonly store: DataStore<State>;

    constructor (rawClientHtml: string)
    {
        this.rawClientHtml = rawClientHtml;
        this.store = new DataStore<State>({
            categories: [],
            posts: {},
            selectedCategoryId: ''
        });
    }

    public isCategory(category?: string)
    {
        return category != undefined && this.store.state().categories.findIndex(c => c.id === category) >= 0;
    }

    public render(withPartialStore: Partial<State>)
    {
        const ssrDomDocument = new SSRDomDocument();
        const ssrVDom = new VDom(ssrDomDocument);
        VDom.current = ssrVDom;

        const state = Object.assign({}, this.store.state(), withPartialStore);
        // Check if there's any change.

        const clientDoc = parse(this.rawClientHtml);
        const rootEl = clientDoc.querySelector('body');

        const parent = SSRDomDocument.emptyElement();

        render(vdom(App, { state }), parent);
        const parsedParent = parse(parent.hydrateToString());

        const headEl = clientDoc.querySelector('head');
        headEl.insertAdjacentHTML('beforeend', `<script>window.__state=${JSON.stringify(state)}</script>`);

        rootEl.childNodes.splice(0, 0, parsedParent);
        return clientDoc.toString();
    }
}