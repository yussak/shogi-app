import { OPPONENT } from "@/consts";
import { Piece } from "@/types";
import { getPieceImage, getPieceLabel } from "@/utils";
import Image from "next/image";

type Props = {
  rowIndex: number;
  colIndex: number;
  piece: Piece;
  selectedPiece: Piece | null;
  isavailablePosition: boolean;
  handleCellClick: (piecerowIndex: number, colIndex: number) => void;
};

const Cell = ({ rowIndex, colIndex, piece, isavailablePosition, selectedPiece, handleCellClick }: Props) => {
  return (
    <div
      key={`${rowIndex}-${colIndex}`}
      data-testid={`cell-${rowIndex}-${colIndex}`}
      onClick={() => handleCellClick(rowIndex, colIndex)}
      style={{
        width: "70px",
        height: "70px",
        border: "0.5px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative", // ドットを配置するためにrelative指定
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
      {/* ドットを追加 */}
      {((rowIndex === 2 && (colIndex === 2 || colIndex === 6)) || (rowIndex === 5 && (colIndex == 2 || colIndex === 6))) && (
        <div
          style={{
            position: "absolute",
            bottom: "-5px",
            right: "-5px",
            width: "10px",
            height: "10px",
            backgroundColor: "black",
            borderRadius: "50%",
          }}
        ></div>
      )}
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
