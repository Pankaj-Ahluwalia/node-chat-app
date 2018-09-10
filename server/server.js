const express = require("express"); //Behind scened express uses http module (built-in)
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
// app.use((req,res,next)=>{
//     res.send("Hello World!");
// });

// WEBSOCKET-SERVER: capture reference to websocket server
const io = socketIO(server);

const users = new Users(); // create new instance of Users:

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

io.on("connection", socket => {
  // console.log("new user crated");

  // socket.join(room[, callback])  ... Returns Socket for chaining
  // socket.leave(room[, callback]) ....Returns Socket for chaining

  socket.on("join", (params, callback) => {
    const theRoom = params.room;
    const theUserName = params.name;

    if (!isRealString(params.name) || !isRealString(theRoom)) {
      return callback("Invalid name or room");
    }

    // A) JOIN ROOM
    socket.join(theRoom, () => {
      // console.log(`${params.name} has joined room: ${theRoom}`);

      // ensure that use is logged out of previous room
      users.removeUser(socket.id);

      // create new user:
      users.addUser(socket.id, theUserName, theRoom);

      // capture users in current room
      const arrRoomUsers = users.getUserList(theRoom);

      // console.log(`Users in Room: `, arrRoomUsers);

      // Emit-Event: Broadcast to ROOM....................
      io.to(theRoom).emit("updateUserList", arrRoomUsers);
    });

    // 1. To Current Socket: Private--> Welcome message .....
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Hi ${params.name}, Welcome to room: ${theRoom}`)
    );

    // 2. To ROOM: Broradcast ---> new user joined ---
    socket
      .to(theRoom)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined.`)
      );

    //https://socket.io/docs/server-api/#socket-join-room-callback
    // io.to('room 237').emit('a new user has joined the room'); // broadcast to everyone in the room
    // socket.to(id).emit('my message', msg);

    // // Andrew ............. also OK
    // socket.broadcast.to(params.room).emit("newMessage",
    //   generateMessage("Admin", `${params.name} has joined.`)
    // );

    // console.log(`${params.name} has joined room: ${theRoom}`)

    //B. socket.leave('The office fans')

    callback();
  });

  // Handle message sent by client
  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      socket.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
    }
   
    callback();
  });

  socket.on("createLocationMessage", coords => {
    // broadcast to all
    const user = users.getUser(socket.id);

    if (user)
    {
      io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords));
    }
    

    // io.emit("newLocationMessage", generateLocationMessage("Admin", coords));
    // io.emit('newMessage',generateLocationMessage('Admin',`${coords.latitude}, ${coords.longitude}`));
  });

  // User Disconnected
  socket.on("disconnect", () => {
    // console.log("user was dis-connected.");

    // remove user
    const userRemoved = users.removeUser(socket.id);

    if (userRemoved) {
      const roomLeft = userRemoved.room;

      io.to(roomLeft).emit("updateUserList", users.getUserList(roomLeft));

      io.to(roomLeft).emit(
        "newMessage",
        generateMessage("Admin", `${userRemoved.name} has left.`)
      );
    }
  });
});

server.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});

// app.listen(PORT,()=>{
//     console.log("Server is running on Port: " + PORT);
// });
