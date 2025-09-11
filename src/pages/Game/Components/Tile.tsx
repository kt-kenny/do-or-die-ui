
function Board({ totalTiles, tilesPerRow } : {totalTiles: number, tilesPerRow: number}) {
  const rows = Math.ceil(totalTiles / tilesPerRow);

  const getTilePosition = (index: number) => {
    const row = Math.floor(index / tilesPerRow);
    const colInRow = index % tilesPerRow;

    // Flip order on odd rows (snake effect)
    const col = row % 2 === 0 ? colInRow : tilesPerRow - 1 - colInRow;

    return { row, col };
  };

  return (
    <div className="relative grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${tilesPerRow}, 50px)`,
        gridTemplateRows: `repeat(${rows}, 50px)`
      }}
    >
      {Array.from({ length: totalTiles }).map((_, i) => {
        const { row, col } = getTilePosition(i);
        return (
          <div
            key={i}
            className="flex items-center justify-center border border-gray-500 bg-amber-200"
            style={{
              gridColumn: col + 1,
              gridRow: row + 1,
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}

export default Board;