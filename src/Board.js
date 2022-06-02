import { useState } from "react";

import Circle from "./Circle";

const Board = () => { 

  const [currentBoard, setCurrentBoard] = useState(Array(6).fill(Array(7).fill(null)));
  const [nextPlayerIsRed, setNextPlayerIsRed] = useState(true);


  const findLowestEmptyCell = (rowId, colId) => {
    let lowestEmptyRow = parseInt(rowId);

    if (lowestEmptyRow == 5) {
      return lowestEmptyRow; 
    } else {
      console.log(lowestEmptyRow)
      findLowestEmptyCell(lowestEmptyRow + 1, colId);
    }    
  }
  
  const handleClick = (e) => {
    e.target.style.backgroundColor = nextPlayerIsRed ? 'red' : 'yellow';    
    console.log(`You clicked on (${e.target.getAttribute('row')}, ${e.target.getAttribute('col')})`)
    let colClicked = e.target.getAttribute('col');
    let rowClicked = e.target.getAttribute('row')
    let lowestEmptyRow = findLowestEmptyCell(rowClicked, colClicked);

    console.log(lowestEmptyRow);

    setNextPlayerIsRed(!nextPlayerIsRed)
  }

  const renderCircle = (rowId, colId) => {
    return (
      <Circle onClick={handleClick} col={colId} row={rowId}/>
    );
  };


  return (
    <div className='game'>
      <div className='game-info'>
        Next Player: {nextPlayerIsRed ? 'Red' : 'Yellow'}
      </div>
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