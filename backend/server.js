const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoute");
const cors = require("cors");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting Down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
// const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log("DB connection successfull!"));
//-----------------------routes----------------//
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
// app.get("/", (req, res, next) => {
//   res.send("API is running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//------------------routes--------------///

//------------------deployment----------//

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log("in production");
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is Running..");
  });
}

//-------------------deployment--------//
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

//----------error-handling--------------//
process.on("unhandledRejection", (err) => {
  console.log("UNCAUGHT REJECTION! Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED, Shutting down gracefully");
  server.close(() => {
    console.log(" process terminated!");
  });
});
