export interface AimToken {
    x: number;
    y: number;
    attack: boolean;
    clicked: boolean;   // keep track of whether token has been clicked - see AimToken.tsx for explanation
} 

export interface AimGameInfo {
    turns: AimToken[];
    timeBetweenTurns: number;
}
