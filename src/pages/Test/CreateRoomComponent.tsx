import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
export default function CreateRoomComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");
    return (
        <div className="m-4 border-8">
            <div className="flex">
                <Label className="mr-1">RoomName:</Label>
                <Input onChange={(e) => setRoomName(e.target.value)}></Input>
            </div>

            <div className="flex">
                <Button onClick={() => createRoom(roomName, setRoomCode)}>
                    Create Game Room
                </Button>
                <Label className="mr-1">RoomCode:</Label>
                {roomCode}
            </div>
        </div>
    );
}

async function createRoom(
    roomName: string,
    setRoomCode: React.Dispatch<string>
) {
    let endpoint =
        import.meta.env.VITE_API_URL +
        `/rooms?roomName=${encodeURIComponent(roomName)}&gameBoardSize=25`;
    const response = await axios.post(endpoint);
    setRoomCode(response.data.roomCode);
}
