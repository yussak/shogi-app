import { Piece } from "@/types";

type Props = {
  rowIndex: number;
  colIndex: number;
  piece: Piece;
  selectedPiece: Piece;
  isavailablePosition: boolean;
  handleCellClick: (piecerowIndex: number, colIndex: number) => void;
};

const Board = ({ rowIndex, colIndex, piece, isavailablePosition, selectedPiece, handleCellClick }: Props) => {
  return (
    <div
      key={`${rowIndex}-${colIndex}`}
      onClick={() => handleCellClick(rowIndex, colIndex)}
      style={{
        width: "70px",
        height: "70px",
        border: "1px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: isavailablePosition
          ? "#A3D2CA" // 移動可能位置の色
          : selectedPiece &&
            selectedPiece.position &&
            selectedPiece.position[0] === rowIndex &&
            selectedPiece.position[1] === colIndex
          ? "#FFD700" // 選択中の駒の色
          : "#F0D9B5",
      }}
    >
      {piece && (
        <div
          // 相手の駒の場合逆さまにする
          style={{ transform: piece.owner === OPPONENT ? "rotate(180deg)" : "none" }}
        >
          {piece && piece.type === "fuhyou" ? (piece.isPromoted ? "と" : "歩") : ""}
        </div>
      )}
    </div>
  );
};

export default Board;
