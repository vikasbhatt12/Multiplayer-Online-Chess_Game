import { io } from "socket.io-client"; // import connection function

const socket = io('https://elitechess.onrender.com'); // initialize websocket connection

export default socket;
