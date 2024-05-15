require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Level, User } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/levels", async (req, res) => {
  try {
    const levels = await Level.find({});
    res.json(levels);
  } catch (error) {
    res.status(404).end();
  }
});

app.get("/api/categories", async (req, res) => {
  const levelId = req.query.levelId;
  try {
    const level = await Level.findById(levelId);
    res.json(level.categories);
  } catch (error) {
    res.status(404).end();
  }
});

app.get("/api/words", async (req, res) => {
  const categoryId = req.query.categoryId;
  try {
    const level = await Level.findOne({ "categories._id": categoryId });
    if (level) {
      const category = level.categories.id(categoryId);
      res.json(category.words);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(404).end();
  }
});

app.post("/api/words/add", async (req, res) => {
  const { levelId, categoryLabel, words } = req.body;

  if (levelId == null || categoryLabel == null || words == null) {
    return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
  }

  try {
    const matchedLevel = await Level.findById(levelId);
    if (!matchedLevel) {
      return res.status(400).json({ message: "Không tìm thấy độ khó" });
    }

    const isCategoryExisted = matchedLevel.categories.find(
      (category) => category.label.toLowerCase() === categoryLabel.toLowerCase()
    );
    if (isCategoryExisted) {
      return res
        .status(400)
        .json({ message: `Chủ đề ${categoryLabel} đã tồn tại` });
    }

    const newCategory = {
      label: categoryLabel,
      words: words.map((word) => ({
        eng: word.eng,
        vie: word.vie,
        quiz: word.quiz,
      })),
    };

    matchedLevel.categories.push(newCategory);
    await matchedLevel.save();

    res.status(201).json({ message: "Tạo nhóm từ thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Tạo tài khoản thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { userId: existingUser.username },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      token,
      user: {
        username: existingUser.username,
        _id: existingUser._id,
        isAdmin: existingUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
