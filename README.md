# markdown-watch

Markdown compiler + live reload written in nodejs, great for quick-editing markdown files.


## Install

`sudo npm install -g markdown-watch`


## Usage

Just run `markdown-watch` and open http://localhost:8080/myfile in your web browser.

Each time the relevant markdown file is saved, the browser will reload with the updated rendered markdown.

**NOTE:** All file paths are relative to your current working directory.


## Options

Currently, there are a few options you can apply.

Invoking `markdown-watch --help` will list all the options
available for your installed version of this package.

### Port

You can change the http listening port (defaults to 8080) by invoking the following:
`markdown-watch -p 9090`



[npm-image]: https://img.shields.io/npm/v/markdown-watch.svg
[npm-url]: https://npmjs.org/package/markdown-watch
