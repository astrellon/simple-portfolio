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

const clientFileHtml = fs.readFileSync('./clientDeploy/index.html').toString();
const clientHtml = parse(clientFileHtml);
const rootEl = clientHtml.querySelector('#root');

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

const parent = ssrDomDocument.createEmpty();
render(vdom(App, {state}), parent);
const parsedParent = parse(parent.toString());

const headEl = clientHtml.querySelector('head');
headEl.insertAdjacentHTML('beforeend', `<script>window.__state=${JSON.stringify(state)}</script>`);

rootEl.appendChild(parsedParent);
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