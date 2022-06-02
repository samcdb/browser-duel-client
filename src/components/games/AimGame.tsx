import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import MatchConnection from '../../interfaces/MatchConnection';
import { AimToken, AimGameInfo } from '../../interfaces/games/AimGameInfo';

interface AimGameProps {
    matchConnection: MatchConnection;
    gameInfo: AimGameInfo;
}

const AimGame: React.FC<AimGameProps> = () => {
    return (
        <AimField/>
    )
}

const AimField = styled.div`
    height: 100%;
    background-color: #FAEBD7;
`;

export default AimGame;