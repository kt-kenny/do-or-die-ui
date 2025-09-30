import CreateRoomComponent from "./components/CreateRoomComponent";
import JoinRoomComponent from "./components/JoinRoomComponent";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center max-w-[50%] mx-auto">
            <CreateRoomComponent />
            <JoinRoomComponent />
        </div>
    );
}