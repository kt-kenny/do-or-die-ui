import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useState, type Dispatch } from "react";

export default function Test() {
    return (
        <div>
            <CreateRoomComponent></CreateRoomComponent>
            <GetGameStateComponent></GetGameStateComponent>
            <HostRoomComponent></HostRoomComponent>
            <JoinRoomComponent></JoinRoomComponent>
        </div>
    );
}
function CreateRoomComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");
    return (
        <div className="m-4 border-8">
            <div className="flex">
                <Label className="mr-1">RoomName:</Label>
                <Input onChange={(e) => setRoomName(e.target.value)}></Input>
            </div>

            <div className="flex">
                <Button onClick={() => createRoom(roomName, setRoomCode)}>
                    Create Game Room
                </Button>
                <Label className="mr-1">RoomCode:</Label>
                {roomCode}
            </div>
        </div>
    );
}

async function createRoom(
    roomName: string,
    setRoomCode: React.Dispatch<string>
) {
    let endpoint =
        import.meta.env.VITE_API_URL +
        `/rooms?roomName=${encodeURIComponent(roomName)}&gameBoardSize=25`;
    const response = await axios.post(endpoint);
    setRoomCode(response.data.roomCode);
}

function GetGameStateComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [gameState, setGameState] = useState<string>("");
    return (
        <div className="m-4 border-8">
            <div className="flex">
                <Label className="mr-1">RoomCode:</Label>
                <Input onChange={(e) => setRoomCode(e.target.value)}></Input>
            </div>
            <div className="flex">
                <Button onClick={() => getGameState(roomCode, setGameState)}>
                    Get Game State
                </Button>
            </div>
            <p>{gameState}</p>
        </div>
    );
}
async function getGameState(roomCode: string, setGameState: Dispatch<string>) {
    let endpoint =
        import.meta.env.VITE_API_URL + `/rooms/${encodeURIComponent(roomCode)}`;
    const response = await axios.get(endpoint);
    setGameState(JSON.stringify(response.data, null, "\n"));
}

function HostRoomComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    return (
        <div className="m-4 border-8">
            <Label>Room Code</Label>
            <Input onChange={(e) => setRoomCode(e.target.value)}></Input>
            <Button onClick={() => hostRoom(roomCode, setMessage)}>
                Host Game Room
            </Button>
            <div className="flex bg-gray-100 m-1">
                <Label>CurrentMessage: </Label> <p> {message}</p>
            </div>
        </div>
    );
}

async function hostRoom(roomCode: string, setMessage: Dispatch<string>) {
    let hostConnection = new WebSocket("ws://localhost:8080/ws/game");
    let hostJoinMessage = { type: "HOST_JOIN", message: { roomId: roomCode } };

    hostConnection.onopen = () => {
        hostConnection.send(JSON.stringify(hostJoinMessage));
    };

    hostConnection.onmessage = (event) => {
        setMessage(JSON.stringify(event.data));
        console.log(event.data);
    };
}

function JoinRoomComponent() {
    const [roomCode, setRoomCode] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    return (
        <div className="m-4 border-8">
            <Label>Room Code</Label>
            <Input onChange={(e) => setRoomCode(e.target.value)}></Input>
            <Label>PlayerName</Label>
            <Input onChange={(e) => setPlayerName(e.target.value)}></Input>
            <Button onClick={() => joinRoom(roomCode, playerName, setMessage)}>
                {" "}
                Join Game Room{" "}
            </Button>
            <div className="flex bg-gray-100 m-1">
                <Label>CurrentMessage: </Label> <p> {message}</p>
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
