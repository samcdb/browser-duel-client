import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import Match from './components/Match';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </BrowserRouter>
  );
    // sets a client message, sent from the server
    /*
  const [clientMessage, setClientMessage] = useState<string | null>(null);
  const [ connection, setConnection ] = useState<HubConnection | null>(null);

  // starts the SignalR connection
  // only run on first render
  useEffect(() => {
      console.log("Set up connection");
      const newConnection : HubConnection = new HubConnectionBuilder()
          .withUrl("http://localhost:5084/matchHub")
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
          await connection?.send('addToQueue', '6b3a81a4-05a4-44ed-bc97-a71802690bb8');
          console.log("Done");
        }}/>
    </>);
    */

    
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
