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
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <Label className="text-2xl font-bold text-gray-800 mb-4 block text-center">
                Create a Room
            </Label>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">
                        Room Name
                    </Label>
                    <Input
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Enter room name..."
                        className="text-lg p-4 border-2 border-gray-300 focus:border-amber-500"
                    />
                </div>
                <Button
                    onClick={() => createRoom(roomName, navigate)}
                    disabled={!roomName.trim()}
                    className="w-full text-lg py-4 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400"
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
    console.log(gameRoom.roomId + " SADSDASDSADSADSADSAD");
    navigate(`/lobby/${gameRoom.roomId}`);
}
