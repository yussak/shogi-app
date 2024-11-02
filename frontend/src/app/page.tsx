export default function Home() {
  const rows = Array.from({ length: 9 });
  const columns = Array.from({ length: 9 });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, 70px)",
          }}
        >
          {rows.map((_, rowIndex) =>
            columns.map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: "70px",
                  height: "70px",
                  border: "1px solid black",
                  backgroundColor: "#F0D9B5",
                }}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
