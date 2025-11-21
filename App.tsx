
import React, { useState, useEffect } from 'react';
import { GamePhase, GameState, Team, Difficulty, Category, Question, LifelineType, GameMode, Language, User } from './types';
import { INITIAL_TEAMS_STATE, CATEGORY_ICONS, getQuestionImageUrl, KIDS_CATEGORIES, STUDENT_CATEGORIES, CLASSIC_CATEGORIES } from './constants';
import { Logo } from './components/Logo';
import { TeamSetup } from './components/TeamSetup';
import { OnlineMode } from './components/OnlineMode';
import { LoginScreen } from './components/LoginScreen';
import { generateQuestions } from './services/geminiService';
import { authService } from './services/authService';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { soundManager } from './utils/soundManager';
import { TRANSLATIONS } from './translations';
import { Play, ArrowLeft, AlertTriangle, Globe, Trophy, Baby, GraduationCap, Star } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('ar');
  
  // Derive text based on language
  const t = TRANSLATIONS[language];

  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.LOGIN,
    gameMode: 'CLASSIC',
    teams: JSON.parse(JSON.stringify(INITIAL_TEAMS_STATE)), 
    settings: {
      difficulty: null,
      category: null,
    },
    currentRound: {
      questions: [],
      currentQuestionIndex: 0,
      usedLifelines: {
        teamA: [],
        teamB: [],
      },
      activeLifeline: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setGameState(prev => ({ ...prev, phase: GamePhase.MAIN_MENU }));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setGameState(prev => ({ ...prev, phase: GamePhase.MAIN_MENU }));
  };

  const updateTeam = (teamId: 'A' | 'B', data: Team) => {
    setGameState((prev) => ({
      ...prev,
      teams: {
        ...prev.teams,
        [teamId]: data,
      },
    }));
  };

  const startGame = async (categoryInput: Category | Category[], difficultyInput?: Difficulty, tournamentName?: string) => {
    soundManager.play('click');
    setLoading(true);
    setError(null);
    
    let difficulty = difficultyInput || gameState.settings.difficulty || Difficulty.MEDIUM;
    if (gameState.gameMode === 'KIDS') {
      difficulty = Difficulty.EASY;
    }

    try {
      const questions = await generateQuestions(
        categoryInput, 
        difficulty, 
        10, 
        gameState.gameMode || 'CLASSIC',
        language
      );
      
      if (questions.length > 0) {
        const firstQ = questions[0];
        const imgUrl = getQuestionImageUrl(firstQ.imageUrl);
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); 
          img.src = imgUrl;
        });
      }

      setGameState((prev) => ({
        ...prev,
        settings: { 
          ...prev.settings, 
          category: categoryInput, 
          difficulty,
          tournamentName: tournamentName || (prev.gameMode === 'LOCAL_TOURNAMENT' ? t.localTournament : undefined)
        },
        currentRound: {
          ...prev.currentRound,
          questions,
          currentQuestionIndex: 0,
        },
        phase: GamePhase.PLAYING,
      }));
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean, playerId: string | null) => {
    if (!isCorrect) return; 

    setGameState(prev => {
      const newState = { ...prev };
      const teamA = newState.teams.A;
      const teamB = newState.teams.B;
      
      if (playerId) {
        const playerA = teamA.members.find(m => m.id === playerId);
        const playerB = teamB.members.find(m => m.id === playerId);
        
        if (playerA) {
          playerA.score += 10;
          teamA.totalScore += 10;
        } else if (playerB) {
          playerB.score += 10;
          teamB.totalScore += 10;
        }
      }

      return newState;
    });
  };

  const handleNextQuestion = () => {
    setGameState(prev => {
      const nextIndex = prev.currentRound.currentQuestionIndex + 1;
      if (nextIndex >= prev.currentRound.questions.length) {
        return { ...prev, phase: GamePhase.GAME_OVER };
      }
      return {
        ...prev,
        currentRound: {
          ...prev.currentRound,
          currentQuestionIndex: nextIndex,
        }
      };
    });
  };

  const handleUseLifeline = (teamId: 'A' | 'B', lifeline: LifelineType) => {
    setGameState(prev => {
      const key = `team${teamId}` as keyof typeof prev.currentRound.usedLifelines;
      return {
        ...prev,
        currentRound: {
          ...prev.currentRound,
          usedLifelines: {
            ...prev.currentRound.usedLifelines,
            [key]: [...prev.currentRound.usedLifelines[key], lifeline]
          }
        }
      };
    });
  };

  const handleChangeQuestion = (newQ: Question) => {
    setGameState(prev => {
        const newQuestions = [...prev.currentRound.questions];
        newQuestions[prev.currentRound.currentQuestionIndex] = newQ;
        return {
            ...prev,
            currentRound: {
                ...prev.currentRound,
                questions: newQuestions
            }
        };
    });
  };

  const resetGame = () => {
    setGameState({
        phase: GamePhase.MAIN_MENU,
        gameMode: 'CLASSIC',
        teams: JSON.parse(JSON.stringify(INITIAL_TEAMS_STATE)),
        settings: { difficulty: null, category: null },
        currentRound: {
            questions: [],
            currentQuestionIndex: 0,
            usedLifelines: { teamA: [], teamB: [] },
            activeLifeline: null
        }
    });
  };

  const handleModeSelect = (mode: GameMode) => {
    soundManager.play('click');
    if (mode === 'LOCAL_TOURNAMENT') {
      // For local tournament, skip setup and go to difficulty (random cats handled later)
      setGameState(prev => ({
        ...prev,
        gameMode: mode,
        phase: GamePhase.SETUP
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        gameMode: mode,
        phase: GamePhase.SETUP
      }));
    }
  };

  const handleContinueFromSetup = () => {
    soundManager.play('click');
    if (gameState.gameMode === 'KIDS') {
      setGameState(prev => ({ ...prev, phase: GamePhase.CATEGORY }));
    } else {
      setGameState(prev => ({ ...prev, phase: GamePhase.DIFFICULTY }));
    }
  };

  // --- RENDERERS ---

  const renderMainMenu = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl animate-fade-in py-8">
      <div className="w-full flex justify-between items-center mb-4 px-4">
        <p className="text-gold-400 text-lg">Hi, {user?.name}</p>
        <button 
          onClick={() => { authService.logout(); setUser(null); setGameState(p => ({...p, phase: GamePhase.LOGIN})); }} 
          className="text-xs text-red-400 border border-red-900 p-2 rounded hover:bg-red-900/20"
        >
          Logout
        </button>
      </div>

      <Logo className="mb-8" size="lg" />

      {/* Online Mode Button - Prominent at the top */}
      <button
        onClick={() => { soundManager.play('click'); setGameState(prev => ({ ...prev, phase: GamePhase.ONLINE_MENU })); }}
        className="w-full max-w-md bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transform hover:scale-105 transition-all flex items-center justify-center gap-4 border-2 border-blue-400/50 mb-4"
      >
        <Globe size={32} className="animate-pulse" />
        <div className="text-center">
          <h3 className="text-2xl font-bold">{t.onlinePlay}</h3>
          <p className="text-blue-200 text-sm">{t.onlineDesc}</p>
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
        {/* Kids Mode */}
        <button
          onClick={() => handleModeSelect('KIDS')}
          className="bg-navy-800 hover:bg-navy-700 border-2 border-pink-500/50 p-6 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1"
        >
          <div className="bg-pink-500/20 p-3 rounded-full text-pink-400">
            <Baby size={32} />
          </div>
          <div className="text-left rtl:text-right">
            <h3 className="text-xl font-bold text-pink-400">{t.kidsMode}</h3>
          </div>
        </button>

        {/* Students Mode */}
        <button
          onClick={() => handleModeSelect('STUDENTS')}
          className="bg-navy-800 hover:bg-navy-700 border-2 border-green-500/50 p-6 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1"
        >
          <div className="bg-green-500/20 p-3 rounded-full text-green-400">
            <GraduationCap size={32} />
          </div>
          <div className="text-left rtl:text-right">
            <h3 className="text-xl font-bold text-green-400">{t.studentsMode}</h3>
          </div>
        </button>

        {/* Original Mode */}
        <button
          onClick={() => handleModeSelect('CLASSIC')}
          className="bg-navy-800 hover:bg-navy-700 border-2 border-gold-500/50 p-6 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1"
        >
          <div className="bg-gold-500/20 p-3 rounded-full text-gold-400">
            <Star size={32} />
          </div>
          <div className="text-left rtl:text-right">
            <h3 className="text-xl font-bold text-gold-400">{t.classicMode}</h3>
          </div>
        </button>

        {/* Local Tournament */}
        <button
          onClick={() => handleModeSelect('LOCAL_TOURNAMENT')}
          className="bg-navy-800 hover:bg-navy-700 border-2 border-purple-500/50 p-6 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1"
        >
          <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
            <Trophy size={32} />
          </div>
          <div className="text-left rtl:text-right">
            <h3 className="text-xl font-bold text-purple-400">{t.localTournament}</h3>
          </div>
        </button>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="w-full max-w-6xl animate-fade-in">
      <button onClick={() => { soundManager.play('click'); setGameState(prev => ({ ...prev, phase: GamePhase.MAIN_MENU })); }} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2">
        <ArrowLeft size={20} /> {t.back}
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <TeamSetup 
          teamId="A" 
          teamData={gameState.teams.A} 
          otherTeamMembers={gameState.teams.B.members}
          onUpdate={updateTeam}
          t={t}
        />
        <TeamSetup 
          teamId="B" 
          teamData={gameState.teams.B} 
          otherTeamMembers={gameState.teams.A.members}
          onUpdate={updateTeam}
          t={t}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinueFromSetup}
          className="bg-gold-500 hover:bg-gold-400 text-navy-900 px-12 py-4 rounded-full font-bold text-2xl shadow-lg shadow-gold-500/20 transform hover:scale-105 transition-all flex items-center gap-3"
        >
          <Play size={28} fill="currentColor" />
          {t.continue}
        </button>
      </div>
    </div>
  );

  const renderCategorySelection = () => {
    let categoriesToShow = CLASSIC_CATEGORIES;
    if (gameState.gameMode === 'KIDS') categoriesToShow = KIDS_CATEGORIES;
    if (gameState.gameMode === 'STUDENTS') categoriesToShow = STUDENT_CATEGORIES;

    return (
      <div className="w-full max-w-6xl animate-fade-in p-4">
        <button onClick={() => { soundManager.play('click'); setGameState(prev => ({ ...prev, phase: GamePhase.DIFFICULTY })); }} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
          <ArrowLeft size={20} /> {t.back}
        </button>

        <h2 className="text-4xl font-bold text-center text-gold-gradient-text mb-12">{t.selectCategory}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categoriesToShow.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                onClick={() => startGame(cat)}
                className="group relative p-6 bg-navy-800 border-2 border-gray-700 hover:border-gold-500 rounded-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="p-4 bg-navy-900 rounded-full group-hover:scale-110 transition-transform duration-300 border border-gray-600 group-hover:border-gold-500">
                    <Icon size={32} className="text-gray-400 group-hover:text-gold-400" />
                  </div>
                  <span className="text-lg font-bold text-gray-300 group-hover:text-white text-center">
                    {t.categories[cat]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDifficulty = () => (
    <div className="w-full max-w-4xl animate-fade-in flex flex-col items-center gap-8 p-4">
       <button onClick={() => { soundManager.play('click'); setGameState(prev => ({ ...prev, phase: GamePhase.SETUP })); }} className="self-start text-gray-400 hover:text-white flex items-center gap-2">
          <ArrowLeft size={20} /> {t.back}
       </button>

       <h2 className="text-3xl font-bold text-gold-500 mb-4">{t.selectDifficulty}</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
         {Object.values(Difficulty).map((diff) => (
           <button
             key={diff}
             onClick={() => {
                soundManager.play('click');
                setGameState(prev => ({ ...prev, settings: { ...prev.settings, difficulty: diff } }));
                
                if (gameState.gameMode === 'LOCAL_TOURNAMENT') {
                   // Local Tournament: Randomly select 3 categories and start
                   const pool = Array.from(new Set([...CLASSIC_CATEGORIES, ...STUDENT_CATEGORIES]));
                   const shuffled = pool.sort(() => 0.5 - Math.random());
                   const randomCats = shuffled.slice(0, 3);
                   startGame(randomCats, diff);
                } else {
                   setGameState(prev => ({ ...prev, phase: GamePhase.CATEGORY }));
                }
             }}
             className="p-6 bg-navy-800 border-2 border-gray-700 hover:border-gold-500 rounded-xl text-xl font-bold transition-all hover:scale-105"
           >
             {t.difficulties[diff]}
           </button>
         ))}
       </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-navy-900 text-earth-100 font-sans flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        {gameState.phase === GamePhase.LOGIN && (
          <LoginScreen 
            onLogin={handleLogin} 
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        )}

        {gameState.phase === GamePhase.MAIN_MENU && renderMainMenu()}
        
        {gameState.phase === GamePhase.ONLINE_MENU && (
          <OnlineMode 
            onBack={() => setGameState(prev => ({ ...prev, phase: GamePhase.MAIN_MENU }))}
            onStartGame={startGame}
            t={t}
          />
        )}

        {gameState.phase === GamePhase.SETUP && renderSetup()}

        {gameState.phase === GamePhase.DIFFICULTY && renderDifficulty()}

        {gameState.phase === GamePhase.CATEGORY && renderCategorySelection()}

        {gameState.phase === GamePhase.LOADING && (
           <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
             <Logo size="lg" className="animate-spin-slow mb-8" />
             <p className="text-2xl text-gold-400 font-bold animate-pulse">{t.loading}</p>
             <p className="text-gray-500 mt-2">{t.appName}</p>
           </div>
        )}

        {gameState.phase === GamePhase.PLAYING && (
          <>
             {loading ? (
                <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
                   <div className="flex flex-col items-center">
                      <Logo size="sm" className="animate-spin mb-4" />
                      <p className="text-gold-400">{t.loading}</p>
                   </div>
                </div>
             ) : null}
             
             {error ? (
               <div className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertTriangle size={48} className="text-red-500 mb-4" />
                  <p className="text-xl text-red-400 mb-4">{error}</p>
                  <button 
                    onClick={() => setGameState(prev => ({ ...prev, phase: GamePhase.MAIN_MENU }))}
                    className="px-6 py-2 bg-navy-800 rounded-lg border border-gold-500 text-gold-400 hover:bg-navy-700"
                  >
                    {t.mainMenu}
                  </button>
               </div>
             ) : (
               <>
                 {gameState.settings.tournamentName && (
                   <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-900/80 to-blue-900/80 px-6 py-2 rounded-full border border-purple-500/30 backdrop-blur-sm z-10">
                     <div className="flex items-center gap-2">
                       <Trophy size={16} className="text-gold-400" />
                       <span className="text-white font-bold tracking-wide">{gameState.settings.tournamentName}</span>
                     </div>
                   </div>
                 )}
                 
                 <QuizScreen
                    gameState={gameState}
                    onAnswer={handleAnswer}
                    onUseLifeline={handleUseLifeline}
                    onNextQuestion={handleNextQuestion}
                    onChangeQuestion={handleChangeQuestion}
                    t={t}
                    language={language}
                 />
               </>
             )}
          </>
        )}

        {gameState.phase === GamePhase.GAME_OVER && (
          <ResultsScreen 
            gameState={gameState}
            onRestart={resetGame}
            t={t}
          />
        )}
      </main>
      
      <footer className="w-full py-4 text-center text-gray-600 text-xs border-t border-navy-800 mt-auto bg-navy-900/50 backdrop-blur-sm">
        <p className="font-mono opacity-50">{t.by}</p>
      </footer>
    </div>
  );
}

export default App;
