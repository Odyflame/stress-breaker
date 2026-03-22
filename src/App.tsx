import { useState, useEffect } from 'react';
import { TDSMobileProvider } from '@toss/tds-mobile';
import { LobbyView } from './components/LobbyView';
import { StageView } from './components/StageView';
import { ResultView } from './components/ResultView';
import { useGameLogic } from './hooks/useGameLogic';

const defaultUserAgent = {
  fontA11y: undefined,
  fontScale: 1,
  isAndroid: false,
  isIOS: true,
};

export default function App() {
  const game = useGameLogic();
  // 'lobby' | 'playing' | 'result'
  const [screen, setScreen] = useState<'lobby' | 'playing' | 'result'>('lobby');

  const goToPlaying = () => setScreen('playing');
  const goToLobby = () => setScreen('lobby');
  const goToResult = () => setScreen('result');

  // allCleared 시 자동으로 result 화면 전환
  useEffect(() => {
    if (game.allCleared && screen !== 'result') {
      setScreen('result');
    }
  }, [game.allCleared, screen]);

  return (
    <TDSMobileProvider userAgent={defaultUserAgent}>
      {screen === 'lobby' && <LobbyView game={game} onStart={goToPlaying} />}
      {screen === 'playing' && (
        <StageView
          game={game}
          onEnd={goToResult}
        />
      )}
      {screen === 'result' && <ResultView totalPoints={game.totalPoints} onReset={goToLobby} />}
    </TDSMobileProvider>
  );
}
