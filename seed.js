require("dotenv").config();
const mongoose = require("mongoose");
const { Level } = require("./models");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then(async () => {
    console.log("connected to MongoDB");

    // Clear existing data
    await Level.deleteMany({});

    // Define initial data
    const levels = [
      {
        value: "BASIC",
        label: "Cơ bản",
        categories: [
          {
            label: "Màu sắc",
            words: [
              {
                eng: "red",
                vie: "đỏ",
                quiz: "Màu chủ đạo trên lá cờ Việt Nam là gì",
              },
              {
                eng: "blue",
                vie: "xanh dương",
                quiz: "Bầu trời có màu gì",
              },
              {
                eng: "green",
                vie: "xanh lá",
                quiz: "Lá cây có màu gì",
              },
              {
                eng: "yellow",
                vie: "vàng",
                quiz: "Ngôi sao trên lá cờ Việt Nam có màu gì",
              },
              {
                eng: "orange",
                vie: "cam",
                quiz: "Màu gì có tên trùng với 1 loại quả",
              },
              {
                eng: "purple",
                vie: "tím",
                quiz: "Trộn màu đỏ và xanh da trời ta được màu gì",
              },
              {
                eng: "black",
                vie: "đen",
                quiz: "Ban đêm ta thường thấy màu gì",
              },
              {
                eng: "white",
                vie: "trắng",
                quiz: "Tờ giấy in thường có màu gì",
              },
            ],
          },
        ],
      },
      {
        value: "INTERMEDIATE",
        label: "Trung bình",
        categories: [
          {
            label: "Du Lịch",
            words: [
              {
                eng: "journey",
                vie: "hành trình",
                quiz: "Một chuyến đi dài còn gọi là",
              },
              {
                eng: "destination",
                vie: "điểm đến",
                quiz: "Nếu bạn bay tới Thái Lan, thì Thái Lan là",
              },
              {
                eng: "explore",
                vie: "khám phá",
                quiz: "Bạn làm điều này khi tới thăm 1 địa điểm hoàn toàn mới lạ",
              },
              {
                eng: "adventure",
                vie: "phiêu lưu",
                quiz: "Một trải nghiệm đặc biệt, có thể đi kèm với rủi ro và nguy hiểm",
              },
              {
                eng: "culture",
                vie: "văn hóa",
                quiz: "... và xã hội",
              },
              {
                eng: "memorable",
                vie: "đáng nhớ",
                quiz: "Một thứ khó thể quên còn gọi là",
              },
              {
                eng: "itinerary",
                vie: "lịch trình",
                quiz: "Người trưởng đoàn thường phổ biến điều này đầu mỗi ngày",
              },
              {
                eng: "hospitality",
                vie: "lòng mến khách",
                quiz: "Một người nhân viên phục vụ nên có đặc điểm này",
              },
              {
                eng: "cuisine",
                vie: "ẩm thực",
                quiz: "Cách mà người ở một nơi thể hiện những món ăn của họ",
              },
              {
                eng: "souvenir",
                vie: "quà lưu niệm",
                quiz: "Khi sắp kết thúc 1 chuyến đi, người ta thường tìm mua những thứ này",
              },
            ],
          },
        ],
      },
      {
        value: "ADVANCED",
        label: "Nâng cao",
        categories: [
          {
            label: "Công nghệ",
            words: [
              {
                eng: "artificial intelligence",
                vie: "trí tuệ nhân tạo",
                quiz: "Sự giả lập trí tuệ của con người trên máy tính gọi là",
              },
              {
                eng: "blockchain",
                vie: "chuỗi khối",
                quiz: "nền tảng đằng sau sự bùng nổ của các loại tiền điện tử như Bitcoin",
              },
              {
                eng: "quantum computer",
                vie: "máy tính lượng tử",
                quiz: "Loại máy tính có thể giải quyết một số loại vấn đề nhanh hơn máy tính cổ điển nhờ tận dụng các hiệu ứng cơ học lượng tử",
              },
              {
                eng: "internet of things",
                vie: "internet vạn vật",
                quiz: "Công nghệ giúp gần như mọi thứ có thể kết nối với internet",
              },
              {
                eng: "augmented reality",
                vie: "thực tế tăng cường",
                quiz: "Công nghệ giúp lồng ghép thế giới thực và thế giới ảo",
              },
              {
                eng: "machine learning",
                vie: "học máy",
                quiz: "Công nghệ giúp máy tính có thể đưa ra các dự đoán dựa trên dữ liệu đầu vào",
              },
              {
                eng: "biotechnology",
                vie: "công nghệ sinh học",
                quiz: "Công nghệ được tạo ra nhờ việc nghiên cứu các sinh vật sống",
              },
              {
                eng: "renewable energy",
                vie: "năng lượng tái tạo",
                quiz: "Năng lượng của tương lai",
              },
              {
                eng: "cybersecurity",
                vie: "an ninh mạng",
                quiz: "Công nghệ giúp phòng tránh rò rỉ dữ liệu trên không gian mạng",
              },
            ],
          },
        ],
      },
    ];

    const initialLevels = await Level.insertMany(levels);

    const transformedLevels = await Level.updateMany(
      {},
      [
        {
          $set: {
            id: { $toString: "$_id" },
            categories: {
              $map: {
                input: "$categories",
                as: "category",
                in: {
                  id: { $toString: "$$category._id" },
                  label: "$$category.label",
                  words: {
                    $map: {
                      input: "$$category.words",
                      as: "word",
                      in: {
                        id: { $toString: "$$word._id" },
                        eng: "$$word.eng",
                        vie: "$$word.vie",
                        quiz: "$$word.quiz",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        { $unset: "_id" },
        { $unset: "__v" },
      ],
      { multi: true }
    );

    console.log("Initial data inserted successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
