require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Level, User } = require("./models");

const app = express();
app.use(cors());

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

app.post("/api/register", async (request, response) => {
  const { username, password } = request.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });
    response.status(201).json({ message: "Tạo tài khoản thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
