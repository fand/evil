import { useRef, useEffect, useCallback, useState } from 'react';

interface KeyboardProps {
  numKeys: number;
  scale: number[];
  width: number;
  height: number;
  colors: string[];
  onNoteOn: (note: number) => void;
  onNoteOff: () => void;
  onSelectSample?: (sample: number) => void;
}

const KEY_HEIGHT = 26;

export function Keyboard({
  numKeys,
  scale,
  width,
  height,
  colors,
  onNoteOn,
  onNoteOff,
  onSelectSample,
}: KeyboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isClicked, setIsClicked] = useState(false);
  const [hoverPos, setHoverPos] = useState(-1);
  const [clickPos, setClickPos] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    ctxRef.current = canvas.getContext('2d');

    // Draw all keys
    for (let i = 0; i < numKeys; i++) {
      drawNormal(i);
    }
  }, [width, height, numKeys]);

  // Redraw when scale changes
  useEffect(() => {
    for (let i = 0; i < numKeys; i++) {
      drawNormal(i);
    }
  }, [scale, numKeys]);

  const getPos = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const rect = canvas.getBoundingClientRect();
    return Math.floor((e.clientY - rect.top) / KEY_HEIGHT);
  }, []);

  const getText = useCallback(
    (i: number) => {
      return ((numKeys - i - 1) % scale.length) + 1 + 'th';
    },
    [numKeys, scale.length]
  );

  const isKey = useCallback(
    (i: number) => {
      return (numKeys - i - 1) % scale.length === 0;
    },
    [numKeys, scale.length]
  );

  const clearNormal = useCallback(
    (i: number) => {
      const ctx = ctxRef.current;
      if (!ctx || i < 0) return;
      ctx.clearRect(0, i * KEY_HEIGHT, width, KEY_HEIGHT);
    },
    [width]
  );

  const drawNormal = useCallback(
    (i: number) => {
      const ctx = ctxRef.current;
      if (!ctx || i < 0) return;
      clearNormal(i);
      ctx.fillStyle = colors[0];
      if (isKey(i)) {
        ctx.fillRect(0, (i + 1) * KEY_HEIGHT - 5, width, 2);
      }
      ctx.fillRect(0, (i + 1) * KEY_HEIGHT - 3, width, 2);
      ctx.fillStyle = colors[3];
      ctx.fillText(getText(i), 10, (i + 1) * KEY_HEIGHT - 10);
    },
    [colors, isKey, getText, clearNormal, width]
  );

  const drawHover = useCallback(
    (i: number) => {
      const ctx = ctxRef.current;
      if (!ctx || i < 0) return;
      ctx.fillStyle = colors[1];
      ctx.fillRect(0, (i + 1) * KEY_HEIGHT - 3, width, 2);
      if (isKey(i)) {
        ctx.fillRect(0, (i + 1) * KEY_HEIGHT - 5, width, 2);
      }
      ctx.fillText(getText(i), 10, (i + 1) * KEY_HEIGHT - 10);
    },
    [colors, isKey, getText, width]
  );

  const drawActive = useCallback(
    (i: number) => {
      const ctx = ctxRef.current;
      if (!ctx || i < 0) return;
      clearNormal(i);
      ctx.fillStyle = colors[2];
      ctx.fillRect(0, i * KEY_HEIGHT, width, KEY_HEIGHT);
      ctx.fillStyle = colors[4];
      ctx.fillText(getText(i), 10, (i + 1) * KEY_HEIGHT - 10);
    },
    [colors, getText, clearNormal, width]
  );

  const clearActive = useCallback(
    (i: number) => {
      clearNormal(i);
      drawNormal(i);
    },
    [clearNormal, drawNormal]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pos = getPos(e);

      if (pos !== hoverPos) {
        drawNormal(hoverPos);
        drawHover(pos);
        setHoverPos(pos);
      }

      if (isClicked && clickPos !== pos) {
        clearActive(clickPos);
        drawActive(pos);
        onNoteOff();
        onNoteOn(numKeys - pos);
        setClickPos(pos);
      }
    },
    [
      hoverPos,
      isClicked,
      clickPos,
      numKeys,
      getPos,
      drawNormal,
      drawHover,
      clearActive,
      drawActive,
      onNoteOn,
      onNoteOff,
    ]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsClicked(true);
      const pos = getPos(e);
      const note = numKeys - pos;

      if (onSelectSample) {
        onSelectSample(note - 1);
      }

      drawActive(pos);
      onNoteOn(note);
      setClickPos(pos);
    },
    [numKeys, getPos, drawActive, onNoteOn, onSelectSample]
  );

  const handleMouseUp = useCallback(() => {
    setIsClicked(false);
    clearActive(clickPos);
    onNoteOff();
    setClickPos(-1);
  }, [clickPos, clearActive, onNoteOff]);

  const handleMouseOut = useCallback(() => {
    clearActive(hoverPos);
    onNoteOff();
    setHoverPos(-1);
    setClickPos(-1);
    setIsClicked(false);
  }, [hoverPos, clearActive, onNoteOff]);

  return (
    <canvas
      ref={canvasRef}
      className="keyboard"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
    />
  );
}

// Default colors for synth keyboard
export const SYNTH_KEYBOARD_COLORS = [
  'rgba(230, 230, 230, 1.0)',
  'rgba(  0, 220, 250, 0.7)',
  'rgba(100, 230, 255, 0.7)',
  'rgba(200, 200, 200, 1.0)',
  'rgba(255, 255, 255, 1.0)',
];

// Default colors for sampler keyboard
export const SAMPLER_KEYBOARD_COLORS = [
  'rgba(230, 230, 230, 1.0)',
  'rgba(250,  50, 230, 0.7)',
  'rgba(255, 100, 230, 0.7)',
  'rgba(200, 200, 200, 1.0)',
  'rgba(255, 255, 255, 1.0)',
];
