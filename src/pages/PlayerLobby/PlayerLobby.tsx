import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { GameRoom } from "../Lobby/Model/GameRoom";
import axios from "axios";

export default function PlayerLobby() {
    const { roomId } = useParams<{ roomId: string }>();
    const location = useLocation();
    const playerName = location.state?.playerName as string;
    const isReconnect = location.state?.isReconnect as boolean;

    const [doOrDieText, setDoOrDieText] = useState<string>("");
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [gameRoom, setGameRoom] = useState<GameRoom | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        if (roomId && playerName) {
            // Fetch initial game state
            getGameState(roomId)
                .then(setGameRoom)
                .catch((error) =>
                    console.error("Failed to fetch initial game state:", error)
                );

            const ws = new WebSocket("ws://localhost:8080/ws/player");

            ws.onopen = () => {
                setIsConnected(true);

                // Send PLAYER_JOIN or PLAYER_RECONNECT message
                const messageType = isReconnect
                    ? "PLAYER_RECONNECT"
                    : "PLAYER_JOIN";
                const message = {
                    type: messageType,
                    message: {
                        roomId: roomId,
                        playerName: playerName,
                    },
                };
                ws.send(JSON.stringify(message));
                console.log(`Sent ${messageType} message:`, message);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("WebSocket message received:", data);

                    // Update game state on GAME_STATE_UPDATE message
                    if (data.type === "GAME_STATE_UPDATE") {
                        setGameRoom(data.gameRoom as GameRoom);
                    }
                } catch (error) {
                    console.error("Failed to parse WebSocket message:", error);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                setIsConnected(false);
            };

            ws.onclose = (event) => {
                console.log(
                    "WebSocket connection closed",
                    event.code,
                    event.reason
                );
                setIsConnected(false);
            };

            setWebsocket(ws);

            return () => {
                ws.close();
                setWebsocket(null);
            };
        } else {
            navigate("/");
        }
    }, [roomId, playerName, isReconnect, navigate]);

    const handleSubmitDoOrDie = () => {
        if (websocket && doOrDieText.trim() && roomId && playerName) {
            const addDoOrDieMessage = {
                type: "ADD_DO_OR_DIE",
                message: {
                    roomId: roomId,
                    playerName: playerName,
                    doOrDies: [doOrDieText.trim()],
                },
            };
            websocket.send(JSON.stringify(addDoOrDieMessage));
            console.log("Sent ADD_DO_OR_DIE message:", addDoOrDieMessage);
            setDoOrDieText(""); // Clear the text box
        } else {
            console.error("Cannot submit: missing data or connection");
        }
    };

    const handleRollDice = () => {
        if (websocket && roomId) {
            const rollMessage = {
                type: "ROLL",
                message: { roomId: roomId },
            };
            websocket.send(JSON.stringify(rollMessage));
            console.log("Sent ROLL message:", rollMessage);
        }
    };

    // Check if it's this player's turn
    const isMyTurn =
        gameRoom &&
        gameRoom.playerOrder &&
        gameRoom.playerOrder[gameRoom.turn] &&
        gameRoom.players[gameRoom.playerOrder[gameRoom.turn]]?.name ===
            playerName;
    const shouldShowRollButton =
        isMyTurn && gameRoom?.phase === "WAIT_FOR_ROLL";

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-600 to-amber-800 p-4">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div className="text-center pt-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Player Lobby
                    </h1>
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Room ID</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {roomId}
                            </p>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="text-sm text-gray-600">Player Name</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {playerName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Connection Status */}
                <div className="text-center">
                    <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isConnected
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                                isConnected ? "bg-green-600" : "bg-red-600"
                            }`}
                        ></div>
                        {isConnected ? "Connected" : "Disconnected"}
                    </div>
                </div>

                {/* Do or Die Input */}
                {gameRoom?.phase === "LOBBY" && (
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <Label className="text-xl font-bold text-gray-800 mb-4 block">
                            Submit a Do or Die
                        </Label>
                        <div className="space-y-4">
                            <Input
                                value={doOrDieText}
                                onChange={(e) => setDoOrDieText(e.target.value)}
                                placeholder="Enter your do or die challenge..."
                                className="text-lg p-4 border-2 border-gray-300 focus:border-amber-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmitDoOrDie();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSubmitDoOrDie}
                                disabled={!doOrDieText.trim() || !isConnected}
                                className="w-full text-lg py-4 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400"
                            >
                                Submit Do or Die
                            </Button>
                        </div>
                    </div>
                )}

                {/* Roll Dice Button */}
                {shouldShowRollButton && (
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                            Your Turn!
                        </h2>
                        <Button
                            onClick={handleRollDice}
                            className="w-full text-lg py-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Roll Dice
                        </Button>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-white text-center text-sm">
                        Enter creative do or die challenges for other players!
                        Press Enter or click Submit to add your challenge.
                    </p>
                </div>

                <pre>{gameRoom ? JSON.stringify(gameRoom, null, 2) : ""}</pre>
            </div>
        </div>
    );
}

async function getGameState(roomId: string): Promise<GameRoom> {
    const endpoint =
        import.meta.env.VITE_API_URL + `/rooms/${encodeURIComponent(roomId)}`;
    const response = await axios.get(endpoint);
    return response.data as GameRoom;
}
