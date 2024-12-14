export type owner = "player" | "opponent";

export type Piece = {
  type: "pawn" | "gold" | "silver" | "lancer" | "knight" | "bishop" | "rook" | "king";
  position: [number, number];
  owner: owner;
  isPromoted: boolean;
};

export type CapturedPiece = {
  type: string;
  owner: owner;
};
