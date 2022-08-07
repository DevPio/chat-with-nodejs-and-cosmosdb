const express = require("express");
const expressSession = require("express-session");
const { newMessage } = require("./models/message");
const { newRoom, getAllRoom } = require("./models/room");
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);
io.on("connect", async (socket) => {
  console.log("connect", socket.id);

  socket.on("room", async (room) => {
    const createdItem = await newRoom(room);

    socket.emit("room", createdItem.resource);
  });

  socket.on("msg", async (data) => {
    const dataParse = JSON.parse(data);
    const message = await newMessage(dataParse);

    socket.emit("msg", message.resource);
  });
});

app.use(
  expressSession({
    secret: "socket.io",
    cookie: {
      maxAge: 10 * 60 * 1000,
    },
  })
);
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

app.get("/rooms", async (_, res) => {
  const rooms = await getAllRoom();

  return res.json(rooms.resources);
});

http.listen(3001, () => console.log("Server is running..."));
