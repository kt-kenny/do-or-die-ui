import { useState, useCallback } from "react";

interface Player {
  id: string;
  position: number;
  color: string;
  name: string;
  isAnimating: boolean;
}

export default function BoardGame() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "player1", position: 0, color: "bg-blue-500", name: "Player 1", isAnimating: false },
    { id: "player2", position: 1, color: "bg-red-500", name: "Player 2", isAnimating: false },
  ]);

  const movePlayer = useCallback((playerId: string, steps: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.isAnimating) return;

    if (Math.abs(steps) === 1) {
      // Single step movement - simple animation
      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId
            ? { ...p, position: (p.position + steps + 30) % 30, isAnimating: true }
            : p
        )
      );

      setTimeout(() => {
        setPlayers(prev =>
          prev.map(p =>
            p.id === playerId ? { ...p, isAnimating: false } : p
          )
        );
      }, 300);
    } else {
      // Multi-step movement - animate step by step
      animateMultiStepMovement(playerId, Math.abs(steps), steps > 0 ? 1 : -1);
    }
  }, [players]);

  const animateMultiStepMovement = useCallback((playerId: string, stepsRemaining: number, direction: number) => {
    if (stepsRemaining === 0) {
      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId ? { ...p, isAnimating: false } : p
        )
      );
      return;
    }

    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId
          ? { ...p, position: (p.position + direction + 30) % 30, isAnimating: true }
          : p
      )
    );

    setTimeout(() => {
      animateMultiStepMovement(playerId, stepsRemaining - 1, direction);
    }, 400);
  }, []);

  const handleTileClick = (tileIndex: number) => {
    setPlayers(prev =>
      prev.map((player, index) =>
        index === 0
          ? { ...player, position: tileIndex }
          : player
      )
    );
  };

  const getPlayersOnTile = (tileIndex: number) => {
    return players.filter(player => player.position === tileIndex);
  };

  const getBoardPosition = (index: number) => {
    if (index <= 7) {
      // Top row: 0-7 (left to right)
      return { row: 0, col: index };
    } else if (index <= 13) {
      // Right side: 8-13 (top to bottom, excluding top-right corner)
      return { row: index - 7, col: 7 };
    } else if (index <= 20) {
      // Bottom row: 14-20 (right to left, including bottom-right corner)
      return { row: 7, col: 7 - (index - 14) };
    } else {
      // Left side: 21-29 (bottom to top, excluding bottom-left corner)
      return { row: 7 - (index - 21), col: 0 };
    }
  };

  const renderBoard = () => {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));

    for (let i = 0; i < 30; i++) {
      const { row, col } = getBoardPosition(i);
      // Add bounds checking to prevent array access errors
      if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        board[row][col] = i;
      } else {
        console.error(`Invalid board position for tile ${i}: row=${row}, col=${col}`);
      }
    }

    return (
      <div className="inline-block bg-green-100 p-4 rounded-2xl shadow-lg">
        <div className="grid grid-cols-8 gap-0">
          {board.map((row, rowIndex) =>
            row.map((tileIndex, colIndex) => {
              if (tileIndex === null) {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="w-16 h-16 bg-green-200"
                  />
                );
              }

              const playersOnTile = getPlayersOnTile(tileIndex);
              const isCorner = tileIndex === 0 || tileIndex === 7 || tileIndex === 14 || tileIndex === 21;

              return (
                <div
                  key={tileIndex}
                  className={`w-16 h-16 bg-white hover:bg-gray-50 cursor-pointer flex items-center justify-center relative transition-colors border border-gray-300 ${
                    isCorner ? 'rounded-lg' : 'rounded-md'
                  }`}
                  onClick={() => handleTileClick(tileIndex)}
                >
                  <span className="absolute top-1 left-1 text-xs text-gray-600 font-medium">
                    {tileIndex}
                  </span>

                  {tileIndex === 0 && (
                    <span className="absolute bottom-1 text-xs font-bold text-green-700 bg-green-100 px-1 rounded">
                      START
                    </span>
                  )}

                  <div className="flex flex-col items-center justify-center">
                    {playersOnTile.map((player, playerIndex) => (
                      <div
                        key={player.id}
                        className={`w-4 h-4 rounded-full ${player.color} border-2 border-white shadow-sm transition-all duration-300 ease-in-out transform ${
                          playerIndex > 0 ? 'mt-1' : ''
                        } ${
                          player.isAnimating
                            ? 'scale-125 shadow-lg ring-2 ring-yellow-300 ring-opacity-75'
                            : 'scale-100 hover:scale-110'
                        }`}
                        title={player.name}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Monopoly-Style Board</h1>

      <div className="flex justify-center mb-8">
        {renderBoard()}
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Player Controls</h2>

        {players.map((player) => (
          <div key={player.id} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center mb-3">
              <div className={`w-6 h-6 rounded-full ${player.color} mr-3 border-2 border-white shadow-sm`} />
              <span className="font-medium text-lg">{player.name}</span>
              <span className="ml-3 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                Position: {player.position}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => movePlayer(player.id, -1)}
                disabled={player.isAnimating}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 ${
                  player.isAnimating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'
                }`}
              >
                ← Move Backward
              </button>

              <button
                onClick={() => movePlayer(player.id, 1)}
                disabled={player.isAnimating}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 ${
                  player.isAnimating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'
                }`}
              >
                Move Forward →
              </button>

              <button
                onClick={() => movePlayer(player.id, Math.floor(Math.random() * 6) + 1)}
                disabled={player.isAnimating}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 ${
                  player.isAnimating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95'
                }`}
              >
                🎲 Roll Dice
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Click any tile to move Player 1 there instantly</li>
            <li>• Use Forward/Backward buttons to move around the circular board</li>
            <li>• Roll Dice to move 1-6 spaces with animated movement</li>
            <li>• Movement wraps around the board (position 29 → 0)</li>
            <li>• Players glow and scale up while moving</li>
            <li>• Buttons are disabled during animations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}