/* eslint-env node */
const http = require("http");
const middleware = require("./middleware");
var express = require("express");
const paginate = require("express-paginate");
var app = express();
const port = 3000;

const pageLimit = 100;

app.use(paginate.middleware(100, 120));

app.get("/", (req, res, next) => {
  try {
    let searchWord = req.query.search;
    let page = req.query.page - 1;
    var getRelationsPromise = new Promise((resolve, reject) => {
      return middleware.selectItemsFromDB(searchWord, resolve, reject);
    });
    getRelationsPromise.then(
      (data) => {
        let itemCount = data.length;
        const pageCount = Math.ceil(itemCount / pageLimit);

        if (pageCount < 2) {
          if (req.accepts("json")) {
            res.json({
              object: "list",
              has_more: paginate.hasNextPages(req)(pageCount),
              data: data,
            });
          }
        } else {
          if (req.accepts("json")) {
            res.json({
              object: "list",
              has_more: paginate.hasNextPages(req)(pageCount),
              data: data.slice(page * pageLimit, (page + 1) * pageLimit),
            });
          }
        }
      },
      (data) => {
        res.json({
          message: data.message,
        });
      }
    );
  } catch (error) {
    req.json({
      message: data.message,
    });
  }
});

app.post("/", (req, res, next) => {
  let body = [];
  //building the body
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      body = JSON.parse(body);
      var insertItemsIntoDBPromise = new Promise((resolve, reject) => {
        return middleware.insertItemsIntoDB(body, resolve, reject);
      });
      insertItemsIntoDBPromise.then((data) => res.json(data)).catch(next);
    });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
