import { useState, useEffect } from 'react';

/**
 * Hook to load the play button image
 */
export function usePlayImage(): HTMLImageElement | null {
  const [imgPlay, setImgPlay] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + 'img/play.png';
    img.onload = () => setImgPlay(img);
  }, []);

  return imgPlay;
}
