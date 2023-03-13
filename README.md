# 🌐 Knowledge Collaboratory frontend

Built with [Astro](https://astro.build/), [ReactJS](https://reactjs.org/), and [Material UI for react](https://mui.com/).

## 🧑‍💻 Development

Install dependencies:

```bash
yarn
```

Run the app in development:

```bash
yarn dev
```

> Open [localhost:3000](http://localhost:3000) with your browser to see the result. The page auto-updates as you edit the file.

## ✔️ Formatting

Automatically format the code with `prettier`:

```bash
yarn fmt
```

Run `eslint` to check for issues in the code:

```bash
yarn lint
```

## 🚀 Production deployment

Build, and generate static pages in `dist/`:

```bash
yarn build
```

Preview built website:

```bash
yarn preview
```

🤖 There is a GitHub Action workflow to automatically build and deploy the website to GitHub Pages.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                               |
| :------------------ | :--------------------------------------------------- |
| `yarn`              | Installs dependencies                                |
| `yarn dev`          | Starts local dev server at `localhost:3000`          |
| `yarn build`        | Build your production site to `./dist/`              |
| `yarn preview`      | Preview your build locally, before deploying         |
| `yarn format`       | Format the code with `prettier`                      |
| `yarn lint`         | Check for issues in the code with `eslint`           |
| `yarn vscode`       | Setup VSCode to properly resolve imports from yarn 3 |
| `yarn astro ...`    | Run CLI commands like `astro add`, `astro check`     |
| `yarn astro --help` | Get help using the Astro CLI                         |

## 👀 Want to learn more?

Feel free to check [Astro documentation](https://docs.astro.build) or jump into their [Discord server](https://astro.build/chat).

Astro + Tailwind template: https://github.com/onwidget/astrowind

<!-- [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json) -->
