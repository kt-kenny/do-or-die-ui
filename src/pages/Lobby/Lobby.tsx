import { Button } from "@/components/ui/button"

export default function Lobby() {
  return (
    <>
      <LobbyHead
        roomCode="qwetty"
        players={["kenny", "dante", "brad pittonses","kenny", "dante", "brad pittonses","kenny", "dante", "brad pittonses","kenny", "dante", "brad pittonses"]}
      ></LobbyHead>
      <ScrollList></ScrollList>
    </>
  );
}

// interface GameState {
//   roomCode: string;
//   players: Player[];
//   dares: Dare[];
//   tiles: TileType[];
//   currentPlayer: string;
//   phase: string;
// }

// interface Player {
//   name: string;
//   currentTile: number;
// }
// interface Dare {
//   id: UUID;
//   desc: string;
// }

// const TileType = {
//   DIE: "DIE",
//   DO_OR_DIE: "DO_OR_DIE",
//   END: "END",
//   MOVE_X_SPACES: "MOVE_X_SPACES",
//   EMPTY: "EMPTY",
// };
// type TileType = (typeof TileType)[keyof typeof TileType];

// type UUID = string;

// const gamestate: GameState = {
//   roomCode: "qwetty2",
//   players: [],
//   dares: [
//     { id: "id1", desc: "dare1" },
//     { id: "id2", desc: "dare2" },
//     { id: "id3", desc: "dare3" },
//   ],
//   tiles: [],
//   currentPlayer: "",
//   phase: "",
// };

function ScrollList() {
  const items = [
    "Dare someone to dance",
    "Sing a song",
    "Do 10 pushups",
    "Act like a cat",
    "Say the alphabet backwards",
    "Tell an embarrassing story",
    "Do a handstand (or try)",
  ];

  return (
    <div className="flex-col max-h-1/4 min-w-200 max-w-9/10 overflow-y-auto p-4 rounded-lg mx-auto bg-amber-800">
      {items.map((text, index) => (
        <div key={index} className="flex items-center mb-3 border-gray-300">
          <span>{text}</span>
          <Button>Reject</Button>
        </div>
      ))}
    </div>
  );
}

function LobbyHead(props: { roomCode: string; players: string[] }) {
  return (
<div className="flex items-center justify-between max-h-1/4 min-w-200 max-w-9/10 overflow-y-auto  p-4 rounded-lg mx-auto bg-amber-800 m-5">
  {/* Room Code */}
  <div className="flex flex-col items-start">
    <p className="text-sm font-semibold text-gray-700">Room Code</p>
    <p className="text-lg font-bold text-gray-900">{props.roomCode}</p>
  </div>

  {/* Players */}
  <div className="flex items-start gap-4">
    <p className="text-sm font-semibold text-gray-700">Players:</p>
    <div className="flex flex-col gap-1">
      {props.players.map((playerName) => (
        <p key={playerName} className="text-gray-900">
          {playerName}
        </p>
      ))}
    </div>
  </div>

  {/* Start Game Button */}
  <Button onClick={()=> console.log("STARTING GAME")}>
    Start Game?
  </Button>
</div>
  );
}
