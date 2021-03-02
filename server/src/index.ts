import "array-flat-polyfill";
import * as fs from "fs";
import { render, VDom, vdom } from "simple-tsx-vdom";
import { SSRDomDocument } from "./ssr-vdom";
import { State } from "../../common/store";
import { App } from "../../common/components/app";
import { Server } from "./server";
import { parse } from 'node-html-parser';

const ssrDomDocument = new SSRDomDocument();
const ssrVDom = new VDom(ssrDomDocument);
VDom.current = ssrVDom;

let clientFileHtml = fs.readFileSync('./clientDeploy/index.html').toString();
const clientHtml = parse(clientFileHtml);
const rootEl = clientHtml.querySelector('body');

const state: State = {
        categories: [{
            id: 'about',
            title: 'About Me'
        },
        {
            id: 'work',
            title: 'Previous Work'
        },
        {
            id: 'projects',
            title: 'Personal Projects'
        }
    ],
    posts: [{
        categoryId: 'projects',
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
    }]
};

const parent = ssrDomDocument.createEmpty();
render(vdom(App, {state}), parent);
const parsedParent = parse(parent.toString());

const headEl = clientHtml.querySelector('head');
headEl.insertAdjacentHTML('beforeend', `<script>window.__state=${JSON.stringify(state)}</script>`);

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