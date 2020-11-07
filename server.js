/* eslint-env node */
const http = require("http");
const { resolve } = require("path");
const url = require("url");
const middleware = require("./middleware");
var express = require('express');
const { response } = require("express");
var app = express()
const port = 3000

app.get('/', (req, res) => {
 
    let searchWord = req.query.search;    
    var getRelationsPromise = new Promise((resolve, reject) => {
        return middleware.selectItemsFromDB(searchWord, resolve, reject);
    })
    getRelationsPromise.then((relations) => res.end(relations));
  
})

app.post('/', (req, res) => {
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
})
  

var handleError = (statusCode, res) => {
  res.statusCode = statusCode;
  res.end(`{"error": ${http.STATUS_CODES[statusCode]}}`);
};

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })