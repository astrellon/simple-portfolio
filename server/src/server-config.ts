export interface ServerConfig
{
    readonly dataFolder: string;
    readonly port: number;
    readonly host: string;
    readonly clientDeployFolder: string;
    readonly gitRepoUrl: string;
    readonly gitRepoBranch: string;
}

export const DefaultServerConfig: ServerConfig =
{
    dataFolder: './data',
    port: 8000,
    host: '0.0.0.0',
    clientDeployFolder: './clientDeploy',
    gitRepoUrl: 'https://github.com/astrellon/simple-portfolio-data',
    gitRepoBranch: 'main'
}