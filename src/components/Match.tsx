import React, { useState, useEffect, createContext } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import MatchField from './MatchField';
import MatchConnectionInterface from '../interfaces/MatchConnectionInterface';

//const MatchConnectionContext = createContext<MatchConnectionInterface | null>(null);

const Match: React.FC = () => {
    //const [ connection, setConnection ] = useState<HubConnection | null>(null);

    console.log("Set up connection");
    const newConnection: HubConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5084/matchHub")
        .withAutomaticReconnect()
        .build();

    newConnection.start();
    newConnection.on('connected', (message) => {
        console.log(message)
        newConnection?.send('addToQueue', '6b3a81a4-05a4-44ed-bc97-a71802690bb8');
        });
    
  
        //setConnection(newConnection);

    // why do tutorials do this?
    /*
    useEffect(() => {
        if (connection) {
          connection
            .start()
            .then(() => {
              connection.on('connected', (message) => {
                console.log(message)
                connection?.send('addToQueue', '6b3a81a4-05a4-44ed-bc97-a71802690bb8');
              });
              connection.on('matchFound', ({id, enemyName}) => {
                console.log(`match Id: ${id} enemy: ${enemyName}`)
              });
            })
            .catch((error) => console.log(error));
        }
      }, [connection]);
*/
    return (
        <MatchField hubConnection={newConnection}/>
    )
}

export default Match;