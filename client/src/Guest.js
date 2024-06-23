import React, { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Game from "./Game";
import InitGame from "./InitGame";
import CustomDialog from "./components/CustomDialog";
import socket from "./socket";
import { TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const HomeContainer = styled(Container)({
  paddingTop: "10px",
});


const WelcomeText = styled(Typography)({
  marginBottom: "20px"
});

export default function Guest() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);
 

  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers([]);
    
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      setPlayers(roomData.players);
      
    });

    socket.on("gameStart", ({ roomId, players, orientation }) => {
      setRoom(roomId);
      setOrientation(orientation);
      setPlayers(players);
    });

   


    return () => {
      socket.off("opponentJoined");
      socket.off("gameStart");
      
    };
  }, []);

  return (
    <HomeContainer>

      <CustomDialog
        open={!usernameSubmitted}
        handleClose={() => setUsernameSubmitted(true)}
        title="Pick a username"
        contentText="Please select a username"
        handleContinue={() => {
          if (!username) return;
          socket.emit("username", username);
          setUsernameSubmitted(true);
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
        />
      </CustomDialog>
      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={username}
          players={players}
          cleanup={cleanup}
        />
      ) : (
        <>
          <WelcomeText textAlign="center" variant="h4">
            Welcome to Multiplayer Chess
          </WelcomeText>
          <WelcomeText textAlign="center" variant="h5">
            Play chess with your friends online!
          </WelcomeText>
          <InitGame
            setRoom={setRoom}
            setOrientation={setOrientation}
            setPlayers={setPlayers}
            
          />
         
        </>
      )}
    </HomeContainer>
  );
}
