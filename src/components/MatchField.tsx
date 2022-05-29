import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import MatchConnection from '../interfaces/MatchConnection';
import { HubConnection } from '@microsoft/signalr';
import ActiveArea from './ActiveArea';
import CurrentGameInfo from '../interfaces/CurrentGameInfo';
import ReactionClickGameInfo from '../interfaces/games/ReactionClickGameInfo';
import GameType from '../enums/GameType'; 

interface PlayFieldProps {
    hubConnection: HubConnection
}

interface MatchFoundDto {
    id: string;
    enemyName: string;
}

// seems a bit pointless for now as it's identical to ReactionClickGameInfo
// but I want a border between network transfer and the client
interface ReactionClickGameDto {
    timeUntilScreen: number;
}

const MatchField: React.FC<PlayFieldProps> = ({hubConnection}: PlayFieldProps) => {
    const [matchConnection, setMatchConnection] = useState<MatchConnection | null>(null);
    const [enemyName, setEnemyName] = useState<string>("");
    // games
    const [currentGameInfo, setCurrentGameInfo] = useState<CurrentGameInfo>({});

    useEffect(() => {
        const matchFoundCallback = ({id, enemyName}: MatchFoundDto) => {
            const newMatchConnection: MatchConnection = {
              matchId: id,
              connection: hubConnection,
            };
            
            setMatchConnection(newMatchConnection);
            setEnemyName(enemyName);
    
            hubConnection.send('playerReady', id);
        }
        hubConnection.on('matchFound', matchFoundCallback);
    
        // on a game start -> useEffect where all other games are set to null
        // pass all games to child component
        const startReactionClickGameCallback = ({ timeUntilScreen }: ReactionClickGameDto) => {
            console.log(timeUntilScreen)
            const reactionClickGame: ReactionClickGameInfo = { timeUntilScreen };
            const currentGame: GameType = GameType.ReactionClick;
    
            setCurrentGameInfo({currentGame, reactionClickGame});
        };
        hubConnection.on('startReactionClickGame', startReactionClickGameCallback);

        return () => {
            hubConnection.off('matchFound', matchFoundCallback);
            hubConnection.off('startReactionClickGame', startReactionClickGameCallback);
        }
    }, []);

    return (
        <MatchWrapper>
            {enemyName}
            { matchConnection == null ? "In queue..." :
            <CourtOutline>
                <ActiveArea matchConnection={matchConnection} gameInfo={currentGameInfo}/>
            </CourtOutline>
            }
        </MatchWrapper>
    );
}

const MatchWrapper = styled.div``;
const CourtOutline = styled.div`
    width: 75%;
    height: 90vh;
    margin: 0 auto;
    border: 5px solid black;
`;

export default MatchField;