import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type Dispatch } from "react";

function JoinRoomComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    return (
        <div className="m-4 border-8">
            <Label>Room Code</Label>
            <Input onChange={(e) => setRoomCode(e.target.value)}></Input>
            <Label>PlayerName</Label>
            <Input onChange={(e) => setPlayerName(e.target.value)}></Input>
            <Button onClick={() => joinRoom(roomCode, playerName, setMessage)}>
                {" "}
                Join Game Room{" "}
            </Button>
            <div className="flex bg-gray-100 m-1">
                <Label>CurrentMessage: </Label> <p> {message}</p>
            </div>
        </div>
    );
}

async function joinRoom(
    roomCode: string,
    playerName: string,
    setMessage: Dispatch<string>
) {
    let connection = new WebSocket("ws://localhost:8080/ws/game");
    let payload = {
        type: "JOIN",
        message: { roomId: roomCode, playerName: playerName },
    };

    connection.onopen = () => {
        connection.send(JSON.stringify(payload));
    };

    connection.onmessage = (event) => {
        setMessage(JSON.stringify(event.data));
        console.log(event.data);
    };
}
