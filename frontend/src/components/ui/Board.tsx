import { Piece } from "@/types";
import Cell from "./Cell";
import { columns, rows } from "@/utils";

type Props = {
  pieces: Piece[];
  selectedPiece: Piece | null;
  handleCellClick: (row: number, col: number) => void;
  getAvailablePositions: (piece: Piece) => [number, number][];
};

const Board = ({ pieces, selectedPiece, handleCellClick, getAvailablePositions }: Props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9, 70px)",
        backgroundImage: "url('/images/board.jpeg')",
      }}
    >
      {rows.map((_, rowIndex) =>
        columns.map((_, colIndex) => {
          // マスに駒があるかを確認
          const piece = pieces.find((p) => p.position[0] === rowIndex && p.position[1] === colIndex);

          const movablePositions = selectedPiece ? getAvailablePositions(selectedPiece) : [];
          const isavailablePosition = movablePositions.some(
            (position) => position[0] === rowIndex && position[1] === colIndex
          );

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
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
