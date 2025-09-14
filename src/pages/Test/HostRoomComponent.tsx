import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type Dispatch } from "react";
export default function HostRoomComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    return (
        <div className="m-4 border-8">
            <Label>Room Code</Label>
            <Input onChange={(e) => setRoomCode(e.target.value)}></Input>
            <Button onClick={() => hostRoom(roomCode, setMessage)}>
                Host Game Room
            </Button>
            <div className="flex bg-gray-100 m-1">
                <Label>CurrentMessage: </Label> <p> {message}</p>
            </div>
        </div>
    );
}

async function hostRoom(roomCode: string, setMessage: Dispatch<string>) {
    let hostConnection = new WebSocket("ws://localhost:8080/ws/game");
    let hostJoinMessage = { type: "HOST_JOIN", message: { roomId: roomCode } };

    hostConnection.onopen = () => {
        hostConnection.send(JSON.stringify(hostJoinMessage));
    };

    hostConnection.onmessage = (event) => {
        setMessage(JSON.stringify(event.data));
        console.log(event.data);
    };
}
