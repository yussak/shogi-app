"use client";

import { useState } from "react";

type Piece = {
  type: "fuhyou";
  position: [number, number];
};

const initialPieces: Piece[] = [
  { type: "fuhyou", position: [6, 0] },
  { type: "fuhyou", position: [6, 1] },
  { type: "fuhyou", position: [6, 2] },
  { type: "fuhyou", position: [6, 3] },
  { type: "fuhyou", position: [6, 4] },
  { type: "fuhyou", position: [6, 5] },
  { type: "fuhyou", position: [6, 6] },
  { type: "fuhyou", position: [6, 7] },
  { type: "fuhyou", position: [6, 8] },
];

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const rows = Array.from({ length: 9 });
  const columns = Array.from({ length: 9 });

  const canMoveTo = (
    selectedPiece: Piece,
    targetRow: number,
    targetCol: number
  ) => {
    return (
      selectedPiece.type === "fuhyou" &&
      selectedPiece.position[0] - 1 === targetRow &&
      selectedPiece.position[1] === targetCol
    );
  };

  const getMovablePositions = (piece: Piece | null): [number, number][] => {
    if (!piece) return [];

    const { type, position } = piece;
    const [row, col] = position;
    if (type === "fuhyou") {
      return [[row - 1, col]];
    }

    return [];
  };

  const movablePositions = selectedPiece
    ? getMovablePositions(selectedPiece)
    : [];

  const handleCellClick = (row: number, col: number) => {
    if (selectedPiece) {
      if (canMoveTo(selectedPiece, row, col)) {
        setPieces((prevPieces) =>
          prevPieces.map((piece) =>
            piece === selectedPiece ? { ...piece, position: [row, col] } : piece
          )
        );
      }
      setSelectedPiece(null);
    } else {
      const piece = pieces.find(
        (p) => p.position[0] === row && p.position[1] === col
      );
      if (piece) {
        setSelectedPiece(piece);
      }
    }
  };

  const reset = () => {
    setPieces(initialPieces);
    setSelectedPiece(null);
  };

  return (
    <div className="grid items-center justify-items-center">
      <main>
        {/* TODO：駒台用意 */}
        <button onClick={reset}>平手配置</button>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, 70px)",
          }}
        >
          {rows.map((_, rowIndex) =>
            columns.map((_, colIndex) => {
              // マスに駒があるかを確認
              const piece = pieces.find(
                (p) => p.position[0] === rowIndex && p.position[1] === colIndex
              );

              const isMovablePosition = movablePositions.some(
                (pos) => pos[0] === rowIndex && pos[1] === colIndex
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    width: "70px",
                    height: "70px",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isMovablePosition
                      ? "#A3D2CA" // 移動可能位置の色
                      : selectedPiece &&
                        selectedPiece.position[0] === rowIndex &&
                        selectedPiece.position[1] === colIndex
                      ? "#FFD700" // 選択中の駒の色
                      : "#F0D9B5",
                  }}
                >
                  {piece && piece.type === "fuhyou" ? "歩" : ""}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
