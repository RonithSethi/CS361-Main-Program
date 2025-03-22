/*
 *
 * CS 361 Main Program! Author: Ronith Sethi
 *
 */

var path = require("path");
var express = require("express");
var exphbs = require("express-handlebars");
const fs = require("fs");

var foodIndex = require("./data/foodIndex.json");
var foodAmount = 316;
var app = express();
var port = process.env.PORT || 8000;

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "skeleton",
  })
);
app.set("view engine", "handlebars");
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/images", express.static(path.join(__dirname, "images")));

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/", function (req, res) {
  // Home page
  // Convert foodIndex object to an array of objects
  const foodList = Object.entries(foodIndex).map(([name, data]) => ({
    name,
    category: data.category,
    index: data.index,
  }));
  res.render("page", {
    foodList,
    welcome: false,
    error: false,
    more: true,
    homeDisp: true,
    foodDisp: false,
    nutrientsDisp: false,
    funDisp: false,
    helpDisp: false,
    aboutDisp: false,
  });
});

app.get("/welcome", function (req, res) {
  res.render("page", {
    welcome: true,
    error: false,
    more: false,
    homeDisp: true,
    foodDisp: false,
    nutrientsDisp: false,
    funDisp: false,
    helpDisp: false,
    aboutDisp: false,
  });
});

app.get("/nutrients", function (req, res) {
  res.render("page", {
    welcome: false,
    error: false,
    more: true,
    homeDisp: false,
    foodDisp: false,
    nutrientsDisp: true,
    funDisp: false,
    helpDisp: false,
    aboutDisp: false,
  });
});

app.get("/help", function (req, res) {
  res.render("page", {
    welcome: false,
    error: false,
    more: true,
    homeDisp: false,
    foodDisp: false,
    nutrientsDisp: false,
    funDisp: false,
    helpDisp: true,
    aboutDisp: false,
  });
});

app.get("/about", function (req, res) {
  res.render("page", {
    welcome: false,
    error: false,
    more: true,
    homeDisp: false,
    foodDisp: false,
    nutrientsDisp: false,
    funDisp: false,
    helpDisp: false,
    aboutDisp: true,
  });
});

app.get("/fun", function (req, res) {
  res.render("page", {
    welcome: false,
    error: false,
    more: true,
    homeDisp: false,
    foodDisp: false,
    nutrientsDisp: false,
    funDisp: true,
    helpDisp: false,
    aboutDisp: false,
  });
});

app.get("/fun-fact", async (req, res) => {
  const filePath = path.join(__dirname, "CS361-MicroserviceA/Food.txt");
  fs.writeFileSync(filePath, "run");
  console.log("run written to Food.txt");
  await delay(200);
  const num = fs.readFileSync(filePath, "utf-8");
  console.log(`${num} received from Food.txt`);
  res.redirect(`/fun/${num}`);
});

app.get("/fun/:n", async function (req, res) {
  var b = Number(req.params.n);
  if (isNaN(b) || b >= foodAmount || b < 0) {
    return res.status(404).render("404");
  }
  let pipeDPath = path.join(__dirname, "cs361-Microservice-D/pipeD.txt");
  fs.writeFileSync(pipeDPath, String(b));
  console.log(`${b} written successfully to pipeD.txt`);
  await delay(300);
  let funData;
  const funDataJson = fs.readFileSync(
    path.join(__dirname, "cs361-Microservice-D/pipeD.json"),
    "utf-8"
  );
  funData = JSON.parse(funDataJson);
  funData["number"] = b;
  console.log("Fun Data:", funData);
  res.render("page", {
    funData,
    welcome: false,
    error: false,
    more: true,
    homeDisp: false,
    foodDisp: false,
    nutrientsDisp: false,
    funDisp: false,
    funFactDisp: true,
    helpDisp: false,
    aboutDisp: false,
  });
});

app.get("/food/:n", async function (req, res) {
  var b = Number(req.params.n);
  if (isNaN(b) || b >= foodAmount || b < 0) {
    return res.status(404).render("404");
  }

  let pipeCPath = path.join(__dirname, "cs361-Microservice-C/pipeC.txt");
  let pipeBPath = path.join(__dirname, "cs361-Microservice-B/pipeB.txt");

  // Ensure files exist before writing
  if (!fs.existsSync(pipeCPath)) {
    console.error("pipeC.txt does not exist!");
  }

  fs.writeFileSync(pipeCPath, String(b));
  console.log(`${b} written successfully to pipeC.txt`);

  fs.writeFileSync(pipeBPath, String(b));
  console.log(`Food number written successfully to pipeB.txt`);

  await delay(300);

  let foodData;
  const foodDataJson = fs.readFileSync(
    path.join(__dirname, "cs361-Microservice-C/pipeC.json"),
    "utf-8"
  );
  const name1 = fs.readFileSync(
    path.join(__dirname, "cs361-Microservice-B/pipeB.txt"),
    "utf-8"
  );
  foodData = JSON.parse(foodDataJson);
  console.log(`${foodData.Energy} received from pipeC.txt`);
  console.log(`${name1} received from pipeB.txt`);
  res.render("page", {
    foodData,
    welcome: false,
    error: false,
    more: true,
    homeDisp: false,
    foodDisp: true,
    nutrientsDisp: false,
    funDisp: false,
    helpDisp: false,
    aboutDisp: false,
  });
});

app.get("/*", function (req, res) {
  // Error page
  res.render("page", {
    welcome: false,
    error: true,
    more: false,
    homeDisp: false,
    foodDisp: false,
    nutrientsDisp: false,
    funDisp: false,
    helpDisp: false,
    aboutDisp: false,
  });
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
