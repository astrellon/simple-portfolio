import DeviceDetector from "device-detector-js";
import * as fs from "fs";
import * as path from "path";
import * as cookie from "cookie";
import { exec } from "child_process";
import DataStore from "simple-data-store";
import { State, DataStored, clearLoadedData, addData } from "./client/store";
import HttpServer from "./http-server";
import PageRenderer from "./page-renderer";
import { ServerConfig } from "./server-config";

const deviceDetector = new DeviceDetector({
    skipBotDetection: true
});

export default class Server
{
    public readonly config: ServerConfig;

    private readonly store: DataStore<State>;
    private readonly pageRenderer: PageRenderer;
    private readonly httpServer: HttpServer;

    constructor (config: ServerConfig)
    {
        this.config = config;

        this.store = new DataStore<State>({
            pages: [],
            posts: {},
            selectedPageId: '',
            darkTheme: false,
            postsHeight: 0,
            isMobile: false
        });

        const clientFileHtml = fs.readFileSync(path.join(this.config.clientDeployFolder, '/index.html')).toString();

        this.pageRenderer = new PageRenderer(clientFileHtml, this.store);
        this.httpServer = new HttpServer(this.config.host, this.config.port);
    }

    public downloadFromGit()
    {
        return new Promise((resolve, reject) =>
        {
            const { gitRepoBranch, gitRepoUrl } = this.config;
            exec(`./get-from-git.sh "${gitRepoBranch}" "${gitRepoUrl}"`, (err) =>
            {
                if (err)
                {
                    console.error('Error downloading from git', err);
                    reject(err);
                }
                else
                {
                    console.log('Done downloading from git');
                    resolve(true);
                }
            });
        })
    }

    public loadFromData()
    {
        this.store.execute(clearLoadedData())
        const { dataFolder } = this.config;

        if (fs.existsSync(dataFolder))
        {
            const files = fs.readdirSync(dataFolder);
            for (const file of files)
            {
                const combinedFilePath = path.join(dataFolder, file);
                console.log('Reading file:', combinedFilePath);
                const pageData = JSON.parse(fs.readFileSync(combinedFilePath).toString()) as DataStored[];
                this.store.execute(addData(pageData));
            }
        }
    }

    public setupServerRoutes()
    {
        this.httpServer.registerRoute('/client', (req, res) =>
        {
            fs.readFile(`./clientDeploy${req.url}`, (err, data) =>
            {
                if (err != null)
                {
                    res.writeHead(404);
                    res.end();
                    return;
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

        this.httpServer.registerRoute('/assets', (req, res) =>
        {
            if (!req.url)
            {
                res.writeHead(404);
                res.end();
                return;
            }

            const url = req.url;

            fs.readFile('.' + url, (err, data) =>
            {
                if (err != null)
                {
                    res.writeHead(404);
                    res.end();
                    return;
                }

                if (url.endsWith('.jpeg') || url.endsWith('.jpg'))
                {
                    res.setHeader('Content-Type', 'image/jpeg');
                }
                else if (url.endsWith('.png'))
                {
                    res.setHeader('Content-Type', 'image/png');
                }
                else if (url.endsWith('.svg'))
                {
                    res.setHeader('Content-Type', 'image/svg+xml');
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

        this.httpServer.registerRoute('/webhook', (req, res) =>
        {
            if (!req.url)
            {
                res.writeHead(500);
                res.end();
                return;
            }

            console.log('Webhook request');
            this.downloadFromGit()
                .then(() =>
                {
                    console.log('Updating from new downloaded data');
                    this.loadFromData();
                    res.writeHead(200);
                    res.end();
                })
                .catch(() =>
                {
                    console.error('Failed to get new data');
                    res.writeHead(500);
                    res.end();
                });
        });

        this.httpServer.registerRoute('/', (req, res) =>
        {
            let pageId = req.url?.substr(1) || '';
            if (pageId === '')
            {
                pageId = this.pageRenderer.defaultPage();
            }

            const cookies = cookie.parse(req.headers.cookie || '');

            if (this.pageRenderer.isPage(pageId))
            {
                let isMobile = false;
                if (req.headers['user-agent'])
                {
                    const device = deviceDetector.parse(req.headers['user-agent']);
                    isMobile = device.device?.type === 'smartphone';
                }

                res.setHeader("Content-Type", "text/html");
                res.setHeader("Cache-Control", "max-age=10");
                res.writeHead(200);

                let renderState: Partial<State> = {
                    selectedPageId: pageId,
                    darkTheme: cookies.darkTheme === 'true',
                    isMobile
                };
                res.end(this.pageRenderer.render(renderState));
            }
            else
            {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(404);
                res.end('Not found');
            }
        });
    }

    public runServer()
    {
        this.httpServer.start(() =>
        {
            console.log(`Started portfolio server on ${this.httpServer.hostname}:${this.httpServer.port}`);
        });
    }
}