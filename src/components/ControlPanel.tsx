import { useState } from 'react';

interface Props {
  gesturesEnabled: boolean;
  onToggleGestures: () => void;
  onToggleMode: () => void;
  mode: 'formed' | 'chaos';
}

const ControlPanel = ({ gesturesEnabled, onToggleGestures, onToggleMode, mode }: Props) => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="absolute right-4 bottom-8 sm:bottom-8 z-50 flex flex-col sm:flex-row items-end gap-2 ios-safe-bottom">
      {/* Tooltip - boven op mobile, links op desktop */}
      {showTips && (
        <div className="bg-[#007BA4]/90 backdrop-blur-md text-white rounded-xl px-3 py-2 text-xs shadow-lg max-w-[200px] order-first sm:order-none mb-2 sm:mb-0">
          {gesturesEnabled ? (
            <>
              <p className="font-bold mb-1">Handgebaren:</p>
              <ul className="space-y-1">
                <li>✋ Open hand → Poetz logo</li>
                <li>👆 Wijzen → Draai boom</li>
                <li>✊ Vuist → Terug naar boom</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-bold mb-1">Bestuur met gebaren!</p>
              <p>Klik op "Aan" en gebruik je handen om de kerstboom te bedienen. Leuk en interactief!</p>
            </>
          )}
        </div>
      )}

      {/* Control buttons */}
      <div className="bg-[#24B1A0]/80 backdrop-blur-md text-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
        <button
          className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-[#007BA4]/60 hover:bg-[#007BA4] transition"
          onClick={onToggleGestures}
          onMouseEnter={() => setShowTips(true)}
          onMouseLeave={() => setShowTips(false)}
          title="Handgebaren aan/uit"
        >
          <span>✋</span>
          <span>{gesturesEnabled ? 'Uit' : 'Aan'}</span>
        </button>
        <button
          className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-[#E85127]/80 hover:bg-[#E85127] transition"
          onClick={onToggleMode}
          title="Poetz/Boom"
        >
          <span>{mode === 'formed' ? '☁️' : '🎄'}</span>
          <span>{mode === 'formed' ? 'Poetz' : 'Boom'}</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
