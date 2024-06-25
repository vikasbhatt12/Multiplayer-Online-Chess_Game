const express = require('express');
const { Server } = require("socket.io");
const { v4: uuidV4 } = require('uuid');
const http = require('http');

const app = express(); 
app.use(cors({
  origin: 'https://multiplayer-online-chess-game.vercel.app',  
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);
const port = process.env.PORT || 8080;

const io = new Server(server, {
  cors: 'https://multiplayer-online-chess-game.vercel.app',
});

const rooms = new Map();
const waitingPlayers = [];

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('username', (username) => {
    console.log('username:', username);
    socket.data.username = username;
  });

  socket.on('createRoom', async (callback) => { 
    const roomId = uuidV4();
    await socket.join(roomId);
    rooms.set(roomId, { 
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }]
    });
    callback(roomId);
  });

  socket.on('joinRoom', async (args, callback) => {
    const room = rooms.get(args.roomId);
    let error, message;
  
    if (!room) { 
      error = true;
      message = 'room does not exist';
    } else if (room.players.length >= 2) {
      error = true;
      message = 'room is full';
    }

    if (error) {
      if (callback) {
        callback({ error, message });
      }
      return;
    }

    await socket.join(args.roomId);
    room.players.push({ id: socket.id, username: socket.data?.username });
    rooms.set(args.roomId, room);

    callback(room);
    socket.to(args.roomId).emit('opponentJoined', room);
  });

  socket.on('move', (data) => {
    socket.to(data.room).emit('move', data.move);
  });

  socket.on('chatMessage', ({ roomId, message, username}) => {
    io.to(roomId).emit('chatMessage', { username, message });
  });

  socket.on('timerUpdate', ({ room, whiteTimer, blackTimer, isWhiteActive }) => {
    io.to(room).emit('timerUpdate', { whiteTimer, blackTimer, isWhiteActive });
  });

  socket.on("findGame", () => {
    if (waitingPlayers.length > 0) {
      const opponentSocket = waitingPlayers.shift();
      const roomId = uuidV4();

      opponentSocket.join(roomId);
      socket.join(roomId);

      const players = [
        { id: opponentSocket.id, username: opponentSocket.data?.username },
        { id: socket.id, username: socket.data?.username }
      ];

      rooms.set(roomId, { roomId, players });

      opponentSocket.emit("gameStart", {
        roomId,
        players,
        orientation: "white",
      });

      socket.emit("gameStart", {
        roomId,
        players,
        orientation: "black",
      });
    } else {
      waitingPlayers.push(socket);
      socket.emit("waitingForOpponent");
    }
  });

  socket.on("disconnect", () => {
    const gameRooms = Array.from(rooms.values());

    gameRooms.forEach((room) => {
      const userInRoom = room.players.find((player) => player.id === socket.id);

      if (userInRoom) {
        if (room.players.length < 2) {
          rooms.delete(room.roomId);
          return;
        }
        socket.to(room.roomId).emit("playerDisconnected", userInRoom);
      }
    });

    const waitingIndex = waitingPlayers.indexOf(socket);
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }
  });

  socket.on("closeRoom", async (data) => {
    socket.to(data.roomId).emit("closeRoom", data);

    const clientSockets = await io.in(data.roomId).fetchSockets();
    clientSockets.forEach((s) => {
      s.leave(data.roomId);
    });
    rooms.delete(data.roomId);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
