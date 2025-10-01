import HostRoomComponent from "./HostRoomComponent";
import JoinRoomComponent from "../Home/components/JoinRoomComponent";
import GetGameStateComponent from "./GetGameStateComponent";
import CreateRoomComponent from "../Home/components/CreateRoomComponent";

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

// type GameRole = "HOST" | "PLAYER" | null;
