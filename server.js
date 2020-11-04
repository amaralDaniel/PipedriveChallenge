/* eslint-env node */
const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    
    const {pathname} = url.parse(req.url);
    if (pathname == '/' && req.method == 'GET') {
        res.end("Pipedrive Challenge GET");
    }

    if (pathname == '/' && req.method == 'POST') {
        let body = [];
        //building the body
        req.on('data', (chunk) => {
            body.push(chunk);
            }).on('end', () => {    
            body = Buffer.concat(body).toString();
            //post body \n formatting 
            body = body.replace(/\\n/g, "\n");
            
            res.end("Pipedrive Challenge POST");
        });
    } else {
        handleError(404, res);
    }

});

var handleError = (statusCode, res) => {
    res.statusCode = statusCode;
    res.end(`{"error": ${http.STATUS_CODES[statusCode]}}`)
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
