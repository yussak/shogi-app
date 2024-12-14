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
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px",
        border: "1px solid black",
      }}
      className="h-10"
    >
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
