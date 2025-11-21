
import React, { useState } from 'react';
import { Category, Difficulty } from '../types';
import { CATEGORY_ICONS, CLASSIC_CATEGORIES, STUDENT_CATEGORIES } from '../constants';
import { Copy, Play, Globe, Trophy, CheckCircle, ArrowLeft, Hash, Users, Edit3, Share2 } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

interface OnlineModeProps {
  onBack: () => void;
  onStartGame: (categories: Category[], difficulty: Difficulty, tournamentName?: string) => void;
  t: any;
}

type OnlinePhase = 'HUB' | 'CREATE_FRIENDLY' | 'JOIN_MATCH' | 'CREATE_TOURNAMENT' | 'JOIN_TOURNAMENT';

export const OnlineMode: React.FC<OnlineModeProps> = ({ onBack, onStartGame, t }) => {
  const [phase, setPhase] = useState<OnlinePhase>('HUB');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [tournamentName, setTournamentName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) return prev.filter(c => c !== cat);
      if (prev.length >= 3) return prev;
      return [...prev, cat];
    });
  };

  const generateFriendlyCode = () => {
    if (selectedCategories.length === 0) {
      setError(t.error);
      return;
    }
    
    const payload = {
      c: selectedCategories,
      d: selectedDifficulty,
      t: 'F' 
    };
    
    encodeAndSet(payload);
    soundManager.play('correct');
  };

  const generateTournamentCode = () => {
    if (!tournamentName.trim()) {
      setError(t.error);
      return;
    }

    const pool = Array.from(new Set([...CLASSIC_CATEGORIES, ...STUDENT_CATEGORIES]));
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const randomCats = shuffled.slice(0, 3);
    
    const payload = {
      c: randomCats,
      d: selectedDifficulty,
      n: tournamentName.trim(),
      t: 'T' 
    };
    
    encodeAndSet(payload);
    soundManager.play('correct');
  };

  const encodeAndSet = (payload: any) => {
    const jsonStr = JSON.stringify(payload);
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
    setGeneratedCode(`SG-${base64}`);
  };

  const handleJoin = () => {
    try {
      const raw = inputCode.trim();
      if (!raw.startsWith('SG-')) throw new Error(t.codeError);
      
      const content = raw.replace('SG-', '');
      const jsonStr = decodeURIComponent(escape(atob(content)));
      const payload = JSON.parse(jsonStr);
      
      if (!payload.c || !payload.d) throw new Error(t.error);
      
      soundManager.play('click');
      onStartGame(payload.c, payload.d, payload.n);
      
    } catch (e) {
      setError(t.codeError);
      soundManager.play('wrong');
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      soundManager.play('click');
    }
  };

  const renderHub = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl animate-fade-in p-4">
      <button
        onClick={() => { soundManager.play('click'); setPhase('CREATE_FRIENDLY'); setSelectedCategories([]); setError(null); }}
        className="group relative p-8 bg-gradient-to-br from-navy-800 to-navy-900 border-2 border-gold-500/30 rounded-2xl hover:border-gold-500 transition-all hover:-translate-y-2 flex flex-col items-center justify-center gap-4 overflow-hidden h-64"
      >
        <Users size={64} className="text-gold-400 group-hover:scale-110 transition-transform" />
        <h3 className="text-2xl font-bold text-white">{t.createFriendly}</h3>
        <p className="text-sm text-gray-400 text-center">{t.createFriendlyDesc}</p>
      </button>

      <button
        onClick={() => { soundManager.play('click'); setPhase('JOIN_MATCH'); setError(null); }}
        className="group relative p-8 bg-gradient-to-br from-navy-800 to-navy-900 border-2 border-green-500/30 rounded-2xl hover:border-green-500 transition-all hover:-translate-y-2 flex flex-col items-center justify-center gap-4 overflow-hidden h-64"
      >
        <div className="relative">
           <Users size={64} className="text-green-400 opacity-50" />
           <ArrowLeft size={32} className="text-white absolute -bottom-2 -left-2 bg-green-600 rounded-full p-1" />
        </div>
        <h3 className="text-2xl font-bold text-white">{t.joinFriendly}</h3>
        <p className="text-sm text-gray-400 text-center">{t.joinFriendlyDesc}</p>
      </button>

      <button
        onClick={() => { soundManager.play('click'); setPhase('CREATE_TOURNAMENT'); setTournamentName(''); setError(null); }}
        className="group relative p-8 bg-gradient-to-br from-navy-800 to-navy-900 border-2 border-purple-500/30 rounded-2xl hover:border-purple-500 transition-all hover:-translate-y-2 flex flex-col items-center justify-center gap-4 overflow-hidden h-64"
      >
        <Trophy size={64} className="text-purple-400 group-hover:rotate-12 transition-transform" />
        <h3 className="text-2xl font-bold text-white">{t.createTournament}</h3>
        <p className="text-sm text-gray-400 text-center">{t.createTournamentDesc}</p>
      </button>

      <button
        onClick={() => { soundManager.play('click'); setPhase('JOIN_TOURNAMENT'); setError(null); }}
        className="group relative p-8 bg-gradient-to-br from-navy-800 to-navy-900 border-2 border-blue-500/30 rounded-2xl hover:border-blue-500 transition-all hover:-translate-y-2 flex flex-col items-center justify-center gap-4 overflow-hidden h-64"
      >
        <div className="relative">
           <Trophy size={64} className="text-blue-400 opacity-50" />
           <ArrowLeft size={32} className="text-white absolute -bottom-2 -left-2 bg-blue-600 rounded-full p-1" />
        </div>
        <h3 className="text-2xl font-bold text-white">{t.joinTournament}</h3>
        <p className="text-sm text-gray-400 text-center">{t.joinTournamentDesc}</p>
      </button>
    </div>
  );

  const renderDifficultySelector = () => (
    <div className="mb-8 w-full">
      <h3 className="text-xl text-white mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-gold-500"/> {t.selectDifficulty}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
        {Object.values(Difficulty).map(diff => (
            <button
              key={diff}
              onClick={() => { soundManager.play('click'); setSelectedDifficulty(diff); }}
              className={`px-6 py-3 rounded-full border whitespace-nowrap transition-all ${selectedDifficulty === diff ? 'bg-gold-500 text-navy-900 border-gold-500 font-bold' : 'bg-navy-800 border-gray-700 text-gray-400 hover:bg-navy-700'}`}
            >
              {t.difficulties[diff]}
            </button>
        ))}
      </div>
    </div>
  );

  const renderCreateFriendly = () => (
    <div className="w-full max-w-5xl animate-fade-in p-6">
       <div className="flex items-center justify-center gap-3 mb-8">
         <Users size={32} className="text-gold-500" />
         <h2 className="text-3xl text-gold-400 font-bold text-center">{t.createFriendly}</h2>
       </div>
       
       <div className="mb-8">
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.values(Category).map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => { soundManager.play('click'); toggleCategory(cat); }}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all hover:-translate-y-1 ${isSelected ? 'bg-gold-500 text-navy-900 border-gold-500 shadow-lg shadow-gold-500/20' : 'bg-navy-800 border-gray-700 text-gray-400 hover:border-gold-500/50'}`}
                >
                  <Icon size={24} />
                  <span className="text-xs md:text-sm font-bold text-center">{t.categories[cat]}</span>
                </button>
              )
            })}
         </div>
       </div>

       {renderDifficultySelector()}

       <div className="flex justify-center">
          <button 
            onClick={generateFriendlyCode}
            className="bg-gold-500 hover:bg-gold-400 text-navy-900 px-12 py-4 rounded-full font-bold text-xl flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all hover:scale-105"
          >
             <Share2 size={24} /> {t.generateCode}
          </button>
       </div>
       {error && <p className="text-red-400 text-center mt-4 bg-red-900/20 p-2 rounded">{error}</p>}
    </div>
  );

  const renderCreateTournament = () => (
    <div className="w-full max-w-3xl animate-fade-in p-6 flex flex-col items-center">
       <div className="flex items-center justify-center gap-3 mb-8">
         <Trophy size={32} className="text-purple-500" />
         <h2 className="text-3xl text-purple-400 font-bold text-center">{t.createTournament}</h2>
       </div>

       <div className="w-full mb-8">
         <label className="block text-gray-400 mb-2 text-lg">{t.tournamentName}</label>
         <div className="relative">
           <Edit3 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 rtl:left-4 rtl:right-auto" />
           <input 
             type="text"
             value={tournamentName}
             onChange={(e) => setTournamentName(e.target.value)}
             placeholder={t.exampleTournament}
             className="w-full bg-navy-900 border-2 border-gray-600 focus:border-purple-500 rounded-xl p-4 px-12 text-white text-lg outline-none transition-all"
           />
         </div>
       </div>

       <div className="w-full bg-navy-800/50 p-6 rounded-xl border border-purple-500/30 mb-8 text-center">
          <p className="text-gray-300">{t.randomCategoriesNote}</p>
       </div>

       {renderDifficultySelector()}

       <button 
         onClick={generateTournamentCode}
         className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-4 rounded-full font-bold text-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
       >
          <Trophy size={24} /> {t.createTournament}
       </button>

       {error && <p className="text-red-400 text-center mt-4 bg-red-900/20 p-2 rounded">{error}</p>}
    </div>
  );

  const renderJoinScreen = (isTournament: boolean) => (
    <div className="w-full max-w-md animate-fade-in flex flex-col gap-6 p-6">
      <div className="text-center mb-4">
         {isTournament ? <Trophy size={48} className="text-blue-400 mx-auto mb-2" /> : <Users size={48} className="text-green-400 mx-auto mb-2" />}
         <h2 className={`text-3xl font-bold ${isTournament ? 'text-blue-400' : 'text-green-400'}`}>
            {isTournament ? t.joinTournament : t.joinFriendly}
         </h2>
      </div>
      
      <div className="space-y-2">
        <label className="text-gray-400">{t.enterCode}</label>
        <div className="relative">
            <Hash className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 rtl:left-4 rtl:right-auto" />
            <input 
              type="text" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="SG-..."
              className="w-full bg-navy-900 border-2 border-gray-600 focus:border-blue-500 rounded-xl p-4 px-12 text-white text-center font-mono text-lg outline-none ltr"
            />
        </div>
      </div>
      <button 
        onClick={handleJoin}
        disabled={!inputCode}
        className={`w-full font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${isTournament ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
      >
        <Play size={20} fill="currentColor" /> {t.continue}
      </button>
      {error && <p className="text-red-400 text-center bg-red-900/20 p-2 rounded">{error}</p>}
    </div>
  );

  if (generatedCode) {
    const isTournament = phase === 'CREATE_TOURNAMENT';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/95 p-4 animate-fade-in">
         <div className={`bg-navy-800 border-2 ${isTournament ? 'border-purple-500' : 'border-gold-500'} rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl`}>
            {isTournament ? (
               <Trophy size={64} className="text-purple-500 mx-auto mb-6 animate-bounce" />
            ) : (
               <Users size={64} className="text-gold-500 mx-auto mb-6 animate-bounce" />
            )}
            
            <h2 className="text-3xl text-white font-bold mb-2">{t.successCreate}</h2>
            {isTournament && <p className="text-purple-400 text-xl font-bold mb-2">"{tournamentName}"</p>}
            
            <p className="text-gray-400 mb-6 mt-4">{t.shareCode}</p>
            
            <div className="bg-navy-900 p-4 rounded-lg border border-gray-700 flex items-center justify-between gap-4 mb-8 relative group hover:border-white/20 transition-colors">
               <code className="text-gold-400 font-mono text-sm md:text-lg break-all text-left flex-1">{generatedCode}</code>
               <button onClick={copyCode} className="p-2 bg-navy-800 hover:bg-navy-700 rounded-lg text-gray-300 hover:text-white transition-colors border border-gray-700">
                 <Copy size={20} />
               </button>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={copyCode}
                className={`w-full font-bold py-3 rounded-xl transition-colors ${isTournament ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-gold-500 hover:bg-gold-400 text-navy-900'}`}
              >
                {t.copyCode}
              </button>
              <button 
                onClick={() => {
                   const content = generatedCode.replace('SG-', '');
                   const jsonStr = decodeURIComponent(escape(atob(content)));
                   const payload = JSON.parse(jsonStr);
                   onStartGame(payload.c, payload.d, payload.n);
                }}
                className="w-full bg-navy-700 text-white font-bold py-3 rounded-xl hover:bg-navy-600 transition-colors border border-gray-600"
              >
                {t.joinAsHost}
              </button>
            </div>
         </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[60vh]">
       {phase !== 'HUB' && (
         <button onClick={() => { soundManager.play('click'); setPhase('HUB'); setError(null); }} className="self-start mb-6 text-gray-400 hover:text-white flex items-center gap-2 bg-navy-800/50 px-4 py-2 rounded-full border border-gray-700">
            <ArrowLeft size={20} /> {t.back}
         </button>
       )}
       
       {phase === 'HUB' && (
          <div className="flex flex-col items-center gap-8 w-full">
             <div className="text-center mb-4">
               <Globe className="w-16 h-16 text-gold-500 mx-auto mb-4 animate-pulse" />
               <h2 className="text-4xl font-bold text-gold-gradient-text">{t.onlineHub}</h2>
               <p className="text-gray-400 mt-2">{t.onlineHubDesc}</p>
             </div>
             {renderHub()}
             <button onClick={() => { soundManager.play('click'); onBack(); }} className="mt-8 text-gray-500 hover:text-white flex items-center gap-2">
                <ArrowLeft size={16} /> {t.back}
             </button>
          </div>
       )}

       {phase === 'CREATE_FRIENDLY' && renderCreateFriendly()}
       {phase === 'CREATE_TOURNAMENT' && renderCreateTournament()}
       {(phase === 'JOIN_MATCH' || phase === 'JOIN_TOURNAMENT') && renderJoinScreen(phase === 'JOIN_TOURNAMENT')}
    </div>
  );
};
