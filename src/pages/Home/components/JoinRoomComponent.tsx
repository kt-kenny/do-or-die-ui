import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function JoinRoomComponent() {
    const [roomId, setRoomId] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <Label className="text-2xl font-bold text-gray-800 mb-4 block text-center">
                Join a Room
            </Label>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">
                        Room ID
                    </Label>
                    <Input
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room ID..."
                        className="text-lg p-4 border-2 border-gray-300 focus:border-amber-500"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">
                        Player Name
                    </Label>
                    <Input
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name..."
                        className="text-lg p-4 border-2 border-gray-300 focus:border-amber-500"
                    />
                </div>
                <Button
                    onClick={() =>
                        joinRoom(
                            roomId,
                            playerName,
                            navigate,
                            setIsLoading,
                            setError
                        )
                    }
                    disabled={!roomId.trim() || !playerName.trim() || isLoading}
                    className="w-full text-lg py-4 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400"
                >
                    {isLoading ? "Joining..." : "Join Game Room"}
                </Button>
                {error && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

async function joinRoom(
    roomId: string,
    playerName: string,
    navigate: (path: string, options?: { state?: any }) => void,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string) => void
) {
    if (!roomId.trim() || !playerName.trim()) {
        setError("Room ID and player name are required");
        return;
    }

    setIsLoading(true);
    setError("");

    try {
        const endpoint = import.meta.env.VITE_API_URL + "/players";
        const response = await axios.post(endpoint, null, {
            params: {
                roomId: roomId.trim(),
                name: playerName.trim(),
            },
            withCredentials: true
        });

        console.log("Player join response:", response.data);

        // Navigate to player lobby on success
        navigate(`/player-lobby/${roomId}`, {
            state: { playerName: playerName.trim() },
        });
    } catch (error: any) {
        console.error("Failed to join room:", error);
        if (error.response?.data?.message) {
            setError(error.response.data.message);
        } else if (error.response?.status === 404) {
            setError("Room not found. Please check the Room ID.");
        } else if (error.response?.status === 400) {
            setError("Invalid room or player data.");
        } else {
            setError("Failed to join room. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
}
