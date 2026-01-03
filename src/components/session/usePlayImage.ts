import { useState, useEffect } from 'react';

/**
 * Hook to load the play button image
 */
export function usePlayImage(): HTMLImageElement | null {
  const [imgPlay, setImgPlay] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    const imgPath = import.meta.env.BASE_URL + 'img/play.png';
    img.src = imgPath;
    img.onload = () => {
      setImgPlay(img);
    };
    img.onerror = (e) => {
      console.error('usePlayImage: failed to load', imgPath, e);
    };
  }, []);

  return imgPlay;
}
