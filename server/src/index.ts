import "array-flat-polyfill";
import { render, VDom, vdom } from "simple-tsx-vdom";
import { SSRDomDocument } from "./ssr-vdom";
import { State } from "../../common/store";
import { App } from "../../common/components/app";
import { Server } from "./server";

const ssrDomDocument = new SSRDomDocument();
const ssrVDom = new VDom(ssrDomDocument);
VDom.current = ssrVDom;

const state: State = {
    posts: [
        {
            contents: 'This is the first post',
            id: '1',
            title: 'First Post'
        },
        {
            contents: 'This is the second post',
            id: '2',
            title: 'Second Post'
        }
    ]
}

const parent = ssrDomDocument.createElement('div');
render(vdom(App, {state}), parent);

const postString = parent.toString();

const server = new Server('localhost', 8000);
server.registerRoute('/post', (req, res) =>
{
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(postString);
});
server.start(() =>
{
    console.log(`Started CMS server on ${server.hostname}:${server.port}`);
});