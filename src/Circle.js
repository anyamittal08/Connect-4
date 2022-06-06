const Circle = ({ row, col, onClick }) => {
  return (
    <div
      className="circle"
      onClick={onClick}
      row={row}
      col={col}
      id={[row, col]}
    ></div>
  );
};

export default Circle;
