import type { Player } from "./Player";

export type GameRoom = {
    roomId: string;
    roomName: string;
    players: Record<string, Player>;
    playerOrder: string[];
    gameBoard: GameBoardTile[];
    doOrDies: DoOrDie[];
    turn: string | null;
    phase: string | null;
};

type GameBoardTile = {
    type: string;
};

type DoOrDie = {
    id: string;
    question: string;
    writer: string;
};
