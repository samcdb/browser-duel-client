import React, { useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import './App.css';

const App: React.FC = () => {
    // sets a client message, sent from the server
  const [clientMessage, setClientMessage] = useState<string | null>(null);
  const [ connection, setConnection ] = useState<HubConnection | null>(null);

  // starts the SignalR connection
  // only run on first render
  useEffect(() => {
      console.log("Set up connection");
      const newConnection : HubConnection = new HubConnectionBuilder()
          .withUrl("http://localhost:5084/chatHub")
          .withAutomaticReconnect()
          .build();

      setConnection(newConnection);
  }, []);

  //
  useEffect(() => {
    
    if (connection) {
      connection.start()
          .then(result => {
              console.log('Connected!');

              connection.on('Message', message => {
                setClientMessage(message);
              });
          })
          .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection]);

  return (
    <>
      <p>{clientMessage}</p>
      <TestButton clickHandler={async () => 
        {
          console.log("Sending");
          await connection?.send('SendMessage', '-left-');
          console.log("Done");
        }}/>
      <TestButton clickHandler={async () => 
        {
          console.log("Sending");
          await connection?.send('SendMessage', '-right-');
          console.log("Done");
        }}/>
    </>);
}

interface TestButtonProps{
  clickHandler() : void;
}

const TestButton : React.FC<TestButtonProps> = (props : TestButtonProps) => {
  return (
    <button onClick={props.clickHandler}></button>
  );
}

export default App;
