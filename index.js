require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Level, User } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

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
      return response.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });
    response.status(201).json({ message: "Tạo tài khoản thành công" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post("/api/login", async (request, response) => {
  const { username, password } = request.body;
  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return response
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatched) {
      return response
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { userId: existingUser.username },
      process.env.JWT_SECRET
    );
    response.status(200).json({ token });
  } catch (error) {
    response.status(500).json({ message: "Lỗi hệ thống" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
