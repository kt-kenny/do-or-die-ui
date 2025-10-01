import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import type { GameRoom } from "./Model/GameRoom";

export default function Lobby() {
    const { roomId } = useParams<{ roomId: string }>();
    const [gameRoom, setGameRoom] = useState<GameRoom | undefined>();
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    /**
     *  Without useEffect the hostRoom would be called on every state change. React components re-render whenever state changes or props change.
     *  The useEffect() pattern ensures one connection per roomId
     */
    useEffect(() => {
        if (roomId) {
            // Fetch initial game state
            getGameState(roomId)
                .then(setGameRoom)
                .catch((error) =>
                    console.error("Failed to fetch initial game state:", error)
                );

            // Set up WebSocket connection
            const ws = hostRoom(roomId, setGameRoom);
            setWebsocket(ws);
            return () => {
                ws?.close();
                setWebsocket(null);
            };
        }
    }, [roomId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-600 to-amber-800 p-4">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center pt-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Game Lobby
                    </h1>
                    <p className="text-white/80">Host Dashboard</p>
                </div>
                <LobbyHead gameRoom={gameRoom} roomId={roomId || ""} />
                <ScrollList
                    gameRoom={gameRoom}
                    websocket={websocket}
                    roomId={roomId}
                />
            </div>
        </div>
    );
}

function ScrollList(
    props: Readonly<{
        gameRoom?: GameRoom;
        websocket?: WebSocket | null;
        roomId?: string;
    }>
) {
    const doOrDies = props.gameRoom ? props.gameRoom.doOrDies : [];

    const handleReject = (doOrDieId: string) => {
        if (props.websocket && props.roomId) {
            const rejectMessage = {
                type: "REMOVE_DO_OR_DIE",
                message: {
                    roomId: props.roomId,
                    doOrDieId: doOrDieId,
                },
            };
            props.websocket.send(JSON.stringify(rejectMessage));
            console.log("Sent reject message:", rejectMessage);
        } else {
            console.error("WebSocket not available or roomId missing");
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Do or Dies</h2>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {doOrDies.length} challenges
                </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {doOrDies.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No challenges yet...</p>
                        <p className="text-sm">
                            Players can submit do or die challenges
                        </p>
                    </div>
                ) : (
                    doOrDies.map((doOrDie) => (
                        <div
                            key={doOrDie.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <span className="text-gray-800 font-medium flex-1 mr-3">
                                {doOrDie.question}
                            </span>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                                onClick={() => handleReject(doOrDie.id)}
                            >
                                Reject
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function LobbyHead(props: Readonly<{ gameRoom?: GameRoom; roomId: string }>) {
    const players = props.gameRoom
        ? Object.values(props.gameRoom.players).map((player) => player.name)
        : [];
    const displayRoomId = props.gameRoom?.roomId || props.roomId;

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* Room Info */}
            <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Room ID</p>
                <p className="text-3xl font-bold text-gray-800 tracking-wider">
                    {displayRoomId}
                </p>
            </div>

            {/* Players Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Players
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {players.length} joined
                    </span>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {players.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            Waiting for players to join...
                        </p>
                    ) : (
                        players.map((playerName, index) => (
                            <div
                                key={index}
                                className="flex items-center p-2 bg-gray-50 rounded-lg"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-gray-800 font-medium">
                                    {playerName}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Start Game Button */}
            <Button
                onClick={() => console.log("STARTING GAME")}
                disabled={players.length === 0}
                className="w-full text-lg py-4 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
            >
                {players.length === 0 ? "Waiting for Players" : "Start Game"}
            </Button>
        </div>
    );
}
async function getGameState(roomId: string): Promise<GameRoom> {
    const endpoint =
        import.meta.env.VITE_API_URL + `/rooms/${encodeURIComponent(roomId)}`;
    const response = await axios.get(endpoint);
    return response.data as GameRoom;
}
function hostRoom(
    roomId: string,
    setGameRoom: (gameRoom: GameRoom) => void
): WebSocket {
    const hostConnection = new WebSocket("ws://localhost:8080/ws/host");
    const hostJoinMessage = {
        type: "HOST_JOIN",
        message: { roomId: roomId },
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
