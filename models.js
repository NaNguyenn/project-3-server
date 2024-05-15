require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const wordSchema = new mongoose.Schema({
  eng: {
    type: String,
    required: true,
  },
  vie: {
    type: String,
    required: true,
  },
  quiz: {
    type: String,
    required: false,
  },
});

const categorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  words: [wordSchema],
});

const levelSchema = new mongoose.Schema({
  value: String,
  label: String,
  categories: [categorySchema],
});

const scoreSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  scores: [scoreSchema],
  isAdmin: { type: Boolean },
});

const Level = mongoose.model("Level", levelSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Level, User };
