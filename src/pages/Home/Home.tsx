import JoinRoomComponent from "./components/JoinRoom";
import NewRoomComponent from "./components/NewRoom";

export default function Home() {
  return (
    <div className="max-h-1/4 min-w-200 max-w-9/10 overflow-y-auto  p-4 rounded-lg mx-auto bg-amber-800 m-5 text-center">
        <h1>DO OR DIE!</h1>
        <br></br>
        <NewRoomComponent></NewRoomComponent>
        <br></br>
        <JoinRoomComponent></JoinRoomComponent>
        <div className="flex min-h-svh flex-col items-center justify-center">
    </div>
    </div>
  );
}

