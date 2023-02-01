import React, { useEffect, useState, useRef } from 'react';
import MatchConnection from '../../interfaces/MatchConnection';
import { AimToken as AimTokenInfo } from '../../interfaces/games/AimGameInfo';
import { FieldDimensions } from './AimGame';
import styled from 'styled-components';

interface AimTokenRendererProps {
    matchConnection: MatchConnection;
    turns: AimTokenInfo[];
    timeBetweenTurns: number;
    fieldDimensions: FieldDimensions;
}

interface AimGameActionDto {
    timeTaken: number | null;
    index: number;
    matchId: string;
}

// do nothing until fieldDimensions are supplied by parent
// responsible for starting interval that renders AimTokens
const AimTokenRenderer: React.FC<AimTokenRendererProps> = ({ matchConnection, turns, timeBetweenTurns, fieldDimensions }: AimTokenRendererProps) => {
    // keep track of index of current token
    const turnCount = useRef<number>(0);
    // need to keep track of info array for future renders
    //const turnArr = useRef<AimTokenInfo[]>(turns);
    // need ref of setInterval to cancel it
    const turnInterval = useRef<NodeJS.Timer | null>(null);
    const [aimToken, setAimToken] = useState<AimTokenInfo>(turns[turnCount.current]); // set to 0 for initial render

    // this is called once - interval then repeatedly re-renders token

    useEffect(() => {
        turnInterval.current = setInterval(() => {
             
            // TODO: aimtoken does not seem to update the way I think it does - expression is true even when clicked
            if (!aimToken.clicked) { 
                const index: number = turnCount.current;
                const aimGameUpdate: AimGameActionDto = { matchId, index, timeTaken: null };
                connection.send('aimAction', aimGameUpdate);
            }

            // if we've run out of tokens - game is over
            // wait for server to give us next step
            if (turnCount.current >= turns.length) {
                // end of aim game
                /*
                console.log('ready for next game');
                connection.send('playerReady', matchId);
                */
                connection.send('playerReady', matchId);
                clearInterval(turnInterval.current!);
                
                return;
            } 
            // move on to next token
            turnCount.current++; 
            const currentAimToken = turns[turnCount.current]

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
    const clickHandler = () => {
        if (aimToken.clicked) {
            return;
        }

        setAimToken(
            { 
                // all fields except clicked are actually pointless
                x: (aimToken.x / 100) * fieldDimensions.width!, // why is this considered possibly undefined?
                y: (aimToken.y / 100) * fieldDimensions.height!,
                attack: aimToken.attack,
                clicked: true // set clicked to true and re-render token - this will be undone by setInterval callback
            }
        );

        const index = turnCount.current;
        const timeTaken = Date.now() - timeOfRender;
        const aimGameUpdate: AimGameActionDto = { matchId, timeTaken, index };

        connection.send('aimAction', aimGameUpdate);
        console.log(`render click handler, time ${timeTaken}`);
    };

    return (
        <Wrapper>
         { 
            <Token 
                onClick={clickHandler} 
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

interface TokenStyleProps {
    attack: boolean;
    clicked: boolean;
    x: number;
    y: number;
}

const Token = styled.button<TokenStyleProps>`
    width: 50px;
    height: 50px;
    position: relative;
    ${props => props.clicked ? `display: none;` : ``}
    ${props => `left: ${props.x}px; top: ${props.y}px;`}
    border-radius: 50%;
    ${props => `background-color: ${props.attack ? 'green' : 'blue'}`}
`;

export default AimTokenRenderer;
