# go-fetch-decompress

[![Circle CI](https://circleci.com/gh/go-fetch-js/decompress.svg?style=svg)](https://circleci.com/gh/go-fetch-js/decompress)

Decompress response bodies compressed with gzip.

## Installation 

    npm install --save go-fetch-decompress
    
## Usage
    
    var HttpClient    = require('go-fetch');
    var decompress    = require('go-fetch-decompress');
    var parseBody     = require('go-fetch-read-body');
    
    HttpClient()
        .use(decompress())
        .use(parseBody())
        .get('http://www.digitaledgeit.com.au/', function(error, response) {
            console.log(
                error,
                response.getStatus(),
                response.getHeader('Content-Encoding'),
                response.getBody().substr(0, 25)
            );
        })
    ;
    

## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.