import { useState } from "react";

import Circle from "./Circle";

let boardTemplate = Array(6);
for (let i = 0; i < boardTemplate.length; i++) {
  boardTemplate[i] = Array(7).fill(null);
}

const Board = () => {
  const [nextPlayerIsRed, setNextPlayerIsRed] = useState(true);
  const [history, setHistory] = useState([
    { board: JSON.parse(JSON.stringify(boardTemplate)) },
  ]);

  let currentPlayer = nextPlayerIsRed ? "red" : "yellow";
  let current = history[history.length - 1];

  // render circles
  const renderCircle = (rowId, colId) => {
    return <Circle onClick={handleClick} col={colId} row={rowId} />;
  };

  // win logic
  const determineWinner = () => {
    let height = current.board.length;
    let width = current.board[0].length;
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        let player = current.board[r][c];
        if (player !== null) {
          if (
            c + 3 < width &&
            player === current.board[r][c + 1] &&
            player === current.board[r][c + 2] &&
            player === current.board[r][c + 3]
          ) {
            return player;
          }

          if (r + 3 < height) {
            if (
              player === current.board[r + 1][c] &&
              player === current.board[r + 2][c] &&
              player === current.board[r + 3][c]
            ) {
              return player;
            }

            if (
              c + 3 < width &&
              player === current.board[r + 1][c + 1] &&
              player === current.board[r + 2][c + 2] &&
              player === current.board[r + 3][c + 3]
            ) {
              return player;
            }

            if (
              c - 3 >= 0 &&
              player === current.board[r + 1][c - 1] &&
              player === current.board[r + 2][c - 2] &&
              player === current.board[r + 3][c - 3]
            ) {
              return player;
            }
          }
        }
      }
    }
  };

  // find the lowest row that the token will be dropped to
  const findLowestEmptyCell = (rowId, colId) => {
    let lowestEmptyRow = parseInt(rowId);

    if (lowestEmptyRow === 5 || current.board[lowestEmptyRow + 1][colId]) {
      return lowestEmptyRow;
    } else {
      return findLowestEmptyCell(lowestEmptyRow + 1, colId);
    }
  };

  // click handler (main game mechanics)
  const handleClick = (e) => {
    let colClicked = e.target.getAttribute("col");
    let rowClicked = e.target.getAttribute("row");
    let lowestEmptyRow = findLowestEmptyCell(rowClicked, colClicked);

    if (current.board[lowestEmptyRow][colClicked] || determineWinner()) return;

    document.getElementById([
      lowestEmptyRow,
      colClicked,
    ]).style.backgroundColor = currentPlayer;

    let tempBoard = JSON.parse(JSON.stringify(current.board));
    tempBoard[lowestEmptyRow][colClicked] = currentPlayer;

    let tempHistory = history.concat([
      {
        board: tempBoard,
      },
    ]);

    setHistory(tempHistory);

    setNextPlayerIsRed(!nextPlayerIsRed);
  };

  // restart/new game
  const newGame = () => {
    setHistory([{ board: JSON.parse(JSON.stringify(boardTemplate)) }]);
    setNextPlayerIsRed(true);

    document
      .querySelectorAll(".circle")
      .forEach((elem) => (elem.style.backgroundColor = "white"));
  };

  const gameIsADraw = () => {
    let draw = true;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (current.board[i][j] === null) {
          draw = false;
        }
      }
    }
    return draw;
  };

  // undo

  const undo = () => {
    if (history.length <= 1) return;
    current = history[history.length - 2];

    current.board.forEach((row, rowId) => {
      row.forEach((circle, colId) => {
        if (circle === null) {
          document.getElementById([rowId, colId]).style.backgroundColor =
            "white";
        } else
          document.getElementById([rowId, colId]).style.backgroundColor =
            circle;
      });
    });

    let tempHistory = history.slice(0, history.length - 1);

    setHistory(tempHistory);
  };

  let winner = determineWinner();

  return (
    <div className="game">
      <div className="game-info">
        {winner
          ? `${winner} wins!`
          : gameIsADraw()
          ? "It's a draw!"
          : nextPlayerIsRed
          ? "Next Player: Red"
          : "Next Player: Yellow"}
      </div>
      <button className="btn restart-btn" onClick={newGame}>
        {" "}
        New game{" "}
      </button>
      <button className="btn undo-btn" onClick={undo}>
        {" "}
        Undo{" "}
      </button>
      <table className="game-board">
        <tbody>
          {current.board.map((rowArr, rowId) => {
            return (
              <tr key={rowId}>
                {rowArr.map((circle, colId) => {
                  return (
                    <td key={`${rowId}, ${colId}`}>
                      {renderCircle(rowId, colId)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Board;
