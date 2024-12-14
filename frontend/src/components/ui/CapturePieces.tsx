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
  // TODO:歩以外を取っても駒台に追加されないので直す
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
          {piece.type === "pawn" ? "歩" : ""}
        </div>
      ))}
    </div>
  );
};

export default CapturedPieces;
