import "array-flat-polyfill";
import * as fs from "fs";
import { Category, CategoryId, PostState, setPosts, setCategories, setSelectedCategoryId } from "../../common/store";
import { Server } from "./server";
import { PageRenderer } from "./page-renderer";

let clientFileHtml = fs.readFileSync('./clientDeploy/index.html').toString();
const pageRenderer = new PageRenderer(clientFileHtml);

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

pageRenderer.store.execute(setCategories(categories));
pageRenderer.store.execute(setPosts(posts));
pageRenderer.store.execute(setSelectedCategoryId(categories[0].id));

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
        res.end(pageRenderer.render({ selectedCategoryId: category }));
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