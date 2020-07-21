var Stream  = require('stream');
var zlib    = require('zlib');

/**
 * Handle compressed responses from the server
 * @returns {function(HttpClient)}
 */
module.exports = function() {
	return function(client) {

		client.on('before', function(event) {

			//indicate to the server that we would like to use gzip
			event.request.setHeader('Accept-Encoding', 'gzip');

		});

		client.on('after', function(event) {
			var
				encoding  = event.response.getHeader('Content-Encoding'),
				stream    = event.response.getBody()
			;

			//ensure response is a stream
			if (!(stream instanceof Stream)) {
				return;
			}

			//pass through stream
			if (encoding === 'gzip') {
				event.response.setBody(stream.pipe(zlib.createGunzip()));
			}

		});

	};
};