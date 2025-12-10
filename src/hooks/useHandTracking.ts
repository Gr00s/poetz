import { useCallback, useEffect, useRef, useState } from 'react';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { GestureType } from '../types';

interface HandTrackingConfig {
  onGesture?: (gesture: GestureType) => void;
  onPointMove?: (deltaX: number) => void;
  onHandPresenceChange?: (hasHand: boolean) => void;
  enabled: boolean;
  isMobile: boolean;
}

const gestureFromLandmarks = (results: Results, handedness: string): GestureType => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return 'none';
  const hand = results.multiHandLandmarks[0];
  const isExtended = (tip: number, pip: number) => hand[tip].y < hand[pip].y;

  // Thumb detection depends on handedness (selfie mode flips this)
  const isRightHand = handedness === 'Right';
  const thumbExtended = isRightHand ? hand[4].x > hand[3].x : hand[4].x < hand[3].x;

  const extended = {
    thumb: thumbExtended,
    index: isExtended(8, 6),
    middle: isExtended(12, 10),
    ring: isExtended(16, 14),
    pinky: isExtended(20, 18)
  };
  const extendedCount = Object.values(extended).filter(Boolean).length;
  const pinchDist = Math.hypot(hand[4].x - hand[8].x, hand[4].y - hand[8].y);

  if (pinchDist < 0.08 && extended.index && !extended.middle && !extended.ring && !extended.pinky) {
    return 'pinch';
  }
  if (extendedCount <= 1) return 'fist';
  if (extended.index && !extended.middle && !extended.ring && !extended.pinky) return 'point';
  if (extendedCount >= 4) return 'open';
  return 'none';
};

export const useHandTracking = ({
  onGesture,
  onPointMove,
  onHandPresenceChange,
  enabled,
  isMobile
}: HandTrackingConfig) => {
  const [gesture, setGesture] = useState<GestureType>('none');
  const [hasHand, setHasHand] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  // Use refs to avoid stale closures in handleResults
  const gestureRef = useRef<GestureType>('none');
  const onGestureRef = useRef(onGesture);
  const onPointMoveRef = useRef(onPointMove);
  const onHandPresenceChangeRef = useRef(onHandPresenceChange);

  // Keep refs in sync with props
  useEffect(() => {
    onGestureRef.current = onGesture;
    onPointMoveRef.current = onPointMove;
    onHandPresenceChangeRef.current = onHandPresenceChange;
  }, [onGesture, onPointMove, onHandPresenceChange]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    handsRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    handsRef.current = null;
    streamRef.current = null;
  }, []);

  const handleResults = useCallback(
    (results: Results) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && videoRef.current) {
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 0.6;
        ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 1;
        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#FFD700', lineWidth: 2 });
            drawLandmarks(ctx, landmarks, { color: '#FFF8E7', lineWidth: 1, radius: 2 });
          }
        }
        ctx.restore();
      }

      const foundHand = !!results.multiHandLandmarks?.length;
      setHasHand(foundHand);
      onHandPresenceChangeRef.current?.(foundHand);

      // Get handedness (default to Right if not available)
      const handedness = results.multiHandedness?.[0]?.label ?? 'Right';
      const detectedGesture = gestureFromLandmarks(results, handedness);

      if (detectedGesture !== gestureRef.current) {
        gestureRef.current = detectedGesture;
        setGesture(detectedGesture);
        onGestureRef.current?.(detectedGesture);
      }

      if (detectedGesture === 'point' && results.multiHandLandmarks?.[0]) {
        const idx = results.multiHandLandmarks[0][8];
        onPointMoveRef.current?.(idx.x - 0.5);
      }
    },
    []
  );

  const start = useCallback(async () => {
    try {
      // iOS-specific constraints
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: isMobile ? 240 : 320 },
          height: { ideal: isMobile ? 180 : 240 },
          frameRate: { ideal: 15, max: 15 },
          facingMode: 'user'
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // iOS requires these attributes
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;

        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          const video = videoRef.current!;
          if (video.readyState >= 2) {
            resolve();
          } else {
            video.onloadeddata = () => resolve();
          }
        });

        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video autoplay blocked, user interaction required', playErr);
        }
      }

      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        selfieMode: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
        modelComplexity: 0
      });
      hands.onResults(handleResults);

      // Initialize MediaPipe model (required before sending frames)
      await hands.initialize();
      handsRef.current = hands;

      // Use requestAnimationFrame instead of MediaPipe Camera utility (better iOS support)
      isRunningRef.current = true;
      let lastTime = 0;
      const targetInterval = 1000 / 15; // 15 FPS

      const processFrame = async (currentTime: number) => {
        if (!isRunningRef.current) return;

        const elapsed = currentTime - lastTime;
        if (elapsed >= targetInterval) {
          lastTime = currentTime;

          if (videoRef.current && handsRef.current && videoRef.current.readyState >= 2) {
            try {
              await handsRef.current.send({ image: videoRef.current });
            } catch (err) {
              // Ignore frame processing errors
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(processFrame);
      };

      animationFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('Camera start failed', err);
      setHasCameraPermission(false);
    }
  }, [handleResults, isMobile]);

  useEffect(() => {
    if (!enabled) {
      stop();
      setGesture('none');
      setHasHand(false);
      return;
    }
    start();
    return () => stop();
  }, [enabled, start, stop]);

  return {
    gesture,
    hasHand,
    hasCameraPermission,
    start,
    stop,
    videoRef,
    canvasRef
  };
};



