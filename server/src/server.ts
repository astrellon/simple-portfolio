import * as http from 'http';

type RemoveRoute = () => void;

interface Route
{
    readonly routePattern: RegExp;
    readonly callback: http.RequestListener;
}

export class Server
{
    public readonly hostname: string;
    public readonly port: number;
    public readonly server: http.Server;

    private readonly routes: Route[] = [];

    constructor(hostname: string, port: number)
    {
        this.hostname = hostname;
        this.port = port;
        this.server = http.createServer(this.onServerRequestListener);
    }

    public start(onStartCallback?: () => void)
    {
        this.server.listen(this.port, this.hostname, onStartCallback);
    }

    public registerRoutePattern(routePattern: RegExp, callback: http.RequestListener): RemoveRoute
    {
        const route: Route = { routePattern, callback };
        this.routes.push(route);

        return () =>
        {
            const index = this.routes.indexOf(route);
            if (index >= 0)
            {
                this.routes.splice(index, 1);
            }
        }
    }

    public registerRoute(routeStart: string, callback: http.RequestListener): RemoveRoute
    {
        return this.registerRoutePattern(new RegExp('^' + routeStart), callback);
    }

    private onServerRequestListener = (req: http.IncomingMessage, res: http.ServerResponse) =>
    {
        if (typeof(req.url) !== 'string')
        {
            res.writeHead(501);
            res.end("Unknown request without a URL");
            return;
        }

        for (const route of this.routes)
        {
            if (route.routePattern.test(req.url))
            {
                route.callback(req, res);
                return;
            }
        }

        res.writeHead(404);
        res.end("Cannot find");
    }
}