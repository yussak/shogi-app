import Cell from "./Cell";

const Board = ({ rows, columns, pieces, selectedPiece, handleCellClick, getavailablePositions }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9, 70px)",
      }}
    >
      {rows.map((_, rowIndex) =>
        columns.map((_, colIndex) => {
          // マスに駒があるかを確認
          const piece = pieces.find((p) => p.position[0] === rowIndex && p.position[1] === colIndex);

          const movablePositions = selectedPiece ? getavailablePositions(selectedPiece) : [];
          const isavailablePosition = movablePositions.some(
            (position) => position[0] === rowIndex && position[1] === colIndex
          );

          return (
            <Cell
              rowIndex={rowIndex}
              colIndex={colIndex}
              piece={piece}
              isavailablePosition={isavailablePosition}
              selectedPiece={selectedPiece}
              handleCellClick={handleCellClick}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
