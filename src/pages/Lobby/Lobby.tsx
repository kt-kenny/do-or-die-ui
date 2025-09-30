import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import type { GameRoom } from "./Model/GameRoom";

export default function Lobby() {
    const { roomCode } = useParams<{ roomCode: string }>();
    const [gameRoom, setGameRoom] = useState<GameRoom | undefined>();

    /**
     *  Without useEffect the hostRoom would be called on every state change. React components re-render whenever state changes or props change.
     *  The useEffect() pattern ensures one connection per roomCode
     */
    useEffect(() => {
        if (roomCode) {
            // Fetch initial game state
            getGameState(roomCode)
                .then(setGameRoom)
                .catch((error) =>
                    console.error("Failed to fetch initial game state:", error)
                );

            // Set up WebSocket connection
            const ws = hostRoom(roomCode, setGameRoom);
            return () => {
                ws?.close();
            };
        }
    }, [roomCode]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center max-w-[50%] mx-auto">
            <LobbyHead
                gameRoom={gameRoom}
                roomCode={roomCode || ""}
            ></LobbyHead>
            <ScrollList gameRoom={gameRoom}></ScrollList>
        </div>
    );
}

function ScrollList(props: Readonly<{ gameRoom?: GameRoom }>) {
    const doOrDies = props.gameRoom ? props.gameRoom.doOrDies : [];

    return (
        <div className="flex-col max-h-1/4 min-w-200 max-w-9/10 overflow-y-auto p-4 rounded-lg mx-auto bg-amber-800">
            <h1 className="text-2xl font-bold text-white mb-2">DoOrDies:</h1>
            <h1>{doOrDies.length}</h1>
            {doOrDies.map((doOrDie) => (
                <div
                    key={doOrDie.id}
                    className="flex items-center justify-between mb-3 p-3 bg-white rounded-lg shadow-md border border-gray-200"
                >
                    <span className="text-gray-800 font-medium">{doOrDie.question}</span>
                    <Button className="ml-4">Reject</Button>
                </div>
            ))}
        </div>
    );
}

function LobbyHead(props: Readonly<{ gameRoom?: GameRoom; roomCode: string }>) {
    const players = props.gameRoom
        ? Object.values(props.gameRoom.players).map((player) => player.name)
        : [];
    const displayRoomCode = props.gameRoom?.roomCode || props.roomCode;
    return (
        <div className="flex items-center justify-between max-h-1/4 min-w-200 max-w-9/10 overflow-y-auto  p-4 rounded-lg mx-auto bg-amber-800 m-5">
            {/* Room Code */}
            <div className="flex flex-col items-start">
                <p className="text-xl font-bold text-white">Room Code</p>
                <p className="text-lg font-bold text-gray-900">
                    {displayRoomCode}
                </p>
            </div>

            {/* Players */}
            <div className="flex items-start gap-4">
                <p className="text-xl font-bold text-white">Players:</p>
                <div className="flex flex-col gap-1">
                    {players.map((playerName, index) => (
                        <p key={index} className="text-gray-900">
                            {playerName}
                        </p>
                    ))}
                </div>
            </div>

            {/* Start Game Button */}
            <Button onClick={() => console.log("STARTING GAME")}>
                Start Game?
            </Button>
        </div>
    );
}
async function getGameState(roomCode: string): Promise<GameRoom> {
    const endpoint =
        import.meta.env.VITE_API_URL + `/rooms/${encodeURIComponent(roomCode)}`;
    const response = await axios.get(endpoint);
    return response.data as GameRoom;
}
function hostRoom(
    roomCode: string,
    setGameRoom: (gameRoom: GameRoom) => void
): WebSocket {
    const hostConnection = new WebSocket("ws://localhost:8080/ws/game");
    const hostJoinMessage = {
        type: "HOST_JOIN",
        message: { roomId: roomCode },
    };

    hostConnection.onopen = () => {
        hostConnection.send(JSON.stringify(hostJoinMessage));
    };

    hostConnection.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("WebSocket message received:", data);

            // Parse the message as GameRoom and update state
            setGameRoom(data.events[0].gameRoom as GameRoom); // TODO: make a lobby message wrapper
        } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
        }
    };

    hostConnection.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    hostConnection.onclose = () => {
        console.log("WebSocket connection closed");
    };

    return hostConnection;
}
