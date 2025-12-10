export type DisplayMode = 'formed' | 'chaos';

export type GestureType = 'none' | 'point' | 'open' | 'pinch' | 'fist';

export interface HandTrackingState {
  enabled: boolean;
  gesture: GestureType;
  hasCameraPermission: boolean;
  hasHand: boolean;
  start: () => Promise<void>;
  stop: () => void;
}



