import { owner, Piece } from "@/types";
import { PLAYER } from "@/consts";

/**
 * 指定した位置にある駒を取得する
 */
export const getPieceAtDestination = (pieces: Piece[], row: number, col: number): Piece | undefined => {
  return pieces.find((p) => p.position[0] === row && p.position[1] === col);
};

/**
 * 金の移動可能位置を取得
 */
export const getAvailableGoldPositions = (owner: owner, row: number, col: number): [number, number][] => {
  if (owner === PLAYER) {
    return [
      [row - 1, col],
      [row + 1, col],
      [row - 1, col - 1],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1],
    ];
  }
  return [
    [row + 1, col],
    [row - 1, col],
    [row + 1, col - 1],
    [row + 1, col + 1],
    [row, col - 1],
    [row, col + 1],
  ];
};

/**
 * 歩の移動可能位置を取得
 */
export const getAvailablePawnPositions = (owner: owner, row: number, col: number, isPromoted: boolean): [number, number][] => {
  if (isPromoted) {
    return getAvailableGoldPositions(owner, row, col);
  }

  return owner === PLAYER ? [[row - 1, col]] : [[row + 1, col]];
};

/**
 * 銀の移動可能位置を取得
 */
export const getAvailableSilverPositions = (owner: owner, row: number, col: number, isPromoted: boolean): [number, number][] => {
  if (isPromoted) {
    return getAvailableGoldPositions(owner, row, col);
  }
  return owner === PLAYER ? [
    [row - 1, col],
    [row + 1, col - 1],
    [row + 1, col + 1],
    [row - 1, col - 1],
    [row - 1, col + 1],
  ] : [
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
    [row - 1, col - 1],
    [row - 1, col + 1],
  ];
};

/**
 * 桂馬の移動可能位置を取得
 */
export const getAvailableKnightPositions = (owner: owner, row: number, col: number, isPromoted: boolean): [number, number][] => {
  if (isPromoted) {
    return getAvailableGoldPositions(owner, row, col);
  }
  return owner === PLAYER ? [
    [row - 2, col - 1],
    [row - 2, col + 1],
  ] : [
    [row + 2, col - 1],
    [row + 2, col + 1],
  ];
};

/**
 * 香車の移動可能位置を取得
 */
export const getAvailableLancerPositions = (pieces: Piece[], owner: owner, row: number, col: number, isPromoted: boolean): [number, number][] => {
  if (isPromoted) {
    return getAvailableGoldPositions(owner, row, col);
  }
  const potentialPositions: [number, number][] = [];
  for (let i = 1; i <= 8; i++) {
    const newRow = owner === PLAYER ? row - i : row + i;
    const pieceAtDestination = getPieceAtDestination(pieces, newRow, col);

    if (pieceAtDestination) {
      if (pieceAtDestination.owner !== owner) {
        // 相手の駒ならその位置は移動可能だが、それ以上は進めない
        potentialPositions.push([newRow, col]);
        break;
      }
      break; // 自分の駒があるのでそれ以上進めない
    }

    // 駒がない場合は移動可能
    potentialPositions.push([newRow, col]);
  }
  return potentialPositions;
};

/**
 * 角の移動可能位置を取得
 */
export const getAvailableBishopPositions = (pieces: Piece[], owner: owner, row: number, col: number, isPromoted: boolean): [number, number][] => {
  const potentialPositions: [number, number][] = [];
  const directions = [
    [-1, -1], // 左上
    [-1, 1],  // 右上
    [1, -1],  // 左下
    [1, 1]    // 右下
  ];

  for (const [dRow, dCol] of directions) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    while (currentRow >= 0 && currentRow < 9 && currentCol >= 0 && currentCol < 9) {
      // 駒の有無を確認する
      const pieceAtDestination = getPieceAtDestination(pieces, currentRow, currentCol);
      if (pieceAtDestination) {
        // 駒がある場合、自分の駒か敵の駒かで分岐
        if (pieceAtDestination.owner !== owner) {
          potentialPositions.push([currentRow, currentCol]); // 敵の駒を取れる
        }
        break; // 障害物があるのでそれ以上進めない
      }

      // 駒がない場合、移動可能
      potentialPositions.push([currentRow, currentCol]);
      currentRow += dRow;
      currentCol += dCol;
    }
  }

  if (isPromoted) {
    const promotedDirections = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dRow, dCol] of promotedDirections) {
      const currentRow = row + dRow;
      const currentCol = col + dCol;

      if (currentRow >= 0 && currentRow < 9 && currentCol >= 0 && currentCol < 9) {
        const pieceAtDestination = getPieceAtDestination(pieces, currentRow, currentCol);

        if (!pieceAtDestination || pieceAtDestination.owner !== owner) {
          potentialPositions.push([currentRow, currentCol]); // 空マスか敵駒なら追加
        }
      }
    }
  }

  return potentialPositions;
};

