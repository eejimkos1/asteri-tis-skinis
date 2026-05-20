import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';
import { SplashScreen } from './components/screens/SplashScreen';
import { NameEntryScreen } from './components/screens/NameEntryScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { WorldMap } from './components/screens/WorldMap';
import { LevelSelect } from './components/screens/LevelSelect';
import { GameScreen } from './components/screens/GameScreen';
import { DanceChallenge } from './components/screens/DanceChallenge';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { TrophyScreen } from './components/screens/TrophyScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';

function GameRouter() {
  const { state } = useGame();

  const screens: Record<string, JSX.Element> = {
    splash: <SplashScreen />,
    nameEntry: <NameEntryScreen />,
    home: <HomeScreen />,
    worldMap: <WorldMap />,
    levelSelect: <LevelSelect />,
    game: <GameScreen />,
    danceChallenge: <DanceChallenge />,
    results: <ResultsScreen />,
    trophy: <TrophyScreen />,
    settings: <SettingsScreen />,
    leaderboard: <LeaderboardScreen />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.screen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        style={{ width: '100%', height: '100%' }}
      >
        {screens[state.screen] || <HomeScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

function AppWithContext() {
  const { state } = useGame();

  // On first load, check if player has entered their name
  if (state.screen === 'splash') {
    return <SplashScreen />;
  }

  // After splash, check if name exists
  const hasName = localStorage.getItem('asteri-player-name');
  if (!hasName && state.screen === 'home') {
    return <NameEntryScreen />;
  }

  return <GameRouter />;
}

export default function App() {
  return (
    <GameProvider>
      <AudioProvider>
        <AppWithContext />
      </AudioProvider>
    </GameProvider>
  );
}
