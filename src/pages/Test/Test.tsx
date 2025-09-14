import HostRoomComponent from "./HostRoomComponent";
import JoinRoomComponent from "../Home/components/JoinRoom";
import GetGameStateComponent from "./GetGameStateComponent";
import CreateRoomComponent from "./CreateRoomComponent";

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
