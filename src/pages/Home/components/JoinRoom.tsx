import { useState } from "react";
import { Button } from "@/components/ui/button"

export default function JoinRoomComponent() {
    const [playerName, setPlayerName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    return (
      <fieldset>
        <TextInput labelName={"PlayerName"} setter={setPlayerName}></TextInput>
        <br></br>
        <TextInput labelName={"RoomCode"} setter={setRoomCode}></TextInput>
        <br></br>
        <Button onClick={() => joinRoom(playerName, roomCode)}>
          {" "}
          Join Room{" "}
        </Button>
      </fieldset>
    );
  }
  
function TextInput({
  labelName,
  setter,
}: Readonly<{ labelName: string; setter: (field: string) => void }>) {
  return (
    <label>
      {labelName}: &nbsp;
      <input type="text" onChange={(e) => setter(e.target.value)} />
    </label>
  );
}

function joinRoom(playerName: String, roomCode: String) {
    //todo: implement 
  console.log(playerName, "joining room", roomCode);
}
