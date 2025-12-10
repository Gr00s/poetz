import { GestureType } from '../types';

interface Props {
  enabled: boolean;
  gesture: GestureType;
  hasHand: boolean;
  hasPermission: boolean;
  onRequestCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  hiddenOnTiny: boolean;
}

const HandOverlay = ({
  enabled,
  gesture,
  hasHand,
  hasPermission,
  onRequestCamera,
  videoRef,
  canvasRef,
  hiddenOnTiny
}: Props) => {
  // Always render video element so ref is available for camera initialization
  // When permission granted and enabled, show it visible; otherwise keep hidden
  const showOverlay = enabled && !hiddenOnTiny;
  const showVideo = hasPermission && showOverlay;

  return (
    <>
      {/* Video element - positioned off-screen for iOS (can't use display:none) */}
      <video
        ref={videoRef}
        className="absolute w-1 h-1 opacity-0 pointer-events-none"
        style={{ top: '-9999px', left: '-9999px' }}
        muted
        playsInline
        autoPlay
        webkit-playsinline="true"
      />

      {showOverlay && (
        <div className="absolute right-4 bottom-20 sm:bottom-20 w-[160px] max-w-[40vw] h-[120px] rounded-xl border border-white/20 bg-black/35 backdrop-blur-md overflow-hidden shadow-lg ios-safe-bottom-overlay">
          {!hasPermission ? (
            <button
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/80 hover:text-white"
              onClick={onRequestCamera}
            >
              <span className="text-2xl">📷</span>
              <span className="text-xs">Klik voor camera</span>
            </button>
          ) : (
            <div className="relative w-full h-full">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" width={320} height={240} />
              <div className="absolute bottom-1 right-1 text-[11px] bg-black/50 rounded px-2 py-1 flex items-center gap-1 text-white">
                <span>{hasHand ? '🖐️' : '...'}</span>
                <span>{gesture}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HandOverlay;



