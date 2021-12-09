# Server for React app

This ExpressJS server serves a React app to fix issues where React router is not enough to handle multi-pages app.

So we don't need to use the ugly HashRouter.

https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually

## Development

Install

```bash
yarn
```

Build the React app and start the express server on http://localhost:4000

```bash
yarn start
```

## Production

The react website is built first, the bundle is placed in the server `public` folder, and the React app is served from this folder in production on http://localhost:4000

```bash
yarn build
yarn serve
```

## Deploy with Docker

Build:

```bash
docker build -t fair-enough-server .
```

Run:

```bash
docker run -it -p 4000:4000 fair-enough-server
```

