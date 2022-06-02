import React from 'react';
import styled from 'styled-components';
import MatchConnection from '../interfaces/MatchConnection';
import CurrentGameInfo from '../interfaces/CurrentGameInfo';
import GameType from '../enums/GameType';
import ReactionClickGame from './games/ReactionClickGame';
import AimGame from './games/AimGame';

// at the moment all are null except for current game - might need to think of something cleaner
interface ActiveAreaProps {
    matchConnection: MatchConnection;
    gameInfo: CurrentGameInfo;
}

const ActiveArea: React.FC<ActiveAreaProps> = ({matchConnection, gameInfo}: ActiveAreaProps) => {
    // returns relevant game element based on the next game type
    // must be defined in this function to have access to matchConnection - closure
    const renderGame = (gameInfo: CurrentGameInfo): JSX.Element => {
        switch (gameInfo.currentGame) {
            case GameType.ReactionClick:
                return <ReactionClickGame matchConnection={matchConnection} gameInfo={gameInfo.reactionClickGame!}/>;

            case GameType.Aim:
                return <AimGame matchConnection={matchConnection} gameInfo={gameInfo.aimGame!}/>;
            
            default:
                return <>Waiting for game</>
        }
    }

    return (
        <Area>
            {renderGame(gameInfo)}
        </Area>
    );
}

// make it a style guideline to put styles below?
const Area = styled.div`
    border: 2px dashed black;
    position: relative;
    height: 70%;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
`;

export default ActiveArea;