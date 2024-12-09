export type owner = "player" | "opponent";

export type Piece = {
  type: "pawn" | "gold" | "silver" | "lancer";
  position: [number, number];
  owner: owner;
  isPromoted: boolean;
};

export type CapturedPiece = {
  type: string;
  owner: owner;
};
