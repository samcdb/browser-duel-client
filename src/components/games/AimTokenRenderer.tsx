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

// do nothing until fieldDimensions are supplied by parent
// responsible for starting interval that renders AimTokens
const AimTokenRenderer: React.FC<AimTokenRendererProps> = ({ matchConnection, turns, timeBetweenTurns, fieldDimensions }: AimTokenRendererProps) => {
    // keep track of index of current token
    const turnCount = useRef<number>(0);
    // need to keep track of info array for future renders
    const turnArr = useRef<AimTokenInfo[]>(turns);
    // need ref of setInterval to cancel it
    const turnInterval = useRef<NodeJS.Timer | null>(null);
    const [aimToken, setAimToken] = useState<AimTokenInfo>(turns[turnCount.current]); // set to 0 for initial render

    // this is called once - interval then repeatedly re-renders token
    useEffect(() => {
        turnInterval.current = setInterval(() => {
            // move on to next token
            turnCount.current++; 
            // if we've run out of tokens - game is over
            if (turnCount.current >= turnArr.current.length) {
                // end of aim game
                console.log('ready for next game');
                connection.send('playerReady', matchId);
                clearInterval(turnInterval.current!);

                return;
            } 
            const currentAimToken = turnArr.current[turnCount.current]

            console.log(`interval ${turnCount.current}`);

            setAimToken(
                { 
                    x: (currentAimToken.x / 100) * fieldDimensions.width!, // why is this considered possibly undefined?
                    y: (currentAimToken.y / 100) * fieldDimensions.height!,
                    attack: currentAimToken.attack,
                    clicked: false // reset clicked back to false when interval is fired
                });
        }, timeBetweenTurns);

        return () => clearInterval(turnInterval.current!); // precaution - interval should be cleared before this
    }, []);

    const { connection, matchId } = matchConnection;
    // record the time the token was rendered so that time taken to click can be calculated
    const timeOfRender: number = Date.now();

    // callback invoked by the token when clicked or time has run out
    const clickHandler = (clicked: boolean) => {
        // if user clicked before time ran out - then re-render
        // if user did not click and time has run out - do not setAimToken and cause a re-render - just let setInterval render the next token
        // (otherwise we get two renders at almost the same time)
        if (clicked) {
            setAimToken(
                { 
                    // all fields except clicked are actually pointless
                    x: (aimToken.x / 100) * fieldDimensions.width!, // why is this considered possibly undefined?
                    y: (aimToken.y / 100) * fieldDimensions.height!,
                    attack: aimToken.attack,
                    clicked // set clicked to true and re-render token - this will be undone by setInterval callback
                }
            );
        }

        const index = turnCount.current;
        const timeTaken = clicked ? Date.now() - timeOfRender : timeBetweenTurns;
        const aimGameUpdate: AimGameAction = { matchId, timeTaken, index };

        connection.send('aimAction', aimGameUpdate);
        console.log(`render click handler, time ${timeTaken}`);
    };

    return (
        <Wrapper>
         { 
            <AimToken 
                clickCallback={clickHandler} 
                attack={aimToken.attack} 
                x={aimToken.x} 
                y={aimToken.y}
                clicked={aimToken.clicked}
            /> 
         }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
`;

export default AimTokenRenderer;
