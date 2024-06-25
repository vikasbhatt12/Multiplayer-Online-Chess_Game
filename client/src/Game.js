import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "./socket";
import "./Game.css";
import Chat from './Chat';

function Game({ players = [], room, orientation, cleanup, username }) {
  const chess = useMemo(() => new Chess(), []); 
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const copyMsgRef = useRef(null);
  const [squareStyles, setSquareStyles] = useState({});
  const [lastMove, setLastMove] = useState(null);
  const [hoverSquare, setHoverSquare] = useState(null);
  const [StylesLegal, setStylesLegal] = useState({});

  const removeHighlightSquares = () => {
    setSquareStyles({});
  };

  const removeHighlightLegalSquares = () => {
    setStylesLegal({});
  };

  const highlightLegalSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStylesLegal = [sourceSquare].concat(squaresToHighlight).reduce((a, c) => {
      return {
        ...a,
        [c]: {
          background: "radial-gradient(circle, rgba(0, 0, 0, 0.4) 46%, transparent 40%)",
          borderRadius: "50%",
        }
      };
    }, {});

    setStylesLegal({ ...highlightStylesLegal });
  };

  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare].concat(squaresToHighlight).reduce((a, c) => {
      return {
        ...a,
        [c]: {
          background: "radial-gradient(circle, rgba(0, 0, 0, 0.4) 46%, transparent 40%)",
          borderRadius: "50%",
        }
      };
    }, {});

    setSquareStyles(highlightStyles);
  };

  const updateSquareStyles = (move = null, hover = null) => {
    const styles = {};
    if (move) {
      styles[move.from] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
      styles[move.to] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }
    if (hover) {
      styles[hover] = { backgroundColor: 'rgba(0, 0, 255, 0.3)' };
    }
    setSquareStyles(styles);
  };

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        setFen(chess.fen());
        setLastMove(move);
        updateSquareStyles(move, hoverSquare);

        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            setOver(`Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`);
          } else if (chess.isDraw()) {
            setOver("Draw");
          } else {
            setOver("Game over");
          }
        }

        return result;
      } catch (e) {
        return null;
      }
    },
    [chess, hoverSquare]
  );

  function onDrop(sourceSquare, targetSquare) {
    removeHighlightLegalSquares();
    removeHighlightSquares();

    if (chess.turn() !== orientation[0]) return false;
    if (players.length < 2) return false;

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q",
    };

    const move = makeAMove(moveData);

    if (move === null) return false;

    socket.emit("move", {
      move,
      room,
    });

    return true;
  }

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move);
    });

    socket.on('playerDisconnected', (player) => {
      setOver(`${player.username} has disconnected`);
    });

    socket.on('closeRoom', ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });

    socket.on("hover", (square) => {
      setHoverSquare(square);
      updateSquareStyles(lastMove, square);
    });

    return () => {
      socket.off('move');
      socket.off('playerDisconnected');
      socket.off('closeRoom');
      socket.off('hover');
    };
  }, [makeAMove, room, cleanup, players, lastMove]);

  const getPlayer = (color) => {
    if (!Array.isArray(players)) return null;

    return players.find((player, index) => {
      if (orientation === "white") {
        return index === (color === "w" ? 0 : 1);
      } else {
        return index === (color === "w" ? 1 : 0);
      }
    });
  };

  const playerWhite = getPlayer("w");
  const playerBlack = getPlayer("b");

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(room).then(() => {
      const copyMsg = copyMsgRef.current;
      copyMsg.innerText = "Copied";
      copyMsg.classList.add("active");

      setTimeout(() => {
        copyMsg.classList.remove("active");
        copyMsg.innerText = ""; // Clear message after timeout
      }, 2000);
    });
  };

  const onMouseOverSquare = (square) => {
    removeHighlightLegalSquares();

    setHoverSquare(square);
    const moves = chess.moves({
      square: square,
      verbose: true
    });

    if (moves.length === 0) return;

    const squaresToHighlightLegal = moves.map(move => move.to);
    highlightLegalSquare(square, squaresToHighlightLegal);

    const squaresToHighlight = moves.map(move => move.to);
    highlightSquare(square, squaresToHighlight);
    updateSquareStyles(lastMove, square);
    socket.emit("hover", square);
  };

  const onMouseOutSquare = () => {
    removeHighlightLegalSquares();

    setHoverSquare(null);
    updateSquareStyles(lastMove);
    socket.emit("hover", null);
  };

  // Combine squareStyles and StylesLegal into a single object
  const combinedStyles = { ...squareStyles, ...StylesLegal };

  return (
    <div className="game-container">
      <div className="game-card">
        <h5>Room ID: {room}</h5>
        <button onClick={copyRoomIdToClipboard}>
          <span className="tooltip" ref={copyMsgRef}></span>
          Copy Room ID
        </button>
      </div>

      <div className="game-content">
        <div className="board-container">
          <div className="top_player">
            <img
              src={process.env.PUBLIC_URL + '/chess_profile.webp'}
              className="profile-pic"
              alt="Default Profile"
            />
            <h5>{playerBlack ? playerBlack.username : "Waiting for opponent..."}</h5>
          </div>
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            customSquareStyles={combinedStyles} // Pass combined styles as a prop
          />
          <div className="bottom_player">
            <img
              src={process.env.PUBLIC_URL + '/chess_profile.webp'}
              className="profile-pic"
              alt="Default Profile"
            />
            <h5>{playerWhite ? playerWhite.username : username}</h5>
          </div>
        </div>
      
        <div className="chat-section">
          <Chat roomId={room} username={username} />
        </div>
      </div>
      {over && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h4>{over}</h4>
            <button
              onClick={() => {
                socket.emit("closeRoom", { roomId: room });
                cleanup();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
