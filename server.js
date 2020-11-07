/* eslint-env node */
const http = require("http");
const url = require("url");
const middleware = require("./middleware");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  console.log(pathname);
  if (pathname == "/" && req.method == "GET") {
    let searchWord = url.parse(req.url, true).query.search;
    console.log(searchWord);
    res.end(middleware.selectItemsFromDB(searchWord));
  }

  if (pathname == "/" && req.method == "POST") {
    let body = [];
    //building the body
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        //post body \n formatting
        body = JSON.parse(body);
        res.end(middleware.insertItemsIntoDB(body));
      });
  } else {
    handleError(404, res);
  }
});

var handleError = (statusCode, res) => {
  res.statusCode = statusCode;
  res.end(`{"error": ${http.STATUS_CODES[statusCode]}}`);
};

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
