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

  { type: "rook", position: [7, 7], owner: PLAYER, isPromoted: false },

  { type: "king", position: [8, 4], owner: PLAYER, isPromoted: false },

  { type: "lancer", position: [8, 0], owner: PLAYER, isPromoted: false },
  { type: "knight", position: [8, 1], owner: PLAYER, isPromoted: false },
  { type: "silver", position: [8, 2], owner: PLAYER, isPromoted: false },
  { type: "gold", position: [8, 3], owner: PLAYER, isPromoted: false },
  { type: "gold", position: [8, 5], owner: PLAYER, isPromoted: false },
  { type: "silver", position: [8, 6], owner: PLAYER, isPromoted: false },
  { type: "knight", position: [8, 7], owner: PLAYER, isPromoted: false },
  { type: "lancer", position: [8, 8], owner: PLAYER, isPromoted: false },

  { type: "silver", position: [0, 2], owner: OPPONENT, isPromoted: false },
  { type: "gold", position: [0, 3], owner: OPPONENT, isPromoted: false },
  { type: "gold", position: [0, 5], owner: OPPONENT, isPromoted: false },
  { type: "silver", position: [0, 6], owner: OPPONENT, isPromoted: false },

  { type: "lancer", position: [0, 0], owner: OPPONENT, isPromoted: false },
  { type: "knight", position: [0, 1], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 0], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 1], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 2], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 3], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 4], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 5], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 6], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 7], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 8], owner: OPPONENT, isPromoted: false },
  { type: "knight", position: [0, 7], owner: OPPONENT, isPromoted: false },
  { type: "lancer", position: [0, 8], owner: OPPONENT, isPromoted: false },

  { type: "bishop", position: [1, 7], owner: OPPONENT, isPromoted: false },

  { type: "rook", position: [1, 1], owner: OPPONENT, isPromoted: false },

  { type: "king", position: [0, 4], owner: OPPONENT, isPromoted: false },

];

export const rows: number[] = Array.from({ length: 9 });
export const columns: number[] = Array.from({ length: 9 });

export const isPromotionZone = (owner: string, row: number) => {
  return (owner === PLAYER && row <= 2) || (owner === OPPONENT && row >= 6);
};

const pieceLabels = {
  pawn: (piece: Piece) => (piece.isPromoted ? "と" : "歩"),
  gold: () => "金",
  silver: (piece: Piece) => (piece.isPromoted ? "と" : "銀"),
  lancer: (piece: Piece) => (piece.isPromoted ? "と" : "香"),
  bishop: (piece: Piece) => (piece.isPromoted ? "馬" : "角"),
}

export const getPieceLabel = (piece: Piece) => {
  if (pieceLabels[piece.type] == null) return;
  return pieceLabels[piece.type](piece);
}

export function getPieceImage(piece: Piece) {
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
      case "knight":
        return "images/pieces/knight.svg";
      case "bishop":
        return "/images/pieces/bishop.svg";
      case "rook":
        return "/images/pieces/rook.svg";
      case "king":
        return "/images/pieces/king.svg";
    }
  } else {
    switch (piece.type) {
      case "pawn":
        return "images/pieces/to.svg";
      case "silver":
        return "images/pieces/gin-nari.svg";
      case "lancer":
        return "images/pieces/nari-kyou.svg";
      case "knight":
        return "images/pieces/nari-kei.svg";
      case "bishop":
        return "/images/pieces/uma.svg";
      case "rook":
        return "/images/pieces/ryu.svg";
    }
  }
}