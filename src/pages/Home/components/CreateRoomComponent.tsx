import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GameRoom } from "@/pages/Lobby/Model/GameRoom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateRoomComponent() {
    const [roomName, setRoomName] = useState<string>("");
    const navigate = useNavigate();
    return (
        <div className="m-4 border-8">
            <Label className="font-bold border-2 text-lg">CREATE A ROOM:</Label>
            <div className="flex">
                <Label className="mr-1">RoomName:</Label>
                <Input onChange={(e) => setRoomName(e.target.value)}></Input>
            </div>

            <div className="flex">
                <Button
                    onClick={() => createRoom(roomName, navigate)}
                >
                    Create Game Room
                </Button>
            </div>
        </div>
    );
}

async function createRoom(
    roomName: string,
    navigate: (path: string, options?: { state?: any }) => void
) {
    let endpoint =
        import.meta.env.VITE_API_URL +
        `/rooms?roomName=${encodeURIComponent(roomName)}&gameBoardSize=25`;
    const response = await axios.post(endpoint);
    let gameRoom = response.data as GameRoom;

    navigate(`/lobby/${gameRoom.roomCode}`);
}
