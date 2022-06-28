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

interface AimGameAction {
    timeTaken: number;
    index: number;
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
    
    useEffect(() => {
        turnInterval.current = setInterval(() => {
            // clear at start so that players have full amount of time to click during last interval
            if (turnCount.current >= turnArr.current.length) {
                // end of aim game
                setTimeout(() => {
                    console.log('ready for next game');
                    connection.send('playerReady', matchId);
                }, 2000);

                clearInterval(turnInterval.current!);
                // don't want rest of function running - game is over
                return;
            } 

            console.log(`interval ${turnCount.current}`);
            const aimToken = turnArr.current[turnCount.current];
            setAimToken(
                { 
                    x: (aimToken.x / 100) * fieldDimensions.width!, // why is this considered possibly undefined?
                    y: (aimToken.y / 100) * fieldDimensions.height!,
                    attack: aimToken.attack
                });
            turnCount.current++;  
        }, timeBetweenTurns);

        return () => clearInterval(turnInterval.current!); // precaution - interval should be cleared before this
    }, []);
    
    const { connection, matchId } = matchConnection;
    const timeOfRender: number = Date.now();

    const clickHandler = (clicked: boolean) => {
        // if unclicked - assign max time
        const timeTaken = clicked ? Date.now() - timeOfRender : timeBetweenTurns;
        const index = turnCount.current;
        const aimGameUpdate: AimGameAction = { matchId, timeTaken, index };
        connection.send('aimAction', aimGameUpdate);
        console.log(`render click handler, time ${timeTaken}`);
    };

    return (
        <Wrapper>
         {
            aimToken == null ? <></> : 
            <AimToken 
                clickCallback={clickHandler} 
                attack={aimToken.attack} 
                x={aimToken.x} y={aimToken.y}
                index={turnCount.current}
                /> 
         }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
`;

export default AimTokenRenderer;
