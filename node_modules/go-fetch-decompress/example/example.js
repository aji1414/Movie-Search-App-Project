var HttpClient    = require('go-fetch');
var decompress    = require('..');
var parseBody     = require('go-fetch-parse-body');

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