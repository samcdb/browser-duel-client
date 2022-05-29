import { HubConnection} from '@microsoft/signalr';

interface MatchConnection {
  matchId: string;
  connection: HubConnection;
}

export default MatchConnection;