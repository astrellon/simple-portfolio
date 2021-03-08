import "array-flat-polyfill";
import * as fs from "fs";
import { render, VDom, vdom } from "simple-tsx-vdom";
import { Category, CategoryId, PostState, setPosts, State, store, setStore } from "../../common/store";
import { App } from "../../common/components/app";
import { Server } from "./server";
import { parse } from 'node-html-parser';
import DataStore from "simple-data-store";
import { SSRDomDocument } from "simple-tsx-vdom-ssr";

const ssrDomDocument = new SSRDomDocument();
const ssrVDom = new VDom(ssrDomDocument);
VDom.current = ssrVDom;

let clientFileHtml = fs.readFileSync('./clientDeploy/index.html').toString();
const clientHtml = parse(clientFileHtml);
const rootEl = clientHtml.querySelector('body');

const categories: Category[] = [{
    id: 'about' as CategoryId,
    title: 'About Me'
},
{
    id: 'work' as CategoryId,
    title: 'Previous Work'
},
{
    id: 'projects' as CategoryId,
    title: 'Personal Projects'
}];

const posts: PostState[] = [{
    categoryId: 'projects' as CategoryId,
    title: 'Title 1!',
    contents: [
        {
            pictures: [],
            text: 'Paragraph 1'
        },
        {
            pictures: [],
            text: 'Paragraph 2'
        }
    ],
    id: ''
}];

setStore(new DataStore<State>({
    categories: categories,
    posts: {},
    selectedCategoryId: 'projects'
}));

store.execute(setPosts(posts));

const parent = SSRDomDocument.emptyElement();
render(vdom(App, {state: store.state()}), parent);
const parsedParent = parse(parent.hydrateToString());

const headEl = clientHtml.querySelector('head');
headEl.insertAdjacentHTML('beforeend', `<script>window.__state=${JSON.stringify(store.state())}</script>`);

rootEl.childNodes.splice(0, 0, parsedParent);
const clientFinal = clientHtml.toString();

const server = new Server('localhost', 8000);
server.registerRoute('/src', (req, res) =>
{
    fs.readFile(`./clientDeploy${req.url}`, (err, data) =>
    {
        if (err != null)
        {
            res.writeHead(404);
            res.end();
        }
        if (req.url?.endsWith('.css'))
        {
            res.setHeader('Content-Type', 'text/css');
        }
        else if (req.url?.endsWith('.js'))
        {
            res.setHeader('Content-Type', 'text/javascript');
        }
        else
        {
            res.setHeader('Content-Type', 'application/octet-stream');
        }

        res.writeHead(200);
        res.end(data);
    });
});

server.registerRoute('/post', (req, res) =>
{
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(clientFinal);
});
server.start(() =>
{
    console.log(`Started CMS server on ${server.hostname}:${server.port}`);
});