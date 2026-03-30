import { useState, useEffect } from 'react';
import { TDSMobileProvider } from '@toss/tds-mobile';
import { LobbyView } from './components/LobbyView';
import { StageView } from './components/StageView';
import { ResultView } from './components/ResultView';
import { useGameLogic } from './hooks/useGameLogic';
import { useBoltStorage } from './hooks/useBoltStorage';

const defaultUserAgent = {
  fontA11y: undefined,
  fontScale: 1,
  isAndroid: false,
  isIOS: true,
};

export default function App() {
  const game = useGameLogic();
  const boltStorage = useBoltStorage();
  // 'lobby' | 'playing' | 'result'
  const [screen, setScreen] = useState<'lobby' | 'playing' | 'result'>('lobby');

  const goToPlaying = () => setScreen('playing');
  const goToLobby = () => {
    game.resetGame();
    setScreen('lobby');
  };
  const goToResult = () => setScreen('result');

  // allCleared 시 자동으로 result 화면 전환
  useEffect(() => {
    if (game.allCleared && screen !== 'result') {
      setScreen('result');
    }
  }, [game.allCleared, screen]);

  return (
    <TDSMobileProvider userAgent={defaultUserAgent}>
      {screen === 'lobby' && <LobbyView game={game} boltStorage={boltStorage} onStart={goToPlaying} onGoConvert={goToResult} />}
      {screen === 'playing' && (
        <StageView
          game={game}
          boltStorage={boltStorage}
          onEnd={goToResult}
        />
      )}
      {screen === 'result' && <ResultView boltStorage={boltStorage} isCompleted={game.allCleared} onReset={goToLobby} />}
    </TDSMobileProvider>
  );
}
