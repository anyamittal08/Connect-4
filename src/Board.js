import { useState } from "react";

import Circle from "./Circle";

let boardTemplate = Array(6);
for (let i = 0; i < boardTemplate.length; i++) {
  boardTemplate[i] = Array(7).fill(null)
}

const Board = () => { 

  const [currentBoard, setCurrentBoard] = useState(boardTemplate);
  const [nextPlayerIsRed, setNextPlayerIsRed] = useState(true);

  let currentPlayer = nextPlayerIsRed ? 'red' : 'yellow'

  // render circles 
  const renderCircle = (rowId, colId) => {
    return (
      <Circle onClick={handleClick} col={colId} row={rowId}/>
    );
  };


  // find the lowest row that the token will be dropped to

  const findLowestEmptyCell = (rowId, colId) => {
    let lowestEmptyRow = parseInt(rowId);

    if (lowestEmptyRow === 5 || currentBoard[lowestEmptyRow + 1][colId]) {
      return lowestEmptyRow; 
    } else {
      return findLowestEmptyCell(lowestEmptyRow + 1, colId);
    }    
  }

  
  // win logic

  const determineWinner = (rowClicked, colClicked) => {

    // horizontal case 
    for (let i = 0; i < 7; i++) {
      if (currentBoard[rowClicked][i] && 
          currentBoard[rowClicked][i] === currentBoard[rowClicked][i+1] && 
          currentBoard[rowClicked][i+1]===currentBoard[rowClicked][i+2] &&
          currentBoard[rowClicked][i+2]===currentBoard[rowClicked][i+3]) return currentBoard[rowClicked][i]
    }
  
    // vertical case 
    for (let i = 0; i < 6; i++) {
      if(currentBoard[i][colClicked] &&
        currentBoard[i][colClicked] === currentBoard[i+1][colClicked] &&
        currentBoard[i+1][colClicked] === currentBoard[i+2][colClicked] &&
        currentBoard[i+2][colClicked] === currentBoard[i+3][colClicked]
        ) return currentBoard[i][colClicked]
    }

    // diagonal cases
    for (let i=0; i<currentBoard.length; i++) {
      for (let j=0; j<currentBoard[0].length; j++) {
        if (i+3<currentBoard.length) {
          if (j+3<currentBoard[0].length &&
              currentBoard[i][j] === currentBoard[i+1][j+1] &&
              currentBoard[i][j] === currentBoard[i+2][j+2] &&
              currentBoard[i][j] === currentBoard[i+3][j+3] 
            ) return currentBoard[i][j]

          if (j-3>=0 &&
              currentBoard[i][j] === currentBoard[i+1][j-1] &&
              currentBoard[i][j] === currentBoard[i+2][j-2] &&
              currentBoard[i][j] === currentBoard[i+3][j-3]
            ) return currentBoard[i][j]
        }
      }
    }
    console.log('here')
    return null;   
  }

  // click handler (main game mechanics)
  const handleClick = (e) => {
    let colClicked = e.target.getAttribute('col');
    let rowClicked = e.target.getAttribute('row');
    let lowestEmptyRow = findLowestEmptyCell(rowClicked, colClicked);
    let winner;
    
    if (currentBoard[lowestEmptyRow][colClicked]) return;

    document.getElementById([lowestEmptyRow, colClicked]).style.backgroundColor = currentPlayer

    let tempBoard = [...currentBoard];
    tempBoard[lowestEmptyRow][colClicked] = currentPlayer;
    
    
    setCurrentBoard(tempBoard);
    setNextPlayerIsRed(!nextPlayerIsRed)

    winner = determineWinner(rowClicked, colClicked);
    console.log(winner)
  }

  // restart/new game
  const newGame = () => {
    const makeNull = (elem) => elem = null;

    const newBoard = currentBoard.map(row => {
      return row.map(elem => makeNull(elem))
    }) // seems to be one step behind but does not affect game mechanics 

    setCurrentBoard(newBoard);

    document.querySelectorAll('.circle').forEach(elem => elem.style.backgroundColor = 'white')
  }

  // undo 

  const undo = () => {
    // undo
  }

  return (
    <div className='game'>
      <div className='game-info'>
        Next Player: {nextPlayerIsRed ? 'Red' : 'Yellow'}
      </div>
        <button className='btn restart-btn' onClick={newGame}> New game </button>  
        <button className='btn undo-btn' onClick={undo}> Undo </button>   
        <table className="game-board">
        <tbody>
            {
              currentBoard.map((rowArr, rowId) => {
                return (
                  <tr key={rowId}>
                    {
                      rowArr.map((square, colId) => {
                        return (
                          <td key={`${rowId}, ${colId}`}> 
                            {renderCircle(rowId ,colId)}
                          </td>
                        )                        
                      })
                    }
                  </tr>
                )                
              })
            }
        </tbody>
        </table>
    </div>
  );
};

export default Board;