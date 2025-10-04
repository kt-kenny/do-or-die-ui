import type { Player } from "./Player";

export type GameRoom = {
    roomId: string;
    roomName: string;
    players: Record<string, Player>;
    playerOrder: string[];
    gameBoard: GameBoardTile[];
    doOrDies: DoOrDie[];
    turn: number;
    phase: string;
};

type GameBoardTile = {
    type: string;
};

type DoOrDie = {
    id: string;
    question: string;
    writer: string;
};
