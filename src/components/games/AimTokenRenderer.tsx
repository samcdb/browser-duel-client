import React, { useEffect, useState, useRef } from 'react';
import MatchConnection from '../../interfaces/MatchConnection';
import { AimToken as AimTokenInfo } from '../../interfaces/games/AimGameInfo';
import { FieldDimensions } from './AimGame';
import AimToken from './AimToken';

interface AimTokenRendererProps {
    matchConnection: MatchConnection;
    turns: AimTokenInfo[];
    timeBetweenTurns: number;
    fieldDimensions: FieldDimensions;
}

interface AimGameUpdate {
    timeTaken: number;
    attack?: boolean;
    matchId: string;
}

interface Coordinates {
    x: number;
    y: number;
}

// do nothing until fieldDimensions are supplied by parent
// responsible for starting interval that renders AimTokens
const AimTokenRenderer: React.FC<AimTokenRendererProps> = ({ matchConnection, turns, timeBetweenTurns, fieldDimensions }: AimTokenRendererProps) => {
    // position of aim token
    const [aimToken, setAimToken] = useState<AimTokenInfo | null>(null);
    // need to keep track of info array
    const turnArr = useRef<AimTokenInfo[]>(turns);
    // need ref of current aim token index
    const turnCount = useRef<number>(0);
    // need ref of setInterval to cancel it
    const turnInterval = useRef<NodeJS.Timer | null>(null);
    
    // setInterval using timeBetween, increment aim token index
    useEffect(() => {
        // do nothing unless dimensions are obtained
        if (fieldDimensions.height == null  || fieldDimensions.width == null) {
            return;
        }

        turnInterval.current = setInterval(() => {
            // set up token
            console.log(`interval ${turnCount.current}`);
            const aimToken = turnArr.current[turnCount.current];
            setAimToken(
                { 
                    x: (aimToken.x / 100) * fieldDimensions.width!, // why is this considered possibly undefined?
                    y: (aimToken.y / 100) * fieldDimensions.height!,
                    attack: aimToken.attack
                });
            turnCount.current = turnCount.current++;
        }, timeBetweenTurns);
    }, []);

    const { connection, matchId } = matchConnection;
    const timeOfRender: number = Date.now();
    const clickHandler = () => {
        const timeTaken = Date.now()- timeOfRender;
        const attack = aimToken?.attack;
        const aimGameUpdate: AimGameUpdate = { matchId, timeTaken, attack };
        connection.send('aimClickAction', aimGameUpdate);
        console.log(`render click handler, time ${timeTaken}`);
    };

    return (
         aimToken == null ? <></> : <AimToken clickCallback={clickHandler} attack={aimToken.attack} x={aimToken.x} y={aimToken.y} /> 
    );
}

export default AimTokenRenderer;