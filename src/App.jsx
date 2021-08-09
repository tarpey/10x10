import React, { useState, useEffect } from "react";

import "normalize.css";
import "./App.scss";

export default () => {
  const [squares, setSquares] = useState(
    new Array(100).fill().map((e, i) => {
      return { id: i };
    })
  );
  const [moves, setMoves] = useState([]);
  const [history, setHistory] = useState([]);
  const [nextMove, setNextMove] = useState([...Array(100).keys()]);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(localStorage.getItem("highScore"));

  useEffect(() => {
    if (nextMove.length === 0) {
      let score = moves.length;
      setGameOver(true);
      if (moves.length > highScore) {
        setHighScore(moves.length);
        localStorage.setItem("highScore", score);
      }
    }
  }, [moves]);

  const makeMove = (square) => {
    // Only empty squares
    if (nextMove.includes(square) && !squares[square].value) {
      squares[square].value = moves.length + 1;
      setSquares(squares);
      setHistory((history) => [...history, square]);
      setMoves((moves) => [...moves, moves.length + 1]);
      setNextMove(calculateNextPossibleMoves(square));
    }
  };

  const calculateNextPossibleMoves = (square) => {
    const lowerDiff = square - Math.floor(square / 10) * 10;
    const upperDiff = Math.ceil(square / 10) * 10 - square - 1;
    let options = [];

    // Check minus 3
    if (square - 3 >= 0) {
      if (lowerDiff >= 3) {
        options.push(square - 3);
      }
    }

    // Check minus 18
    if (square - 18 >= 0) {
      if (lowerDiff === 0 || upperDiff > 2) {
        options.push(square - 18);
      }
    }

    // Check minus 22
    if (square - 22 >= 0) {
      if (lowerDiff >= 2 || upperDiff === 0) {
        options.push(square - 22);
      }
    }

    // Check minus 30
    if (square - 30 >= 0) {
      if (lowerDiff === 0 || upperDiff > 0) {
        options.push(square - 30);
      }
    }

    // Check plus 30
    if (square + 30 < 100) {
      if (lowerDiff === 0 || upperDiff > 0) {
        options.push(square + 30);
      }
    }

    // Check plus 22
    if (square + 22 < 100) {
      if (lowerDiff === 0 || upperDiff > 2) {
        options.push(square + 22);
      }
    }

    // Check plus 18
    if (square + 18 < 100) {
      if (lowerDiff > 1) {
        options.push(square + 18);
      }
    }

    // Check plus 3
    if (square + 3 < 100) {
      if (lowerDiff === 0 || upperDiff > 3) {
        options.push(square + 3);
      }
    }

    options = options.filter(function (obj) {
      return history.indexOf(obj) == -1;
    });

    return options;
  };

  const undoLastMove = () => {
    if (history.length > 1) {
      setHistory(
        history.filter(function (name, index) {
          return index !== history.length - 1;
        })
      );
      setMoves(
        moves.filter(function (name, index) {
          return index !== moves.length - 1;
        })
      );
      squares[history[history.length - 1]].value = false;
      setSquares(squares);

      let lastMove = history
        .filter(function (name, index) {
          return index !== history.length - 1;
        })
        .pop();

      setNextMove(calculateNextPossibleMoves(lastMove));
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    if (window.confirm("Start again?")) {
      setMoves([]);
      setSquares(
        new Array(100).fill().map((e, i) => {
          return { id: i };
        })
      );
      setHistory([]);
      setNextMove([...Array(100).keys()]);
      setGameOver(false);
    }
  };

  return (
    <div className="App">
      <div className="controls">
        <div>
          Score: {moves.length}{" "}
          {moves.length > highScore ? <span>(PB)</span> : ""}
        </div>
        <div>
          {history.length > 0 && <button onClick={undoLastMove}>Undo</button>}
        </div>
        <div>
          <button onClick={resetGame}>Reset</button>
        </div>
      </div>
      <div className="grid">
        {squares.map((square) => (
          <div
            key={square.id}
            className={`square ${square.id} ${square.value && `taken`} ${
              square.id === history[history.length - 1] && `latest`
            } ${!square.value && nextMove.includes(square.id) && `available`}`}
            onClick={() => makeMove(square.id)}
          >
            {square.value ? square.value : "-"}
          </div>
        ))}
      </div>
    </div>
  );
};
