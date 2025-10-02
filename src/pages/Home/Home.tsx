import CreateRoomComponent from "./components/CreateRoomComponent";
import JoinRoomComponent from "./components/JoinRoomComponent";
import ReconnectComponent from "./components/ReconnectComponent";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-600 to-amber-800 p-4">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center pt-8 mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Do or Die
                    </h1>
                    <p className="text-white/80 text-lg">
                        Create or join a game room
                    </p>
                </div>
                <CreateRoomComponent />
                <JoinRoomComponent />
                <ReconnectComponent />
            </div>
        </div>
    );
}
