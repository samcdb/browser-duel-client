import ReactionClickGameInfo from './games/ReactionClickGameInfo';
import GameType from '../enums/GameType';

interface CurrentGameInfo {
    // might be overkill - all games except current game will be null
    // adding enum field just saves time isntead of having to do null checks
    currentGame?: GameType;
    reactionClickGame?: ReactionClickGameInfo;
}

export default CurrentGameInfo;