var assert      = require('assert');
var HttpClient  = require('go-fetch');
var decompress  = require('..');

describe('decompress', function() {

	it('should add a `Accept-Encoding` header with the value of `gzip`', function() {

		var client    = new HttpClient();
		var request   = new HttpClient.Request('GET', 'https://api.github.com/users/digitaledgeit/repos', {'Content-Type': 'application/json'});
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:       'before',
			request:    request,
			response:   response
		});

		client.use(decompress('go-fetch'));

		client.emit(event, function(error, event) {
			assert.equal(event.request.getHeader('Accept-Encoding'), 'gzip');
		});

	});

});