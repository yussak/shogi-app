"use client";

import CapturedPieces from "@/components/ui/CapturePieces";
import { OPPONENT, PLAYER } from "@/consts";
import { CapturedPiece, owner, Piece } from "@/types";
import { useState } from "react";
import Board from "@/components/ui/Board";
import { initialPieces, isPromotionZone } from "@/utils";

export default function Home({ initialPiecesOverride }: { initialPiecesOverride?: Piece[] }) {
  const [pieces, setPieces] = useState<Piece[]>(initialPiecesOverride || initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([]);

  const canPlaceCapturedPiece = (owner: owner, targetRow: number, targetCol: number) => {
    // 二歩できなくする
    // 駒台の駒はpositionがないので今ある駒かがないところみたいな判定が必要なのでselectedPieceは使えない
    const isPawnInColumn = pieces.some(
      (p) => p.type === "pawn" && p.position[1] === targetCol && !p.isPromoted && p.owner === owner
    );

    const isInvalidRow = owner === PLAYER ? targetRow === 0 : targetRow === 8;

    return !isPawnInColumn && !isInvalidRow;
  };

  // 駒がある位置に移動可能か判定
  const canMoveTo = (selectedPiece: Piece, targetRow: number, targetCol: number): boolean => {
    const { owner, position } = selectedPiece;

    // 移動先の駒のownerが同じなら移動できなくする
    const pieceAtDestination = pieces.find((p) => p.position[0] === targetRow && p.position[1] === targetCol);
    if (pieceAtDestination && owner === pieceAtDestination.owner) {
      return false;
    }

    if (position == null) {
      // 駒台から打てる場所を表示
      return canPlaceCapturedPiece(owner, targetRow, targetCol);
    }

    const availablePositions = getAvailablePositions(selectedPiece);
    return availablePositions.some(([row, col]) => row === targetRow && col === targetCol);
  };

  const generateRows = (owner: owner) => {
    // 1~8行目か0~7行目
    return owner === PLAYER
      ? Array.from({ length: 8 }, (_, row) => row + 1)
      : Array.from({ length: 8 }, (_, row) => row);
  };

  const generatePositions = (rows: number[]) => {
    return rows.flatMap((row) => Array.from({ length: 9 }, (_, col) => [row, col] as [number, number]));
  };

  const isPositionAvailable = (row: number, col: number, owner: owner) => {
    return (
      !pieces.some((p) => p.position[0] === row && p.position[1] === col) && // そのマスに駒がない
      !pieces.some((p) => p.type === "pawn" && !p.isPromoted && p.position[1] === col && p.owner === owner)
    ); // 同じ列に歩がない
  };

  const getAvailableGoldPositions = (owner: owner, row: number, col: number): [number, number][] => {
    if (owner === PLAYER) {
      return [
        [row - 1, col],
        [row + 1, col],
        [row - 1, col - 1],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
      ]
    }
    return [
      [row + 1, col],
      [row - 1, col],
      [row + 1, col - 1],
      [row + 1, col + 1],
      [row, col - 1],
      [row, col + 1],
    ]
  }

  const getAvailablePawnPositions = (owner: owner, row: number, col: number, isPromoted: Boolean): [number, number][] => {
    if (isPromoted) {
      return getAvailableGoldPositions(owner, row, col);
    }

    return owner === PLAYER ? [[row - 1, col]] : [[row + 1, col]];
  }

  const getAvailableSilverPositions = (owner: owner, row: number, col: number, isPromoted: Boolean): [number, number][] => {
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
  }

  const getAvailableKnightPositions = (owner: owner, row: number, col: number, isPromoted: Boolean): [number, number][] => {
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
  }

  const getAvailableLancerPositions = (owner: owner, row: number, col: number, isPromoted: Boolean): [number, number][] => {
    if (isPromoted) {
      return getAvailableGoldPositions(owner, row, col);
    }
    const potentialPositions: [number, number][] = [];
    for (let i = 1; i <= 8; i++) {
      const newRow = owner === PLAYER ? row - i : row + i;
      const pieceAtDestination = pieces.find(
        (p) => p.position && p.position[0] === newRow && p.position[1] === col
      );

      if (pieceAtDestination) {
        if (pieceAtDestination.owner !== owner) {
          // 相手の駒ならその位置は移動可能だが、それ以上は進めない
          potentialPositions.push([newRow, col]);
          break;
        }
      }

      // 駒がない場合は移動可能
      potentialPositions.push([newRow, col]);
    }
    return potentialPositions;
  }

  const getAvailableBishopPositions = (owner: owner, row: number, col: number, isPromoted: Boolean): [number, number][] => {
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
        const pieceAtDestination = pieces.find(
          (p) => p.position && p.position[0] === currentRow && p.position[1] === currentCol
        );
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
      ]
      for (const [dRow, dCol] of promotedDirections) {
        const currentRow = row + dRow;
        const currentCol = col + dCol;

        if (currentRow >= 0 && currentRow < 9 && currentCol >= 0 && currentCol < 9) {
          const pieceAtDestination = pieces.find(
            (p) => p.position && p.position[0] === currentRow && p.position[1] === currentCol
          );

          if (!pieceAtDestination || pieceAtDestination.owner !== owner) {
            potentialPositions.push([currentRow, currentCol]); // 空マスか敵駒なら追加
          }
        }
      }
    }

    return potentialPositions;
  }
  const getAvailableRookPositions = (owner: owner, row: number, col: number, isPromoted: Boolean): [number, number][] => {
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
        const pieceAtDestination = pieces.find(
          (p) => p.position && p.position[0] === currentRow && p.position[1] === currentCol
        );
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
      ]
      for (const [dRow, dCol] of promotedDirections) {
        const currentRow = row + dRow;
        const currentCol = col + dCol;

        if (currentRow >= 0 && currentRow < 9 && currentCol >= 0 && currentCol < 9) {
          const pieceAtDestination = pieces.find(
            (p) => p.position && p.position[0] === currentRow && p.position[1] === currentCol
          );

          if (!pieceAtDestination || pieceAtDestination.owner !== owner) {
            potentialPositions.push([currentRow, currentCol]); // 空マスか敵駒なら追加
          }
        }
      }
    }

    return potentialPositions;
  }

  const getAvailableKingPositions = (owner: owner, row: number, col: number): [number, number][] => {
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
    ]
  }

  // 移動可能な場所を表示する
  const getAvailablePositions = (piece: Piece): [number, number][] => {
    const { type, position, owner, isPromoted } = piece;

    if (position == null) {
      const rows = generateRows(owner);
      return generatePositions(rows).filter(([row, col]) => isPositionAvailable(row, col, owner));
    }

    const [row, col] = position;
    let potentialPositions: [number, number][] = [];

    if (type === "pawn") {
      potentialPositions = getAvailablePawnPositions(owner, row, col, isPromoted);
    } else if (type === "gold") {
      potentialPositions = getAvailableGoldPositions(owner, row, col);
    } else if (type === "silver") {
      potentialPositions = getAvailableSilverPositions(owner, row, col, isPromoted);
    } else if (type === "knight") {
      potentialPositions = getAvailableKnightPositions(owner, row, col, isPromoted);
    } else if (type === "lancer") {
      potentialPositions = getAvailableLancerPositions(owner, row, col, isPromoted);
    }
    // 角
    else if (type === "bishop") {
      potentialPositions = getAvailableBishopPositions(owner, row, col, isPromoted);
    }
    // 飛車
    else if (type === "rook") {
      potentialPositions = getAvailableRookPositions(owner, row, col, isPromoted);
    }
    else if (type === "king") {
      potentialPositions = getAvailableKingPositions(owner, row, col);


    }

    return potentialPositions.filter(([r, c]) => {
      const pieceAtDestination = pieces.find((p) => p.position && p.position[0] === r && p.position[1] === c);
      // 移動先に駒がない、または移動先の駒が自分の駒じゃない部分を表示
      return !pieceAtDestination || pieceAtDestination.owner !== owner;
    });
  };

  const reset = () => {
    setPieces(initialPieces);
    setSelectedPiece(null);
    setCapturedPieces([]);
  };

  const capturePiece = (selectedPiece: Piece, pieceAtDestination: Piece) => {
    // 相手の駒がいる場合は取る
    setPieces((prevPieces) => prevPieces.filter((p) => p !== pieceAtDestination));

    // 駒台に追加
    setCapturedPieces((prevPieces) => [...prevPieces, { type: pieceAtDestination.type, owner: selectedPiece.owner }]);
  };

  // すでに盤上に置かれている駒を移動させる
  const moveExistingPiece = (selectedPiece: Piece, row: number, col: number, shouldPromote: boolean) => {
    setPieces((prevPieces) =>
      prevPieces.map((piece) =>
        piece === selectedPiece
          ? {
            ...piece,
            position: [row, col],
            isPromoted: piece.isPromoted || shouldPromote,
          }
          : piece
      )
    );
  };

  // 駒台にある駒を打つ
  const moveCapturedPiece = (piece: Piece, row: number, col: number) => {
    setPieces((prevPieces) => [
      ...prevPieces,
      {
        ...piece,
        position: [row, col],
        isPromoted: false,
      },
    ]);
  };

  const handleCellClick = (row: number, col: number) => {
    // 移動先のマスにある駒
    const pieceAtDestination = pieces.find((p) => p.position[0] === row && p.position[1] === col);

    if (!selectedPiece) {
      if (pieceAtDestination) setSelectedPiece(pieceAtDestination);
      return;
    }

    if (canMoveTo(selectedPiece, row, col) && pieceAtDestination && pieceAtDestination.owner !== selectedPiece.owner) {
      capturePiece(selectedPiece, pieceAtDestination);
    }

    // 成れるかどうか
    const isEnableToPromote =
      !selectedPiece.isPromoted && "position" in selectedPiece && isPromotionZone(selectedPiece.owner, row) && canMoveTo(selectedPiece, row, col) && selectedPiece.type !== "gold" && selectedPiece.type !== "king";
    // 成るかどうか
    const shouldPromote = isEnableToPromote && window.confirm("成りますか？");

    // 駒を移動
    if (canMoveTo(selectedPiece, row, col)) {
      if (!selectedPiece.position) {
        moveCapturedPiece(selectedPiece, row, col);
        setCapturedPieces((prev) => prev.filter((p) => p != selectedPiece));
        setSelectedPiece(null);
      }
      // すでに盤上に置かれている駒を移動させる
      moveExistingPiece(selectedPiece, row, col, shouldPromote);
    }
    setSelectedPiece(null);
  };

  const handleCapturedPieceClick = (piece: CapturedPiece) => {
    setSelectedPiece(piece);
  };

  return (
    <main>
      <div
        style={{
          backgroundImage: "url('/images/tatami.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div className="flex items-start justify-center">
          <div className="self-start">
            <CapturedPieces
              pieces={capturedPieces.filter((piece) => piece.owner === OPPONENT)}
              handleCapturedPieceClick={handleCapturedPieceClick}
            />
          </div>
          <Board
            pieces={pieces}
            selectedPiece={selectedPiece}
            handleCellClick={handleCellClick}
            getAvailablePositions={getAvailablePositions}
          />
          <div className="self-end">
            <CapturedPieces
              pieces={capturedPieces.filter((piece) => piece.owner === PLAYER)}
              handleCapturedPieceClick={handleCapturedPieceClick}
            />
          </div>
        </div>
      </div>
      <button type="button" onClick={reset} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">平手配置</button>

    </main>
  );
}
