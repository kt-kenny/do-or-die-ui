import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type Dispatch } from "react";
export default function HostRoomComponent() {
    const [roomId, setRoomId] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    return (
        <div className="m-4 border-8">
            <Label className="font-bold border-2 text-lg"> HOST A ROOM: </Label>
            <Label>Room ID</Label>
            <Input onChange={(e) => setRoomId(e.target.value)}></Input>
            <Button onClick={() => hostRoom(roomId, setMessage)}>
                Host Game Room
            </Button>
            <div className="flex bg-gray-100 m-1">
                <Label>CurrentMessage: </Label> <p> {message}</p>
            </div>
        </div>
    );
}

async function hostRoom(roomId: string, setMessage: Dispatch<string>) {
    let hostConnection = new WebSocket("ws://localhost:8080/ws/game");
    let hostJoinMessage = { type: "HOST_JOIN", message: { roomId: roomId } };

    hostConnection.onopen = () => {
        hostConnection.send(JSON.stringify(hostJoinMessage));
    };

    hostConnection.onmessage = (event) => {
        setMessage(JSON.stringify(event.data));
        console.log(event.data);
    };
}
