import { OPPONENT } from "@/consts";
import { Piece } from "@/types";
import Image from "next/image";

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
  gold: () => "金",
  silver: (piece) => (piece.isPromoted ? "と" : "銀"),
  lancer: (piece) => (piece.isPromoted ? "と" : "香"),
  bishop: (piece) => (piece.isPromoted ? "馬" : "角"),
}

const getPieceLabel = (piece: Piece) => {
  if (pieceLabels[piece.type] == null) return;
  return pieceLabels[piece.type](piece);
}

function getPieceImage(piece) {
  if (!piece.isPromoted) {

    switch (piece.type) {
      case "pawn":
        return "images/pieces/pawn.svg";
      case "gold":
        return "images/pieces/gold.svg";
      case "silver":
        return "images/pieces/silver.svg";
      case "lancer":
        return "images/pieces/lancer.svg";
      case "bishop":
        return "/images/pieces/bishop.svg";
      // 他の駒も同様に設定
      // default:
      //   return "images/pieces/default.svg"; // 画像がない場合のデフォルト
    }
  } else {
    switch (piece.type) {
      case "bishop":
        return "/images/pieces/uma.svg";
    }
  }
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
            : null,
      }}
    >
      {piece && (
        <div
          data-testid={`piece-${rowIndex}-${colIndex}`}
          // 相手の駒の場合逆さまにする
          style={{ transform: piece.owner === OPPONENT ? "rotate(180deg)" : "none" }}
        >
          <Image
            src={getPieceImage(piece)} // 駒の画像を取得する関数
            width={50}
            height={50}
            alt={getPieceLabel(piece)} // 駒のラベル（例: "歩"）
          />

        </div>
      )}
    </div>
  );
};

export default Cell;
