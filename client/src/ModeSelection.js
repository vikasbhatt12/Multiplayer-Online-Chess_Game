import React, { useState } from 'react';
import Game from './Game';
import socket from './socket';

function ModeSelection({ username }) {
  const [mode, setMode] = useState(null);
  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("white");
  const [players, setPlayers] = useState([]);

  const handleMultiplayer = () => {
    setMode('multiplayer');
    socket.emit('createRoom', (roomId) => {
      setRoom(roomId);
      setPlayers([{ id: socket.id, username }]);
    });
  };

  const handleComputer = () => {
    setMode('computer');
  };

  if (mode) {
    return <Game players={players} room={room} orientation={orientation} cleanup={() => setMode(null)} username={username} mode={mode} />;
  }

  return (
    <div>
      <h1>Choose Mode</h1>
      <button onClick={handleMultiplayer}>Play with Friend</button>
      <button onClick={handleComputer}>Play with Computer</button>
    </div>
  );
}

export default ModeSelection;
