import { useState } from "react";

import Circle from "./Circle";

let boardTemplate = Array(6);
for (let i = 0; i < boardTemplate.length; i++) {
  boardTemplate[i] = Array(7).fill(null)
}

const Board = () => { 

  const [currentBoard, setCurrentBoard] = useState(boardTemplate);
  const [nextPlayerIsRed, setNextPlayerIsRed] = useState(true);

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
  
  // click handler (main game mechanics)
  const handleClick = (e) => {
    let colClicked = e.target.getAttribute('col');
    let rowClicked = e.target.getAttribute('row')
    let lowestEmptyRow = findLowestEmptyCell(rowClicked, colClicked);
    
    if (currentBoard[lowestEmptyRow][colClicked]) return;

    document.getElementById([lowestEmptyRow, colClicked]).style.backgroundColor = nextPlayerIsRed ? 'red' : 'yellow'

    let tempBoard = [...currentBoard];
    tempBoard[lowestEmptyRow][colClicked] = nextPlayerIsRed ? 'red' : 'yellow'
    
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

  return (
    <div className='game'>
      <div className='game-info'>
        Next Player: {nextPlayerIsRed ? 'Red' : 'Yellow'}
      </div>
        <button className='btn restart-btn' onClick={newGame}> New game </button>     
        <table className="game-board">
        <tbody>
            {
              currentBoard.map((rowArr, rowId) => {
                return (
                  <tr id={rowId}>
                    {
                      rowArr.map((square, colId) => {
                        return (
                          <td> 
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