# markdown-webserver
This is a simple NodeJS application which can turn a directory structure with markdown files into a webserver.
**Beta version, still under development.**

## Installation

*Requirements:* NodeJS.

1. Checkout this repository.
2. Run `npm install` command in the cloned directory.
3. You can start the server by `node index.js -p <path-to-root-directory>` command.

The server will discover the given directory recursively, and will serve the found markdown files similiar to a wiki website.

## Configuration

There is not much configuration possibility yet...

- You can create a `.markdown-webserver` directory in the root directory. The server will recognize the following files in this directory:
    - `COPYRIGHT.md` - rendered at the bottom of the left menu
    - `EMPTY.md` - rendered if selected content is empty.
    - `HOME.md` - rendered if the requested path is `localhost/`
    - `NOTFOUND.md` - rendered if the selected content was not found.

- The layout of the application is declared in `.mustache` files in _templates_ directory.
- The `less` files are in _resources_ directory.

## Other information

- The server use cache for the files, the cache timeout is 5 minutes.

Feel free to use this code for any purpose, pull requests are also welcomed.