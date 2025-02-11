/*
 *
 * CS 361 Main Program!
 *
 */

var path = require("path");
var express = require("express");
var exphbs = require("express-handlebars");

var app = express();
var port = process.env.PORT || 8000;

app.engine("handlebars",
    exphbs.engine({
        defaultLayout: "skeleton",
    })
)
app.set("view engine", "handlebars")
app.use(express.static("static"))