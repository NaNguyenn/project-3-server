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
      res.json({ words: category.words, categoryLabel: category.label });
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
      scores: [],
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
        scores: existingUser.scores,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/api/user", authenticateToken, async (req, res) => {
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/user/score/add", async (req, res) => {
  const { userId, categoryLabel, score, total } = req.body;
  if (!userId || !categoryLabel || score == null || total == null) {
    return res.status(400).json({ message: "Thiếu thông tin đầu vào" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const newScoreItem = {
      category: categoryLabel,
      score,
      total,
    };

    user.scores.push(newScoreItem);

    await user.save();

    res.status(201).json({ message: "Cập nhật điểm thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
