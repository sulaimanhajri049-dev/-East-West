
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Question, LifelineType, Category } from '../types';
import { generateQuestions } from '../services/geminiService';
import { getQuestionImageUrl, CATEGORY_FALLBACKS } from '../constants';
import { soundManager } from '../utils/soundManager';
import { AlertCircle, Shuffle, Users, Clock, ArrowRight } from 'lucide-react';

interface QuizScreenProps {
  gameState: GameState;
  onAnswer: (isCorrect: boolean, playerId: string | null) => void;
  onUseLifeline: (teamId: 'A' | 'B', lifeline: LifelineType) => void;
  onNextQuestion: () => void;
  onChangeQuestion: (newQuestion: Question) => void;
  t: any;
  language: 'ar' | 'en';
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  gameState,
  onAnswer,
  onUseLifeline,
  onNextQuestion,
  onChangeQuestion,
  t,
  language
}) => {
  const currentQ = gameState.currentRound.questions[gameState.currentRound.currentQuestionIndex];
  const nextQ = gameState.currentRound.questions[gameState.currentRound.currentQuestionIndex + 1];
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [doubleChanceActive, setDoubleChanceActive] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0); 
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  const timerRef = useRef<number | null>(null);
  const category = gameState.settings.category || Category.GENERAL;
  const isFlagCategory = category === Category.FLAGS;

  useEffect(() => {
    setTimeLeft(60);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowPlayerSelect(false);
    setFilteredOptions(currentQ.options);
    setDoubleChanceActive(false);
    setWrongGuesses(0);
    setImageError(false);
    
    const url = getQuestionImageUrl(currentQ.imageUrl);
    setImgSrc(url || CATEGORY_FALLBACKS[category]);

    if (nextQ) {
      const nextUrl = getQuestionImageUrl(nextQ.imageUrl) || CATEGORY_FALLBACKS[category];
      const nextImg = new Image();
      nextImg.src = nextUrl;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          soundManager.play('timeUp');
          return 0;
        }
        if (prev <= 11) {
          soundManager.play('tick');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQ.id, nextQ, category]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered && !doubleChanceActive) return;
    if (showPlayerSelect) return;

    setSelectedOption(option);
    soundManager.play('click');

    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      soundManager.play('correct');
      setIsAnswered(true);
      setShowPlayerSelect(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      soundManager.play('wrong');
      if (doubleChanceActive && wrongGuesses === 0) {
        setWrongGuesses(1);
        setFilteredOptions(prev => prev.filter(o => o !== option));
      } else {
        setIsAnswered(true);
        onAnswer(false, null);
      }
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    soundManager.play('click');
    onAnswer(true, playerId);
    onNextQuestion(); 
  };

  const triggerLifeline = (teamId: 'A' | 'B', type: LifelineType) => {
    soundManager.play('lifeline');
    onUseLifeline(teamId, type);

    if (type === LifelineType.FIFTY_FIFTY) {
      const correct = currentQ.correctAnswer;
      const wrongs = currentQ.options.filter(o => o !== correct);
      const randomWrong = wrongs[Math.floor(Math.random() * wrongs.length)];
      setFilteredOptions([correct, randomWrong].sort(() => Math.random() - 0.5));
    } else if (type === LifelineType.DOUBLE_CHANCE) {
      setDoubleChanceActive(true);
    } else if (type === LifelineType.CHANGE_QUESTION) {
      handleChangeQuestionRequest();
    }
  };

  const handleChangeQuestionRequest = async () => {
    if (!gameState.settings.category || !gameState.settings.difficulty) return;
    const newQuestions = await generateQuestions(
      gameState.settings.category, 
      gameState.settings.difficulty, 
      1, 
      gameState.gameMode,
      language
    );
    if (newQuestions.length > 0) {
      onChangeQuestion(newQuestions[0]);
    }
  };

  const isLifelineUsed = (teamId: 'A' | 'B', type: LifelineType) => {
    const used = teamId === 'A' ? gameState.currentRound.usedLifelines.teamA : gameState.currentRound.usedLifelines.teamB;
    return used.includes(type);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in flex flex-col md:flex-row gap-6 items-start">
      
      <div className="flex-1 w-full">
        
        <div className="flex justify-between items-center mb-6 bg-navy-800/50 p-4 rounded-2xl border border-gold-500/20 backdrop-blur-sm">
          
          <div className="flex items-center gap-3">
             <div className="text-3xl">{gameState.teams.A.avatar}</div>
             <div className="hidden md:block">
               <p className="font-bold text-gold-400">{gameState.teams.A.name}</p>
               <p className="font-mono text-xl">{gameState.teams.A.totalScore}</p>
             </div>
          </div>

          <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 ${timeLeft < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-gold-500 text-gold-500'} bg-navy-900 text-3xl font-bold font-mono shadow-lg`}>
             {timeLeft}
          </div>

          <div className="flex items-center gap-3 flex-row-reverse text-right">
             <div className="text-3xl">{gameState.teams.B.avatar}</div>
             <div className="hidden md:block">
               <p className="font-bold text-gold-400">{gameState.teams.B.name}</p>
               <p className="font-mono text-xl">{gameState.teams.B.totalScore}</p>
             </div>
          </div>
        </div>

        <div className={`relative w-full h-64 md:h-80 mb-6 rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-2xl group ${isFlagCategory ? 'bg-white' : 'bg-black'}`}>
          <img 
            key={currentQ.id} 
            src={imageError ? CATEGORY_FALLBACKS[category] : imgSrc} 
            alt="Question" 
            onError={() => setImageError(true)}
            className={`w-full h-full ${isFlagCategory && !imageError ? 'object-contain p-4' : 'object-cover'} transition-transform duration-700 group-hover:scale-105`}
          />
          {(!isFlagCategory || imageError) && <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>}
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-relaxed drop-shadow-md">
            {currentQ.text}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           {currentQ.options.map((option, idx) => {
             const isSelected = selectedOption === option;
             const isCorrect = option === currentQ.correctAnswer;
             const isVisible = filteredOptions.includes(option);

             let btnClass = "bg-navy-800 hover:bg-navy-700 border-gray-600";
             if (isSelected) {
               if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(22,163,74,0.5)]";
               else btnClass = "bg-red-600 border-red-400 text-white animate-shake";
             } else if (isAnswered && isCorrect) {
               btnClass = "bg-green-900/50 border-green-600/50 text-green-200";
             }

             if (!isVisible) return <div key={idx} className="invisible"></div>;

             return (
               <button
                 key={idx}
                 onClick={() => handleOptionSelect(option)}
                 disabled={isAnswered && !doubleChanceActive}
                 className={`p-4 md:p-6 rounded-xl text-lg md:text-xl font-bold border-2 transition-all transform active:scale-95 ${btnClass}`}
               >
                 {option}
               </button>
             );
           })}
        </div>

        {showPlayerSelect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/90 backdrop-blur-md animate-fade-in">
            <div className="bg-navy-800 border-2 border-gold-500 rounded-2xl p-8 max-w-2xl w-full m-4 shadow-2xl">
               <h3 className="text-3xl text-center text-gold-500 font-bold mb-8">{t.whoAnswered}</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-center text-gray-400 mb-2">{gameState.teams.A.name}</h4>
                    {gameState.teams.A.members.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handlePlayerSelect(m.id)}
                        className="w-full p-3 bg-navy-700 hover:bg-gold-600 hover:text-navy-900 rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <span>{m.name}</span>
                        <Users size={16} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-center text-gray-400 mb-2">{gameState.teams.B.name}</h4>
                    {gameState.teams.B.members.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handlePlayerSelect(m.id)}
                        className="w-full p-3 bg-navy-700 hover:bg-gold-600 hover:text-navy-900 rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <span>{m.name}</span>
                        <Users size={16} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {isAnswered && !showPlayerSelect && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => { soundManager.play('click'); onNextQuestion(); }}
              className="bg-gold-500 text-navy-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gold-400 transition-colors"
            >
              {t.nextQuestion} <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="w-full md:w-64 flex flex-col gap-6 sticky top-6">
         {(['A', 'B'] as ('A' | 'B')[]).map((teamKey) => (
           <div key={teamKey} className="bg-navy-800 p-4 rounded-xl border border-gold-500/20">
              <h4 className="text-gold-400 font-bold mb-3 text-center">{gameState.teams[teamKey].name}</h4>
              <div className="space-y-2">
                 <button 
                   disabled={isLifelineUsed(teamKey, LifelineType.DOUBLE_CHANCE) || isAnswered}
                   onClick={() => triggerLifeline(teamKey, LifelineType.DOUBLE_CHANCE)}
                   className="w-full p-2 bg-navy-900 rounded border border-gray-700 text-sm hover:border-gold-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-between"
                 >
                   <span>{t.lifelines[LifelineType.DOUBLE_CHANCE]}</span> <span className="text-xs bg-gold-900 text-gold-400 px-1 rounded">x2</span>
                 </button>
                 <button 
                   disabled={isLifelineUsed(teamKey, LifelineType.FIFTY_FIFTY) || isAnswered}
                   onClick={() => triggerLifeline(teamKey, LifelineType.FIFTY_FIFTY)}
                   className="w-full p-2 bg-navy-900 rounded border border-gray-700 text-sm hover:border-gold-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-between"
                 >
                   <span>{t.lifelines[LifelineType.FIFTY_FIFTY]}</span> <span className="text-xs bg-gold-900 text-gold-400 px-1 rounded">50:50</span>
                 </button>
                 <button 
                   disabled={isLifelineUsed(teamKey, LifelineType.CHANGE_QUESTION) || isAnswered}
                   onClick={() => triggerLifeline(teamKey, LifelineType.CHANGE_QUESTION)}
                   className="w-full p-2 bg-navy-900 rounded border border-gray-700 text-sm hover:border-gold-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-between"
                 >
                   <span>{t.lifelines[LifelineType.CHANGE_QUESTION]}</span> <Shuffle size={14} />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
