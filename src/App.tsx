import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Lobby from "./pages/Lobby/Lobby";
import PlayerLobby from "./pages/PlayerLobby/PlayerLobby";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lobby/:roomCode" element={<Lobby />} />
                <Route path="/player-lobby/:roomCode" element={<PlayerLobby />} />
            </Routes>
        </Router>
    );
}

export default App;
