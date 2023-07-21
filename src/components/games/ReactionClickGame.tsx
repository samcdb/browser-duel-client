import React, { useEffect, useState, useRef } from 'react';
import MatchConnection from '../../interfaces/MatchConnection';
import ReactionClickGameInfo from '../../interfaces/games/ReactionClickGameInfo';
import styled from 'styled-components';

interface ReactionClickProps {
    matchConnection: MatchConnection;
    gameInfo: ReactionClickGameInfo;
}

interface ReactionClickAction {
    matchId: string;
    timeTaken: number;
}

interface ReactionClickResult {
    won: boolean | null;
}

// screen is inactive (grey) on start up
// if player clicks while screen is inactive -> fail, send to server
// screen becomes active (yellow) after delay
// if player clicks (border appears around screen - becomes different shade of yellow) -> record time and send to server 
// server processes results -> returns whether player won
// if won -> green, lost -> red, tie? -> grey
// states: inactive (grey), active (yellow), inactive&clicked = fail, active&clicked = yellow with border, success/won (green), tie (grey)
const ReactionClickGame: React.FC<ReactionClickProps> = ({matchConnection, gameInfo}: ReactionClickProps) => {
    const [active, setActive] = useState<boolean>(false); 
    const [clicked, setClicked] = useState<boolean>(false); 
    const [won, setWon] = useState<boolean | null>(null);
    const activationTimeout = useRef<NodeJS.Timeout | null>(null);
    const startTime = useRef<number>(0);
    const timeTaken = useRef<number>(0);

    const {connection, matchId} = matchConnection;

    // subscribe and unsubscribe from connection events
    useEffect(() => {
        const resultCallback = ({won}: ReactionClickResult) => {
            console.log(`received result ${won}`);
            setWon(won);
        };
        connection.on('updateReactionClickGame', resultCallback);

        return () => connection.off('updateReactionClickGame', resultCallback);
    }, []);

    // send ready message when game has concluded
    useEffect(() => {
        // give players time to see game result
        if (won === null) {
            return;
        }
        
        setTimeout(() => {
            console.log('ready for next game');
            connection.send('playerReady', matchId);
        }, 2000);
    }, [won]);

    // set time until screen activates - only happens once
    useEffect(() => {
        console.log("Starting activation countdown");
        activationTimeout.current = setTimeout(() => {
            // activate screen and start timing player
            console.log('activating screen');
            setActive(true);
            startTime.current = Date.now();
        }, gameInfo.timeUntilScreen);
    }, [gameInfo.timeUntilScreen]);

    const handleClick = async (): Promise<void> => {
        if (clicked)
            return;
        
        setClicked(true);
        clearTimeout(activationTimeout.current as  NodeJS.Timeout);
        timeTaken.current = Date.now() - startTime.current;

        try {
            console.log('player clicked');
            const update: ReactionClickAction = { matchId, timeTaken: timeTaken.current };
            await connection.send('reactionClickAction', update);
            console.log('successfully sent click');
        }
        catch (error) {
            console.error(error);
        }
    }
    
    // on rendering for the first time ->
    // start counter to turn screen green - only once
    // screen has onClick that disqualifies you if you click before green
    const colour: string = chooseColour(won, clicked, active);
    console.log(colour);
    return (
        <ReactionScreen colour={colour} onClick={handleClick}/>
    );
}

// styles
interface StyleProps {
    colour: string;
}

const ReactionScreen = styled.div<StyleProps>`
    height: 100%;
    ${props => `background-color: ${props.colour};`};
`;

// helper functions
const chooseColour = (won: boolean | null, clicked: boolean, active: boolean): string => {
    console.log(`Manage colour: won - ${won} clicked - ${clicked} active - ${active}`)
    if (won == null) {
        if (clicked) {
            return active ? 'gold' : 'red';
        }
        // not clicked yet
        return active ? 'yellow' : 'gray'
    }

    return won ? 'green' : 'red';
}


export default ReactionClickGame;