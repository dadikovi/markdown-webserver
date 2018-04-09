# markdown-webserver
This is a simple NodeJS application which can turn a directory structure with markdown files into a webserver.

[![Build Status](https://travis-ci.org/dadikovi/markdown-webserver.svg?branch=master)](https://travis-ci.org/dadikovi/markdown-webserver)

## Features
- Supports the full markdown specification
- If the served directory is a local GIT repository, the repo will be refreshed regularly.
- Basic search engine
- Navigation
- Custom 404 screen, copyright message etc.
- Customizing the look of the generated page is easy.
- Modular architecture, you can develop your own plugin

## Installation

1. Download the latest release [here](https://github.com/dadikovi/markdown-webserver/releases/latest).
2. Run `npm install` command in the downloaded and extracted directory.
3. You can start the server by `npm start -- -p <path-to-root-directory>` command.

The server will discover the given directory recursively, and will serve the found markdown files similiar to a wiki website **on port 80**.

## Customization

- You can create a `.markdown-webserver` directory in the root directory. The server will recognize the following files in this directory:
    - `COPYRIGHT.md` - rendered at the bottom of the left menu
    - `EMPTY.md` - rendered if selected content is empty.
    - `HOME.md` - rendered if the requested path is `localhost/`
    - `NOTFOUND.md` - rendered if the selected content was not found.

- The layout of the application is declared in `.mustache` files in _templates_ directory.
- The `less` files are in _resources_ directory.

## Working with GIT repositories

If your root directory is a GIT repository (has `.git` subdirectory), the server will regularly pull the contents of remote repository.

## Plugins

The plugin API is under development, for further information check [this wiki page](https://github.com/dadikovi/markdown-webserver/wiki/markdown-webserver-plugin-API)

## Other information

- The server use cache for the files, the cache timeout is 5 minutes.
- The next planned improvements are listed [here](https://github.com/dadikovi/markdown-webserver/wiki/TODO). If you have another good idea, create an issue abot it!
- Feel free to use this code for any purpose, pull requests are also welcomed.