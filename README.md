# Simple Portfolio

A simple [data driven](https://en.wikipedia.org/wiki/Data-driven_programming) portfolio system built using [simple-tsx-vdom](https://www.npmjs.com/package/simple-tsx-vdom) and [simple-data-store](https://www.npmjs.com/package/simple-data-store).

The portfolio server returns rendered pages using [simple-tsx-vdom-ssr](https://www.npmjs.com/package/simple-tsx-vdom-ssr) which is then hydrated with [simple-tsx-vdom-hydration](https://www.npmjs.com/package/simple-tsx-vdom-hydration).

## Server Side Rendering

The server hosts up a HTML file for the page requested by page `id` (see below).

The client HTML will be put into `clientDeploy` when the server is built.

The client source files is found under `src/client` and the code in there is shared with the server for rendering the same components the same way.

## Assets

Assets in this case refer to static assets like images and are expected to be found in the `assets` folder.

## Data

Each data packet can define either a page category (About Me, Works, etc), a background image with theme (light or dark), or a post on a page.

The data is loaded from the `data` folder by default (can be changed via a config file).

Currently the default is expected to loaded from [this github repo](https://github.com/astrellon/simple-portfolio-data).

The data and assets can either be manually downloaded and placed into the deployed servers root folder.

### Page Example

A page defines a category of posts that are connected by a common page title/id.

For example an About Me page could be defined like this:

```json
[{
    "type": "page",
    "id": "about",
    "title": "About Me",
    "defaultPage": true
}]
```

This creates a page that can have posts linked to it via the `id` and it is also marked at the `defaultPage` which means when routing to `/` on the server that this page is returned. Otherwise it can be used to get the page via page id.

For example:

```https://portfoliopage.com/about```

Will return the about page.

### Background Example

A background is simply the tiling background for the whole website.

For example it can look like this:

```json
[{
    "type": "background",
    "backgroundType": "dark",
    "url": "/assets/background-dark-1.png"
}]
```

### Post Example

The biggest piece of data is defined in a post which contains texts and images.

```json
[{
    "type": "post",
    "pageId": "about,
    "contents": [{
        "text": [
            "[h3](About Me)",
            "Here is some text about me",
            "Here are [link](some | https://example.com) [link](are | https://example.com) of my [link](links | https://example.com).",
            "Here is a list of things:",
            "* I like to work on things.",
            "* I have done stuff before.",
            "* I would like to continue doing things with stuff."
        ],
        "links": [{
            "url": "https://github.com/myaccount",
            "icon": "github"
        }, {
            "url": "https://www.npmjs.com/~myaccount",
            "icon": "npm"
        }],
        "pictures": [{
            "url": "/assets/myphoto.jpg",
            "caption": "A photo of me"
        }]
    }]
}]
```

We can see that the text formatting with posts is a bit more complicated. It is inspired from [Markdown](https://en.wikipedia.org/wiki/Markdown) but somewhat different. I created my own markup as I wanted something that was very simple to parse.

Only text defined in the `text` field is parsed as the following formatted text.

Each special formatting tag is always:

```
[tag](value)
```

Currently the list of tags is:

#### Link
`link`: Takes two values separated by `|` the first is used as the text and the second is used as the url.

*Example*: `Here is a [link](link | https://example.com)`

Which will look like this in HTML:
```html
Here is a <a href="https://example.com)">link</a>
```

#### Post Header
`post-header`: Takes two values separated by `|` the first is used as the heading (wrapped in a `h3`) and the second is considered a period (wrapped in a `small`).

*Example*: `[post-header](Previous Workplace | OCT 2009 - JAN 2012)`

Which will look like this in HTML:
```html
<div class='post-header'>
    <h3>Previous Workplace</h3>
    <small>OCT 2009 - JAN 2012</small>
</div>
```

#### Simple Wrappers
`strong`, `h1`, `h2`, `h3`: These are just the regular HTML tags and will wrap the value.

*Example*: `Here is some [strong](bold) text.`

Which will look like this in HTML:
```html
Here is some <strong>bold</strong> text.
```

It is currently limited to those 4 tags.

## Updating Data and Assets

There is an endpoint defined on the server of `/webhook` that will trigger the server to download the latest version of the `simple-portfolio-data` github repo. This also can be defined in the config file. This means that any time new data is pushed to the repo that the server can be notified (if setup in Github) and update itself with new data, without needing to restart the server.

## Config

The config currently looks like this:

```typescript
interface ServerConfig
{
    readonly dataFolder: string;
    readonly port: number;
    readonly host: string;
    readonly clientDeployFolder: string;
    readonly gitRepoUrl: string;
    readonly gitRepoBranch: string;
}
```

and defaults the following:

```typescript
{
    dataFolder: './data',
    port: 8000,
    host: '0.0.0.0',
    clientDeployFolder: './clientDeploy',
    gitRepoUrl: 'https://github.com/astrellon/simple-portfolio-data',
    gitRepoBranch: 'main'
}
```

## Attributions

The ripples background effect is based off sirxemic's [jQuery Ripples Plugin](https://github.com/sirxemic/jquery.ripples/).

# Licence

MIT

# Author

Alan Lawrey 2021