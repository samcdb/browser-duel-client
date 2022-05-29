import { HubConnection} from '@microsoft/signalr';

interface MatchConnectionInterface {
  matchId: string;
  connection: HubConnection;
}

export default MatchConnectionInterface;