/**
 * 飛車の移動可能位置を取得
 */
export const getAvailableRookPositions = (pieces: Piece[], owner: owner, row: number, col: number, isPromoted: boolean): [number, number][] => {
  const potentialPositions: [number, number][] = [];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  for (const [dRow, dCol] of directions) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    while (currentRow >= 0 && currentRow < 9 && currentCol >= 0 && currentCol < 9) {
      // 駒の有無を確認する
      const pieceAtDestination = getPieceAtDestination(pieces, currentRow, currentCol);

      if (pieceAtDestination) {
        // 駒がある場合、自分の駒か敵の駒かで分岐
        if (pieceAtDestination.owner !== owner) {
          potentialPositions.push([currentRow, currentCol]); // 敵の駒を取れる
        }
        break; // 障害物があるのでそれ以上進めない
      }

      // 駒がない場合、移動可能
      potentialPositions.push([currentRow, currentCol]);
      currentRow += dRow;
      currentCol += dCol;
    }
  }

  if (isPromoted) {
    const promotedDirections = [
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
    ];
    for (const [dRow, dCol] of promotedDirections) {
      const currentRow = row + dRow;
      const currentCol = col + dCol;

      if (currentRow >= 0 && currentRow < 9 && currentCol >= 0 && currentCol < 9) {
        const pieceAtDestination = getPieceAtDestination(pieces, currentRow, currentCol);

        if (!pieceAtDestination || pieceAtDestination.owner !== owner) {
          potentialPositions.push([currentRow, currentCol]); // 空マスか敵駒なら追加
        }
      }
    }
  }

  return potentialPositions;
};

/**
 * 王の移動可能位置を取得
 */
export const getAvailableKingPositions = (owner: owner, row: number, col: number): [number, number][] => {
  return owner === PLAYER ? [
    [row - 1, col],
    [row + 1, col - 1],
    [row + 1, col + 1],
    [row - 1, col - 1],
    [row - 1, col + 1],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ] : [
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
  ];
};

/**
 * 駒の移動可能位置を取得するメイン関数
 */
export const getPieceMovementPositions = (pieces: Piece[], piece: Piece): [number, number][] => {
  const { type, position, owner, isPromoted } = piece;

  if (position == null) {
    return []; // 駒台の駒の場合は空配列を返す（別途処理が必要）
  }

  const [row, col] = position;
  let potentialPositions: [number, number][] = [];

  switch (type) {
    case "pawn":
      potentialPositions = getAvailablePawnPositions(owner, row, col, isPromoted);
      break;
    case "gold":
      potentialPositions = getAvailableGoldPositions(owner, row, col);
      break;
    case "silver":
      potentialPositions = getAvailableSilverPositions(owner, row, col, isPromoted);
      break;
    case "knight":
      potentialPositions = getAvailableKnightPositions(owner, row, col, isPromoted);
      break;
    case "lancer":
      potentialPositions = getAvailableLancerPositions(pieces, owner, row, col, isPromoted);
      break;
    case "bishop":
      potentialPositions = getAvailableBishopPositions(pieces, owner, row, col, isPromoted);
      break;
    case "rook":
      potentialPositions = getAvailableRookPositions(pieces, owner, row, col, isPromoted);
      break;
    case "king":
      potentialPositions = getAvailableKingPositions(owner, row, col);
      break;
    default:
      throw new Error(`Unknown type: ${type}`);
  }

  return potentialPositions.filter(([r, c]) => {
    const pieceAtDestination = getPieceAtDestination(pieces, r, c);
    // 移動先に駒がない、または移動先の駒が自分の駒じゃない部分を表示
    return !pieceAtDestination || pieceAtDestination.owner !== owner;
  });
};