type CapturedPiece = {
  type: string;
  owner: "player" | "opponent";
};

const CapturedPieces = ({ pieces }: { pieces: CapturedPiece[] }) => {
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
        >
          {piece.type === "fuhyou" ? "歩" : ""}
        </div>
      ))}
    </div>
  );
};

export default CapturedPieces;
