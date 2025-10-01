import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useState, type Dispatch } from "react";

export default function GetGameStateComponent() {
    const [roomId, setRoomId] = useState<string>("");
    const [gameState, setGameState] = useState<string>("");
    return (
        <div className="m-4 border-8">
            <Label className="font-bold border-2 text-lg">GET GAME ROOM:</Label>
            <div className="flex">
                <Label className="mr-1">Room ID:</Label>
                <Input onChange={(e) => setRoomId(e.target.value)}></Input>
            </div>
            <div className="flex">
                <Button onClick={() => getGameState(roomId, setGameState)}>
                    Get Game State
                </Button>
            </div>
            <p>{gameState}</p>
        </div>
    );
}

async function getGameState(roomId: string, setGameState: Dispatch<string>) {
    let endpoint =
        import.meta.env.VITE_API_URL + `/rooms/${encodeURIComponent(roomId)}`;
    const response = await axios.get(endpoint);
    setGameState(JSON.stringify(response.data, null, "\n"));
}
