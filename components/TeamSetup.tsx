
import React, { useState, useRef } from 'react';
import { Team, Player } from '../types';
import { TEAM_AVATARS } from '../constants';
import { Plus, Trash2, User, Upload } from 'lucide-react';

interface TeamSetupProps {
  teamId: 'A' | 'B';
  teamData: Team;
  otherTeamMembers: Player[];
  onUpdate: (teamId: 'A' | 'B', data: Team) => void;
  t: any;
}

export const TeamSetup: React.FC<TeamSetupProps> = ({ teamId, teamData, otherTeamMembers, onUpdate, t }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMember = () => {
    const trimmedName = newMemberName.trim();
    if (!trimmedName) return;

    if (teamData.members.some(m => m.name.trim() === trimmedName)) {
      setError(t.nameExists);
      return;
    }

    if (otherTeamMembers.some(m => m.name.trim() === trimmedName)) {
      setError(t.nameExists);
      return;
    }

    setError(null);
    const newMember: Player = {
      id: `${teamId}-${Date.now()}`,
      name: trimmedName,
      score: 0,
    };
    onUpdate(teamId, {
      ...teamData,
      members: [...teamData.members, newMember],
    });
    setNewMemberName('');
  };

  const removeMember = (memberId: string) => {
    onUpdate(teamId, {
      ...teamData,
      members: teamData.members.filter((m) => m.id !== memberId),
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(teamId, { ...teamData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isEmoji = (str: string) => {
    return !str.startsWith('data:image');
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-full max-w-md mx-auto border-t-4 border-gold-500">
      <h3 className="text-2xl font-bold text-gold-400 mb-4 text-center">{t.teamSetup} {teamId}</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t.teamName}</label>
          <input
            type="text"
            value={teamData.name}
            onChange={(e) => onUpdate(teamId, { ...teamData, name: e.target.value })}
            className="w-full bg-navy-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t.teamLogo}</label>
          
          <div className="flex items-center justify-center mb-4">
             <div className="w-24 h-24 rounded-full bg-navy-800 border-2 border-gold-500 flex items-center justify-center overflow-hidden shadow-lg">
               {isEmoji(teamData.avatar) ? (
                 <span className="text-5xl">{teamData.avatar}</span>
               ) : (
                 <img src={teamData.avatar} alt="Team Logo" className="w-full h-full object-cover" />
               )}
             </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-navy-800 hover:bg-navy-700 border border-gold-500/50 px-4 py-2 rounded-lg text-gold-400 transition-colors"
              >
                <Upload size={16} /> {t.uploadImg}
              </button>
            </div>

            <p className="text-center text-gray-500 text-xs">{t.orChooseEmoji}</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {TEAM_AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onUpdate(teamId, { ...teamData, avatar: emoji })}
                  className={`text-xl p-2 rounded-full transition-all ${
                    teamData.avatar === emoji
                      ? 'bg-gold-500 text-navy-900 scale-110'
                      : 'bg-navy-800 hover:bg-navy-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <label className="block text-sm text-gray-400 mb-2">{t.members}</label>
        <div className="flex gap-2 mb-1">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => { setNewMemberName(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && addMember()}
            placeholder={t.addMember}
            className="flex-1 bg-navy-900 border border-gray-700 rounded-lg p-2 text-sm focus:border-gold-500 outline-none"
          />
          <button
            onClick={addMember}
            disabled={!newMemberName.trim()}
            className="bg-gold-500 text-navy-900 p-2 rounded-lg hover:bg-gold-600 disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {error && <p className="text-red-400 text-xs mb-3 animate-pulse">{error}</p>}

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mt-2">
          {teamData.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between bg-navy-800 p-2 rounded border border-gray-700">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gold-500" />
                <span className="text-sm">{member.name}</span>
              </div>
              <button onClick={() => removeMember(member.id)} className="text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {teamData.members.length === 0 && (
            <p className="text-xs text-center text-gray-500 py-2">{t.noMembers}</p>
          )}
        </div>
      </div>
    </div>
  );
};
