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
        <div className="p-4 rounded-lg bg-amber-800 m-5 shadow-md">
            <Label className="text-2xl font-bold text-white mb-4 block">CREATE A ROOM:</Label>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xl font-bold text-white">Room Name:</Label>
                    <Input onChange={(e) => setRoomName(e.target.value)} className="bg-white"></Input>
                </div>

                <div className="flex justify-center mt-4">
                    <Button
                        onClick={() => createRoom(roomName, navigate)}
                        className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        Create Game Room
                    </Button>
                </div>
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
