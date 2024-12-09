import { OPPONENT } from "@/consts";
import { Piece } from "@/types";

type Props = {
  rowIndex: number;
  colIndex: number;
  piece: Piece;
  selectedPiece: Piece | null;
  isavailablePosition: boolean;
  handleCellClick: (piecerowIndex: number, colIndex: number) => void;
};

const pieceLabels = {
  pawn: (piece) => (piece.isPromoted ? "と" : "歩"),
  gold: () => "金"
}

const getPieceLabel = (piece: Piece) => {
  if (pieceLabels[piece.type] == null) return;
  return pieceLabels[piece.type](piece);
}

const Cell = ({ rowIndex, colIndex, piece, isavailablePosition, selectedPiece, handleCellClick }: Props) => {
  return (
    <div
      key={`${rowIndex}-${colIndex}`}
      data-testid={`cell-${rowIndex}-${colIndex}`}
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
          data-testid={`piece-${rowIndex}-${colIndex}`}
          // 相手の駒の場合逆さまにする
          style={{ transform: piece.owner === OPPONENT ? "rotate(180deg)" : "none" }}
        >
          {piece && getPieceLabel(piece)}
        </div>
      )}
    </div>
  );
};

export default Cell;
