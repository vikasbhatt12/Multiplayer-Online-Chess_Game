import { io } from "socket.io-client"; // import connection function

const socket = io('https://multiplayer-online-chess-game-server.vercel.app'); // initialize websocket connection

export default socket;