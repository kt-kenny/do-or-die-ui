import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type Dispatch } from "react";

export default function JoinRoomComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    return (
        <div className="p-4 rounded-lg bg-amber-800 m-5 shadow-md">
            <Label className="text-2xl font-bold text-white mb-4 block">JOIN A ROOM:</Label>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xl font-bold text-white">Room Code:</Label>
                    <Input onChange={(e) => setRoomCode(e.target.value)} className="bg-white"></Input>
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-xl font-bold text-white">Player Name:</Label>
                    <Input onChange={(e) => setPlayerName(e.target.value)} className="bg-white"></Input>
                </div>
                <div className="flex justify-center mt-4">
                    <Button onClick={() => joinRoom(roomCode, playerName, setMessage)} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white">
                        Join Game Room
                    </Button>
                </div>
                {message && (
                    <div className="p-3 bg-white rounded-lg mt-3">
                        <Label className="text-gray-800 font-medium">Current Message:</Label>
                        <p className="text-gray-800">{message}</p>
                    </div>
                )}
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
