import React, { useState } from "react";
import socket from "./socket";
import "./InitGame.css";

export default function InitGame({ setRoom, setOrientation, setPlayers }) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [findingOpponent, setFindingOpponent] = useState(false);

  const handlePlayOnline = () => {
    setFindingOpponent(true);
    socket.emit("findGame");
  };

  const handleCreateRoom = () => {
    socket.emit("createRoom", (roomId) => {
      setRoom(roomId);
      setOrientation("white");
      setPlayers([]);
    });
  };

  const handleJoinRoom = () => {
    socket.emit("joinRoom", { roomId }, (roomData) => {
      if (!roomData.error) {
        setRoom(roomId);
        setOrientation("black");
        setPlayers(roomData.players);
        setRoomDialogOpen(false);
      } else {
        alert(roomData.message);
      }
    });
  };

  return (
    <div className="init-game-container">
      <button onClick={handlePlayOnline}>Play Online</button>
      <button onClick={handleCreateRoom}>Create Room</button>
      <button onClick={() => setRoomDialogOpen(true)}>Join Room</button>

      {roomDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Join a Game</h3>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <button onClick={handleJoinRoom}>Join</button>
            <button onClick={() => setRoomDialogOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {findingOpponent && (
        <div className="loading-overlay">
          <div className="loading-message">
            <h3>Finding an opponent...</h3>
          </div>
        </div>
      )}
    </div>
  );
}
