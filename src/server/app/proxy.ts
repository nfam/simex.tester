import * as http from "http";
import * as https from "https";
import * as URL from "url";

export default class Proxy {
    pipe(request: http.IncomingMessage, response: http.ServerResponse) {
        let search = request.url.substring(request.url.indexOf('?') + 1);
        let url = URL.parse(search);
        if (!url.protocol || !url.hostname) {
            response.writeHead(400);
            response.end();
            return;
        }

        var headers = {};
        var userAgent = null;
        for (var name in request.headers) {
            if (name == 'host') {
            }
            else if (name == 'x-user-agent') {
                userAgent = request.headers[name];
            }
            else {
                headers[name] = request.headers[name];
            }
        }
        if (userAgent) {
            headers['user-agent'] = userAgent;
        }

        var requestOptions: (http.RequestOptions | https.RequestOptions) = {};
        requestOptions.protocol = url.protocol;
        requestOptions.hostname = url.hostname;
        requestOptions.port = url.port || (url.protocol == 'https:' ? 443 : 80);
        requestOptions.path = url.path;
        requestOptions.method = request.method;
        requestOptions.headers = headers;

        var proxy_request = url.protocol == 'https:'
            ? https.request(requestOptions)
            : http.request(requestOptions);

        proxy_request.on('response', function (proxy_response) {
            response.writeHead(proxy_response.statusCode, proxy_response.headers);
            proxy_response.pipe(response);
        });

        proxy_request.on('error', function (error) {
            response.writeHead(400);
            response.end();
        });

        request.pipe(proxy_request);
    }
}
