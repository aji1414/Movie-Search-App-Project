# simple.extract

A simple promisified wrapper for [inly](https://www.npmjs.com/package/inly), which extract .zip, .gz, .bz2, .tar, tar.gz, tar.bz2, .tgz, .tbz2 archives.

## Install
```bash
npm i simple.extract
```
## Import
```js
const extract = require('simple.extract')
```

## API
## extract(options)
* `options` {string|Obejct} - can be the input file path or an option object.
* `options.inputFile` {string} - input compressed file path.
* `options.outputPath` {string} - [Optional] output folder path (default: process.cwd()).
* `options.logger` {console.Console} - [Optional] logger instance (default: null).

* Returns: {PromiseLike<string>} inputFile if succesful.

The `extract()` method will extract the archive file and resolve the promise returned when finished.

For example:

```js
extract('./Sample.zip');
// equivalent as extract({inputFile:'./Sample.zip'}) that extract Sample.zip file to process.cwd().

extract({inputFile:'./Sample.zip', outputDir:'./output',});
// extract Sample.zip to ./output folder

extract({inputFile:'./Sample.zip', outputDir:'./output', logger:console});
// extract Sample.zip to ./output folder and logging the details into console (can be replaced with any logger that has logger.log() function implemented).
```

## License
MIT
