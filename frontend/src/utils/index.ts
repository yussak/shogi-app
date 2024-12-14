import { OPPONENT, PLAYER } from "@/consts";
import { Piece } from "@/types";

export const initialPieces: Piece[] = [
  { type: "pawn", position: [6, 0], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 1], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 2], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 3], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 4], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 5], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 6], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 7], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 8], owner: PLAYER, isPromoted: false },

  { type: "bishop", position: [7, 1], owner: PLAYER, isPromoted: false },

  { type: "lancer", position: [8, 0], owner: PLAYER, isPromoted: false },
  { type: "silver", position: [8, 2], owner: PLAYER, isPromoted: false },
  { type: "gold", position: [8, 3], owner: PLAYER, isPromoted: false },
  { type: "gold", position: [8, 5], owner: PLAYER, isPromoted: false },
  { type: "silver", position: [8, 6], owner: PLAYER, isPromoted: false },
  { type: "lancer", position: [8, 8], owner: PLAYER, isPromoted: false },

  { type: "silver", position: [0, 2], owner: OPPONENT, isPromoted: false },
  { type: "gold", position: [0, 3], owner: OPPONENT, isPromoted: false },
  { type: "gold", position: [0, 5], owner: OPPONENT, isPromoted: false },
  { type: "silver", position: [0, 6], owner: OPPONENT, isPromoted: false },

  { type: "lancer", position: [0, 0], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 0], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 1], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 2], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 3], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 4], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 5], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 6], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 7], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 8], owner: OPPONENT, isPromoted: false },
  { type: "lancer", position: [0, 8], owner: OPPONENT, isPromoted: false },
];

export const rows: number[] = Array.from({ length: 9 });
export const columns: number[] = Array.from({ length: 9 });

export const isPromotionZone = (owner: string, row: number) => {
  return (owner === PLAYER && row <= 2) || (owner === OPPONENT && row >= 6);
};
