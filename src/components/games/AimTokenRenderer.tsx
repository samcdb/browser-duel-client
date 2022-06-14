import React, { useEffect, useState, useRef } from 'react';
import MatchConnection from '../../interfaces/MatchConnection';
import { AimToken as AimTokenInfo } from '../../interfaces/games/AimGameInfo';
import { FieldDimensions } from './AimGame';
import AimToken from './AimToken';
import styled from 'styled-components';

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

    const savedCallback = useRef<() => void>();

    // define a new callback for each render
    savedCallback.current =  () => {
        console.log(`interval ${turnCount.current}`);
        const aimToken = turnArr.current[turnCount.current];
        setAimToken(
            { 
                x: (aimToken.x / 100) * fieldDimensions.width!, // why is this considered possibly undefined?
                y: (aimToken.y / 100) * fieldDimensions.height!,
                attack: aimToken.attack
            });
        turnCount.current = turnCount.current++;
    };
    
    useEffect(() => {
        const tick = () => {
            savedCallback.current!();
        }

        turnInterval.current = setInterval(tick, timeBetweenTurns);
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
        <Wrapper>
         {
            aimToken == null ? <></> : 
            <AimToken 
                clickCallback={clickHandler} 
                attack={aimToken.attack} 
                x={aimToken.x} y={aimToken.y}/> 
         }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
`;

export default AimTokenRenderer;