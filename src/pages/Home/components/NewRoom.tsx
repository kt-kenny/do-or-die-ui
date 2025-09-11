import { useState } from "react";
import { Button } from "@/components/ui/button"

export default function NewRoomComponent() {
  const [boardSize, setBoardSize] = useState(20);
  return (
    <fieldset>
      <BoardSizeSelector
        boardSize={boardSize}
        setBoardSize={setBoardSize}
      ></BoardSizeSelector>
      <br></br>
      <Button onClick={()=> startRoom(boardSize)}> Start Room </Button>
    </fieldset>
  );
}

function BoardSizeSelector({
  boardSize,
  setBoardSize,
}: Readonly<{ boardSize: number; setBoardSize: (size: number) => void }>) {
  return (
    <label>
      Board Size:
      <label>
        <input
          type="radio"
          name="boardSize"
          value={20}
          checked={boardSize === 20}
          onChange={(e) => setBoardSize(Number(e.target.value))}
        />{" "}
        20
      </label>
      <label>
        <input
          type="radio"
          name="boardSize"
          value={40}
          checked={boardSize === 40}
          onChange={(e) => setBoardSize(Number(e.target.value))}
        />{" "}
        40
      </label>
      <label>
        <input
          type="radio"
          name="boardSize"
          value={60}
          checked={boardSize === 60}
          onChange={(e) => setBoardSize(Number(e.target.value))}
        />{" "}
        60
      </label>
    </label>
  );
}
function startRoom(boardSize: number){
    // Todo: establish Websocket connection
    console.log("Starting Room with boardsize: ", boardSize)
}
