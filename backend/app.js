// const express = require("express");
// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoute");
// const path = require("path");
// const cors = require("cors");
// // const { chats } = require("./data/data");
// const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
// app.use(express.json());
// app.get("/", (req, res, next) => {
//   res.send("API is running");
// });

// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   console.log("in production");
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is Running..");
//   });
// }

// module.exports = app;
