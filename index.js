const express = require("express");
const expressSession = require("express-session");
const { newMessage, getAllMessage } = require("./models/message");
const { newRoom, getAllRoom } = require("./models/room");
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);
const sharedSession = require("express-socket.io-session");
const session = expressSession({
  secret: "socket.io",
  cookie: {
    maxAge: 10 * 60 * 1000,
  },
});

io.on("connect", async (socket) => {
  console.log("connect", socket.id);

  socket.on("room", async (room) => {
    const createdItem = await newRoom(room);

    socket.emit("room", createdItem.resource);
  });

  socket.on("sendAudio", async (blob) => {
    const message = await newMessage(blob);

    socket.to(blob.roomId).emit("msg", message.resource);
  });
  socket.on("msg", async (data) => {
    const dataParse = JSON.parse(data);
    const message = await newMessage(dataParse);

    socket.to(dataParse.roomId).emit("msg", message.resource);
  });

  socket.on("join", async (id) => {
    socket.join(id);
    const messages = await getAllMessage(id);

    console.log(messages);

    socket.emit("msgList", messages);
  });
});
io.use(sharedSession(session, { autoSave: true }));
io.use((socket, next) => {
  const session = socket.handshake.session;

  if (!session.user) {
    return next(new Error("user is not defined"));
  }

  return next();
});
app.use(session);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.set("view engine", "ejs");

app.get("/", (_, res) => res.render("index"));
app.get("/room", (_, res) => res.render("old-home"));
app.post("/", (req, res) => {
  const { name } = req.body;
  req.session.user = {
    name,
  };

  return res.redirect("room");
});
app.get("/user", (req, res) => {
  return res.json(req.session.user);
});
app.get("/rooms", async (_, res) => {
  const rooms = await getAllRoom();

  return res.json(rooms.resources);
});

http.listen(3001, () => console.log("Server is running..."));
