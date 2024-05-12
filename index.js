const express = require("express");
const app = express();

let data = {
  levels: [
    { value: "BASIC", label: "Cơ bản", id: 0 },
    { value: "INTERMEDIATE", label: "Trung bình", id: 1 },
    { value: "ADVANCED", label: "Nâng cao", id: 2 },
  ],
  categories: [
    { levelId: 0, label: "Màu Sắc", id: 0 },
    { levelId: 1, label: "Du Lịch", id: 1 },
    { levelId: 2, label: "Công nghệ", id: 2 },
  ],
  words: [
    {
      eng: "red",
      vie: "đỏ",
      categoryId: 0,
      quiz: "Màu chủ đạo trên lá cờ Việt Nam là gì",
    },
    {
      eng: "blue",
      vie: "xanh dương",
      categoryId: 0,
      quiz: "Bầu trời có màu gì",
    },
    {
      eng: "green",
      vie: "xanh lá",
      categoryId: 0,
      quiz: "Lá cây có màu gì",
    },
    {
      eng: "yellow",
      vie: "vàng",
      categoryId: 0,
      quiz: "Ngôi sao trên lá cờ Việt Nam có màu gì",
    },
    {
      eng: "orange",
      vie: "cam",
      categoryId: 0,
      quiz: "Màu gì có tên trùng với 1 loại quả",
    },
    {
      eng: "purple",
      vie: "tím",
      categoryId: 0,
      quiz: "Trộn màu đỏ và xanh da trời ta được màu gì",
    },
    {
      eng: "black",
      vie: "đen",
      categoryId: 0,
      quiz: "Ban đêm ta thường thấy màu gì",
    },
    {
      eng: "white",
      vie: "trắng",
      categoryId: 0,
      quiz: "Tờ giấy in thường có màu gì",
    },
    {
      eng: "journey",
      vie: "hành trình",
      categoryId: 1,
      quiz: "Một chuyến đi dài còn gọi là",
    },
    {
      eng: "destination",
      vie: "điểm đến",
      categoryId: 1,
      quiz: "Nếu bạn bay tới Thái Lan, thì Thái Lan là",
    },
    {
      eng: "explore",
      vie: "khám phá",
      categoryId: 1,
      quiz: "Bạn làm điều này khi tới thăm 1 địa điểm hoàn toàn mới lạ",
    },
    {
      eng: "adventure",
      vie: "phiêu lưu",
      categoryId: 1,
      quiz: "Một trải nghiệm đặc biệt, có thể đi kèm với rủi ro và nguy hiểm",
    },
    {
      eng: "culture",
      vie: "văn hóa",
      categoryId: 1,
      quiz: "... và xã hội",
    },
    {
      eng: "memorable",
      vie: "đáng nhớ",
      categoryId: 1,
      quiz: "Một thứ khó thể quên còn gọi là",
    },
    {
      eng: "itinerary",
      vie: "lịch trình",
      categoryId: 1,
      quiz: "Người trưởng đoàn thường phổ biến điều này đầu mỗi ngày",
    },
    {
      eng: "hospitality",
      vie: "lòng mến khách",
      categoryId: 1,
      quiz: "Một người nhân viên phục vụ nên có đặc điểm này",
    },
    {
      eng: "cuisine",
      vie: "ẩm thực",
      categoryId: 1,
      quiz: "Cách mà người ở một nơi thể hiện những món ăn của họ",
    },
    {
      eng: "souvenir",
      vie: "quà lưu niệm",
      categoryId: 1,
      quiz: "Khi sắp kết thúc 1 chuyến đi, người ta thường tìm mua những thứ này",
    },
    {
      eng: "artificial intelligence",
      vie: "trí tuệ nhân tạo",
      categoryId: 2,
      quiz: "Sự giả lập trí tuệ của con người trên máy tính gọi là",
    },
    {
      eng: "blockchain",
      vie: "chuỗi khối",
      categoryId: 2,
      quiz: "nền tảng đằng sau sự bùng nổ của các loại tiền điện tử như Bitcoin",
    },
    {
      eng: "quantum computer",
      vie: "máy tính lượng tử",
      categoryId: 2,
      quiz: "Loại máy tính có thể giải quyết một số loại vấn đề nhanh hơn máy tính cổ điển nhờ tận dụng các hiệu ứng cơ học lượng tử",
    },
    {
      eng: "internet of things",
      vie: "internet vạn vật",
      categoryId: 2,
      quiz: "Công nghệ giúp gần như mọi thứ có thể kết nối với internet",
    },
    {
      eng: "augmented reality",
      vie: "thực tế tăng cường",
      categoryId: 2,
      quiz: "Công nghệ giúp lồng ghép thế giới thực và thế giới ảo",
    },
    {
      eng: "machine learning",
      vie: "học máy",
      categoryId: 2,
      quiz: "Công nghệ giúp máy tính có thể đưa ra các dự đoán dựa trên dữ liệu đầu vào",
    },
    {
      eng: "biotechnology",
      vie: "công nghệ sinh học",
      categoryId: 2,
      quiz: "Công nghệ được tạo ra nhờ việc nghiên cứu các sinh vật sống",
    },
    {
      eng: "renewable energy",
      vie: "năng lượng tái tạo",
      categoryId: 2,
      quiz: "Năng lượng của tương lai",
    },
    {
      eng: "cybersecurity",
      vie: "an ninh mạng",
      categoryId: 2,
      quiz: "Công nghệ giúp phòng tránh rò rỉ dữ liệu trên không gian mạng",
    },
  ],
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/levels", (request, response) => {
  response.json(data.levels);
});

app.get("/api/categories", (request, response) => {
  const levelId = Number(request.query.levelId);
  const categories = data.categories.find(
    (category) => category.levelId === levelId
  );

  if (categories) {
    response.json(categories);
  } else {
    response.status(404).end();
  }
});

app.get("/api/words", (request, response) => {
  const categoryId = Number(request.query.categoryId);
  const words = data.words.find((word) => word.categoryId === categoryId);

  if (words) {
    response.json(words);
  } else {
    response.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
