"use client";

import { useState } from "react";

type Piece = {
  type: "fuhyou"; // 駒の種類
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

  const handleCellClick = (row: number, col: number) => {
    if (selectedPiece) {
      setPieces((prevPieces) => {
        prevPieces.map((piece) =>
          piece === selectedPiece ? { ...piece, position: [row, col] } : piece
        );
      });
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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* TODO：駒台用意 */}
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
                    backgroundColor:
                      selectedPiece &&
                      selectedPiece.position[0] === rowIndex &&
                      selectedPiece.position[1] === colIndex
                        ? "#FFD700"
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
