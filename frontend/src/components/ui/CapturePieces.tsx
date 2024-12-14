import { getPieceImage, getPieceLabel } from "@/utils";
import Image from "next/image";

type CapturedPiece = {
  type: string;
  owner: "player" | "opponent";
};

const CapturedPieces = ({
  pieces,
  handleCapturedPieceClick,
}: {
  pieces: CapturedPiece[];
  handleCapturedPieceClick: (piece: CapturedPiece) => void;
}) => {
  return (
    // TODO:歩以外も駒台から打てるようにする
    // TODO:歩以外も駒台から打つ時の可能な位置を色で表示
    <div>
      {pieces.map((piece, index) => (
        <div
          key={index}
          data-testid={`captured-piece-${piece.owner}`}
          style={{
            transform: piece.owner === "opponent" ? "rotate(180deg)" : "none",
          }}
          onClick={() => handleCapturedPieceClick(piece)}
        >
          <Image
            src={getPieceImage(piece)}
            width={50}
            height={50}
            alt={getPieceLabel(piece)}
          />

        </div>
      ))}
    </div>
  );
};

export default CapturedPieces;
