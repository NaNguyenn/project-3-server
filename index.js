require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Level } = require("./models");

const app = express();
app.use(cors());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/levels", (request, response) => {
  Level.find({})
    .then((levels) => {
      response.json(levels);
    })
    .catch(() => response.status(404).end());
});

app.get("/api/categories", (request, response) => {
  const levelId = request.query.levelId;
  Level.findById(levelId)
    .then((level) => {
      response.json(level.categories);
    })
    .catch(() => response.status(404).end());
});

app.get("/api/words", (request, response) => {
  const categoryId = request.query.categoryId;
  Level.findOne({ "categories.id": categoryId })
    .then((level) => {
      response.json(level.categories[0].words);
    })
    .catch(() => response.status(404).end());
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
