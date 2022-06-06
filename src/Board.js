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
  
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[rowClicked][i] && 
          currentBoard[rowClicked][i] === currentBoard[rowClicked][i+1] && 
          currentBoard[rowClicked][i+1]===currentBoard[rowClicked][i+2] &&
          currentBoard[rowClicked][i+2]===currentBoard[rowClicked][i+3]) {
        return currentBoard[rowClicked][i]
          }
    }
  
    // vertical case 
  
    for (let i = 0; i < currentBoard[i].length; i++) {
      if(currentBoard[i][colClicked] &&
        currentBoard[i][colClicked] === currentBoard[i+1][colClicked] &&
        currentBoard[i+1][colClicked] === currentBoard[i+2][colClicked] &&
        currentBoard[i+2][colClicked] === currentBoard[i+3][colClicked]
        ) {
        return currentBoard[i][colClicked]
        } 
    }

    // ascending diagonal cases

    for (let i = 3; i < 6; i++) {
      for (let j=0; j <= 3; j++) {
        if (currentBoard[i][j] &&
          currentBoard[i][j] === currentBoard[i+1][j+1] &&
          currentBoard[i-1][j+1] === currentBoard[i-2][j+2] &&
          currentBoard[i-2][j+2] === currentBoard[i-3][j+3]
        ) return currentBoard[i][j]
      }
    }

    for (let i = 3; i < 7; i++) {
      for (let j=3; j < 6; j++) {
        if (currentBoard[i][j] &&
          currentBoard[i][j] === currentBoard[i-1][j-1] &&
          currentBoard[i-1][j-1] === currentBoard[i-2][j-2] &&
          currentBoard[i-2][j-2] === currentBoard[i-3][j-3]
          ) {
            return currentBoard[i][j]
          }
      }
    }
  }

  // const determineWinner = (rowClicked, colClicked) => {
  //   for (let i=0; i < currentBoard.length; i++) {
  //       // horizontal check
  //       if (i+3 < currentBoard.length &&
  //           currentBoard[rowClicked][i] === currentBoard[rowClicked][i+1] &&
  //           currentBoard[rowClicked][i] === currentBoard[rowClicked][i+2] &&
  //           currentBoard[rowClicked][i] === currentBoard[rowClicked][i+3]
  //         ) return currentBoard[rowClicked][i];

  //       }

  //       //vertical check 
  //   for (let j=0; j<currentBoard[0].length; j++) {
  //     if (j+3 < currentBoard[0].length &&
  //         currentBoard[j][colClicked] === currentBoard[j+1][colClicked] &&
  //         currentBoard[j][colClicked] === currentBoard[j+2][colClicked] &&
  //         currentBoard[j][colClicked] === currentBoard[j+3][colClicked]
  //       ) return currentBoard[j][colClicked];

  //   }

  //   for (let i=0; i<currentBoard.length; i++) {
  //     for (let j=0; j<currentBoard[0].length; j++) {
  //       if (!currentBoard[i][j]) return;

  //       if (i+3 < currentBoard.length) {

  //             //diagonals going down 
  //             if (
  //               j + 3 < currentBoard[0].length &&
  //               currentBoard[i][j] === currentBoard[i+1][j+1] &&
  //               currentBoard[i][j] === currentBoard[i+2][j+2] &&
  //               currentBoard[i][j] === currentBoard[i+3][j+3]
  //             ) return currentBoard[i][j];

  //             //diagonals going up
  //             if (
  //               j-3 >= 0 &&
  //               currentBoard[i][j] === currentBoard[i+1][j-1] &&
  //               currentBoard[i][j] === currentBoard[i+2][j-2] &&
  //               currentBoard[i][j] === currentBoard[i+3][j-3] 
  //             ) return currentBoard[i][j]
  //           }
            
  //     }
  //   }
      
  //   }


  // click handler (main game mechanics)
  const handleClick = (e) => {
    let colClicked = e.target.getAttribute('col');
    let rowClicked = e.target.getAttribute('row');
    let lowestEmptyRow = findLowestEmptyCell(rowClicked, colClicked);
    
    if (currentBoard[lowestEmptyRow][colClicked]) return;

    document.getElementById([lowestEmptyRow, colClicked]).style.backgroundColor = currentPlayer

    let tempBoard = [...currentBoard];
    tempBoard[lowestEmptyRow][colClicked] = currentPlayer;
    
    let winner = determineWinner(rowClicked, colClicked);
    console.log(winner)

    setCurrentBoard(tempBoard);
    setNextPlayerIsRed(!nextPlayerIsRed)
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