import "array-flat-polyfill";
import * as fs from "fs";
import * as path from "path";
import { DataStored, addData } from "../../common/store";
import { Server } from "./server";
import { PageRenderer } from "./page-renderer";

let clientFileHtml = fs.readFileSync('./clientDeploy/index.html').toString();
const pageRenderer = new PageRenderer(clientFileHtml);

const files = fs.readdirSync("./data");
for (const file of files)
{
    const combinedFilePath = path.join("./data", file);
    console.log('Reading file:', combinedFilePath);
    const pageData = JSON.parse(fs.readFileSync(combinedFilePath).toString()) as DataStored[];
    pageRenderer.store.execute(addData(pageData));
}

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
        res.setHeader("Cache-Control", "max-age=3600");

        res.writeHead(200);
        res.end(data);
    });
});

server.registerRoute('/', (req, res) =>
{
    let category = req.url?.substr(1);
    if (category === '')
    {
        category = pageRenderer.defaultCategory();
    }

    if (pageRenderer.isCategory(category))
    {
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "max-age=10");
        res.writeHead(200);
        res.end(pageRenderer.render({ selectedPageId: category }));
    }
    else
    {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(404);
        res.end('Not found');
    }
});

server.start(() =>
{
    console.log(`Started CMS server on ${server.hostname}:${server.port}`);
});