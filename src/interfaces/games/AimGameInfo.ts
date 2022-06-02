export interface AimToken {
    x: number;
    y: number;
    attack: boolean;
} 

export interface AimGameInfo {
    turns: AimToken[];
    timeBetweenTurns: number;
}
