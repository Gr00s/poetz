import { ShapeVariant } from '../types';

interface Props {
  gesturesEnabled: boolean;
  onToggleGestures: () => void;
  onToggleMode: () => void;
  mode: 'formed' | 'chaos';
  shapeVariant: ShapeVariant;
  onCycleShape: () => void;
}

const shapeLabels: Record<ShapeVariant, string> = {
  'cloud': 'Wolk',
  'text': 'Tekst',
  'logo': 'Logo',
  'logo-filled': 'Gevuld'
};

const ControlPanel = ({ gesturesEnabled, onToggleGestures, onToggleMode, mode, shapeVariant, onCycleShape }: Props) => {
  return (
    <div className="absolute top-4 left-4 z-50 bg-[#007BA4]/70 backdrop-blur-md text-white rounded-xl px-3 py-2 flex flex-col gap-2 shadow-lg">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
          onClick={onToggleGestures}
          title="Handgebaren aan/uit"
        >
          <span>✋</span>
          <span>{gesturesEnabled ? 'Aan' : 'Uit'}</span>
        </button>
        <button
          className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-[#E85127]/80 hover:bg-[#E85127] transition"
          onClick={onToggleMode}
          title="Explode/Vorm"
        >
          <span>{mode === 'formed' ? '💥' : '🎄'}</span>
          <span>{mode === 'formed' ? 'Explode' : 'Form'}</span>
        </button>
      </div>
      <button
        className="flex items-center justify-center gap-1 text-xs px-2 py-1 rounded-lg bg-[#24B1A0]/80 hover:bg-[#24B1A0] transition"
        onClick={onCycleShape}
        title="Wissel vorm"
      >
        <span>🔄</span>
        <span>Vorm: {shapeLabels[shapeVariant]}</span>
      </button>
    </div>
  );
};

export default ControlPanel;



