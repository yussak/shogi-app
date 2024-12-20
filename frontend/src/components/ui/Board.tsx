import { Piece } from "@/types";
import Cell from "./Cell";
import { columns, rows } from "@/utils";

type Props = {
  pieces: Piece[];
  selectedPiece: Piece | null;
  handleCellClick: (row: number, col: number) => void;
  getAvailablePositions: (piece: Piece) => [number, number][];
};

const kanjiNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

const Board = ({ pieces, selectedPiece, handleCellClick, getAvailablePositions }: Props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9, 70px) 40px", // 将棋盤 + 右端の番号
        gridTemplateRows: "40px repeat(9, 70px)", // 上端の番号 + 将棋盤
        backgroundImage: "url('/images/board.jpeg')",
        padding: "10px",
      }}
    >
      {/* 上辺の番号 */}
      {Array.from({ length: 9 }).map((_, colIndex) => (
        <div
          key={`top-number-${colIndex}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          {9 - colIndex}
        </div>
      ))}

      {/* 左上隅に空白 */}
      <div />

      {/* 盤面 + 右辺の番号 */}
      {rows.map((_, rowIndex) => (
        <>
          {/* 将棋盤 */}
          {columns.map((_, colIndex) => {
            const piece = pieces.find(
              (p) => p.position[0] === rowIndex && p.position[1] === colIndex
            ) || null;

            const movablePositions = selectedPiece
              ? getAvailablePositions(selectedPiece)
              : [];
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
          })}

          {/* 右辺の番号 */}
          <div
            key={`right-number-${rowIndex}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            {kanjiNumbers[rowIndex]}
          </div>
        </>
      ))}
    </div>

  );
};

export default Board;
