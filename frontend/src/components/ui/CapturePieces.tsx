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
    >
      {pieces.map((piece, index) => (
        <div
          key={index}
          style={{
            transform: piece.owner === "opponent" ? "rotate(180deg)" : "none",
          }}
          onClick={() => handleCapturedPieceClick(piece)}
        >
          {piece.type === "fuhyou" ? "歩" : ""}
        </div>
      ))}
    </div>
  );
};

export default CapturedPieces;
