const Circle = ({row, col, onClick}) => {
  return (
    <div id='circle' onClick={onClick} row={row} col={col} className='empty'>
    </div>
  )
}

export default Circle;

