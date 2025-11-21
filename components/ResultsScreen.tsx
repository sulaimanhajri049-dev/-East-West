
import React, { useMemo, useEffect } from 'react';
import { GameState, Player } from '../types';
import { Crown, Trophy, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

interface ResultsScreenProps {
  gameState: GameState;
  onRestart: () => void;
  t: any;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ gameState, onRestart, t }) => {
  const allPlayers = useMemo(() => {
    return [...gameState.teams.A.members, ...gameState.teams.B.members];
  }, [gameState.teams]);

  const mvp = useMemo(() => {
    if (allPlayers.length === 0) return null;
    return allPlayers.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  }, [allPlayers]);

  const winner = gameState.teams.A.totalScore > gameState.teams.B.totalScore ? gameState.teams.A : gameState.teams.B.totalScore > gameState.teams.A.totalScore ? gameState.teams.B : null;

  useEffect(() => {
    if (winner) {
      soundManager.play('win');
    } else {
      soundManager.play('timeUp');
    }
  }, [winner]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <h1 className="text-5xl font-bold text-gold-500 mb-12">{t.results}</h1>

      <div className="relative mb-16">
        {winner ? (
          <div className="bg-gradient-to-b from-navy-800 to-navy-900 border-4 border-gold-500 p-10 rounded-3xl shadow-[0_0_50px_rgba(197,160,89,0.3)] transform scale-110">
             <Trophy className="w-24 h-24 text-gold-400 mx-auto mb-4 animate-bounce" />
             <h2 className="text-2xl text-gray-300 mb-2">{t.winner}</h2>
             <div className="text-6xl mb-2">{winner.avatar}</div>
             <h3 className="text-4xl font-bold text-white">{winner.name}</h3>
             <p className="text-2xl text-gold-500 font-mono mt-4">{winner.totalScore} {t.score}</p>
          </div>
        ) : (
          <div className="text-3xl text-gray-300">{t.draw}</div>
        )}
      </div>

      {mvp && mvp.score > 0 && (
        <div className="w-full max-w-md bg-navy-800/50 border border-gold-500/30 rounded-xl p-6 flex items-center gap-6 mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-bl-xl">MVP</div>
           <div className="relative">
              <Crown className="w-12 h-12 text-gold-400 absolute -top-6 -left-4 transform -rotate-12" />
              <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center text-2xl border-2 border-gold-500">
                👑
              </div>
           </div>
           <div className="text-right flex-1">
              <p className="text-gray-400 text-sm">{t.mvp}</p>
              <h4 className="text-2xl font-bold text-white">{mvp.name}</h4>
              <p className="text-gold-500">{mvp.score} {t.score}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 w-full max-w-3xl mb-12">
         <div className="bg-navy-800 rounded-xl p-4">
            <h4 className="text-gold-500 font-bold mb-4 border-b border-gray-700 pb-2">{gameState.teams.A.name}</h4>
            {gameState.teams.A.members.sort((a,b) => b.score - a.score).map(p => (
               <div key={p.id} className="flex justify-between py-2 text-sm border-b border-gray-700/50 last:border-0">
                  <span>{p.name}</span>
                  <span className="font-mono text-gold-400">{p.score}</span>
               </div>
            ))}
         </div>
         <div className="bg-navy-800 rounded-xl p-4">
            <h4 className="text-gold-500 font-bold mb-4 border-b border-gray-700 pb-2">{gameState.teams.B.name}</h4>
            {gameState.teams.B.members.sort((a,b) => b.score - a.score).map(p => (
               <div key={p.id} className="flex justify-between py-2 text-sm border-b border-gray-700/50 last:border-0">
                  <span>{p.name}</span>
                  <span className="font-mono text-gold-400">{p.score}</span>
               </div>
            ))}
         </div>
      </div>

      <button 
        onClick={() => { soundManager.play('click'); onRestart(); }}
        className="flex items-center gap-2 bg-white text-navy-900 hover:bg-gray-200 px-8 py-4 rounded-full text-xl font-bold transition-all"
      >
        <RotateCcw size={20} />
        {t.newGame}
      </button>
    </div>
  );
};
