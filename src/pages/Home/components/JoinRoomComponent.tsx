import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoomComponent() {
    const [roomId, setRoomId] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("");
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <Label className="text-2xl font-bold text-gray-800 mb-4 block text-center">
                Join a Room
            </Label>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">Room ID</Label>
                    <Input
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room ID..."
                        className="text-lg p-4 border-2 border-gray-300 focus:border-amber-500"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">Player Name</Label>
                    <Input
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name..."
                        className="text-lg p-4 border-2 border-gray-300 focus:border-amber-500"
                    />
                </div>
                <Button
                    onClick={() => joinRoom(roomId, playerName, navigate)}
                    disabled={!roomId.trim() || !playerName.trim()}
                    className="w-full text-lg py-4 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400"
                >
                    Join Game Room
                </Button>
            </div>
        </div>
    );
}

function joinRoom(
    roomId: string,
    playerName: string,
    navigate: (path: string, options?: { state?: any }) => void
) {
    if (roomId.trim() && playerName.trim()) {
        navigate(`/player-lobby/${roomId}`, {
            state: { playerName }
        });
    } else {
        console.error("Room ID and player name are required");
    }
}
