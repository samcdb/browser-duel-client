import styled from 'styled-components';
import React, { useState, useEffect, createContext } from 'react';
import MatchConnectionInterface from '../interfaces/MatchConnectionInterface';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

const CourtOutline = styled.div`
    width: 75%;
    height: 90vh;
    margin: 0 auto;
    border: 5px solid black;
`; 
const ActiveArea = styled.div`
    border: 2px dashed black;
    position: relative;
    height: 70vh;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
`;
const MatchWrapper = styled.div``;

interface PlayFieldProps {
    hubConnection: HubConnection
}

interface ReactionClickGameInterface {
    timeUntilScreen: number;
}


const PlayField: React.FC<PlayFieldProps> = ({hubConnection}: PlayFieldProps) => {
    const [matchConnection, setMatchConnection] = useState<MatchConnectionInterface | null>(null);
    const [enemyName, setEnemyName] = useState<string>();

    // games
    const [reactionClickGame, setReactionClickGame] = useState<ReactionClickGameInterface | null>();

    hubConnection.on('matchFound', ({id, enemyName}) => {
        const newMatchConnection: MatchConnectionInterface = {
          matchId: id,
          connection: hubConnection,
        };
        
        setMatchConnection(newMatchConnection);
        setEnemyName(enemyName);

        hubConnection.send('playerReady', id);
    });

    // on a game start -> useEffect where all other games are set to null
    // pass all games to child component
    hubConnection.on('startReactionClickGame', ({ timeUntilScreen }: ReactionClickGameInterface) => {
        console.log(timeUntilScreen)
        const newReactionClickGame: ReactionClickGameInterface = { timeUntilScreen };
        setReactionClickGame(newReactionClickGame);
        });

    return (
        <MatchWrapper>
            {enemyName}
            { matchConnection == null ? "In queue..." :
            <CourtOutline>
                {reactionClickGame?.timeUntilScreen}
                <ActiveArea >

                </ActiveArea>
            </CourtOutline>
            }
        </MatchWrapper>
    );
}

export default PlayField;