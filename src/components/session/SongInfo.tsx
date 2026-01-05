import { useCallback } from 'react';
import type { Song } from '../../Song';
import styles from './SongInfo.module.css';

interface SongInfoProps {
  song: Song;
  onTitleChange: (title: string) => void;
  onCreatorChange: (creator: string) => void;
}

export function SongInfo({
  song,
  onTitleChange,
  onCreatorChange,
}: SongInfoProps) {
  const handleFocus = useCallback(() => {
    window.keyboard?.beginInput();
  }, []);

  const handleBlur = useCallback(() => {
    window.keyboard?.endInput();
  }, []);

  return (
    <div className={styles.songInfo}>
      <div>
        <label>title: </label>
        <input
          type="text"
          value={song.title || ''}
          onChange={(e) => onTitleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      <div>
        <label>by: </label>
        <input
          type="text"
          value={song.creator || ''}
          onChange={(e) => onCreatorChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
