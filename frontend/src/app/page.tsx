"use client";

import { useState } from "react";

export default function Home() {
  const rows = Array.from({ length: 9 });
  const columns = Array.from({ length: 9 });

  type Piece = {
    type: "fuhyou"; // 駒の種類
    position: [number, number]; // [row, column] 形式で位置を表す
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

  const [pieces, setPieces] = useState(initialPieces);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
                  style={{
                    width: "70px",
                    height: "70px",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F0D9B5",
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
