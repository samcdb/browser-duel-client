import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import MatchConnection from '../../interfaces/MatchConnection';
import { AimToken as AimTokenInfo, AimGameInfo } from '../../interfaces/games/AimGameInfo';
import AimTokenRenderer from './AimTokenRenderer';

interface AimGameProps {
    matchConnection: MatchConnection;
    gameInfo: AimGameInfo; // info from server
}

export interface FieldDimensions {
    width?: number;
    height?: number;
}

const AimGame: React.FC<AimGameProps> = ({matchConnection, gameInfo}: AimGameProps) => {
    const [fieldDimensions, setFieldDimensions] = useState<FieldDimensions | null>(null);
    const aimFieldRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // get dimensions of field after rendering
        // aim token does nothing until then
        const width = aimFieldRef?.current?.offsetWidth;
        const height = aimFieldRef?.current?.offsetHeight;
        console.log(`Aim Game: width ${width} height ${height}`)
        setFieldDimensions({ width, height });
    }, []);

    const { turns, timeBetweenTurns } = gameInfo; 

    // on AimToken click, send message to server
    // attack/defense animation and AimToken both handle their own state
    // if this was done by AimField then they'd both be re-rendered at awkward times
    return (
        <AimField ref={aimFieldRef}>
            {
                fieldDimensions == null ? <></> :  
                <AimTokenRenderer 
                    matchConnection={matchConnection} 
                    turns={turns} 
                    timeBetweenTurns={timeBetweenTurns} 
                    fieldDimensions={fieldDimensions}/>
            }
        </AimField>
    );
}

// not sure if I'm being stupid:
// styled vs functional components
// I am only using styled components in place of of an actual css file
// so that I can do inline styling for divs
const AimField = styled.div`
    height: 100%;
    background-color: #FAEBD7;
`;

export default AimGame;