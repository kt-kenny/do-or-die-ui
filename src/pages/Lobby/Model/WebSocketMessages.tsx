import type { GameRoom } from "./GameRoom";

// Event types
export type DiceRollEvent = {
    type: "DICE_ROLL";
    number: number;
};

export type MovePlayerEvent = {
    type: "MOVE_PLAYER";
    playerName: string;
    spacesMoved: number;
};

export type AnimationEvent = DiceRollEvent | MovePlayerEvent;

// WebSocket message types
export type AnimateEventsMessage = {
    type: "ANIMATE_EVENTS";
    roomId: string;
    events: AnimationEvent[];
};

export type GameStateUpdateMessage = {
    type: "GAME_STATE_UPDATE";
    gameRoom: GameRoom;
};

export type WebSocketMessage = AnimateEventsMessage | GameStateUpdateMessage;
