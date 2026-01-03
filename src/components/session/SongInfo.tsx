import { useCallback } from 'react';
import type { Song } from '../../Song';

interface SongInfoProps {
  song: Song;
  onTitleChange: (title: string) => void;
  onCreatorChange: (creator: string) => void;
}

export function SongInfo({ song, onTitleChange, onCreatorChange }: SongInfoProps) {
  const handleFocus = useCallback(() => {
    window.keyboard?.beginInput();
  }, []);

  const handleBlur = useCallback(() => {
    window.keyboard?.endInput();
  }, []);

  return (
    <div id="song-info">
      <div>
        <label>title: </label>
        <input
          type="text"
          id="song-title"
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
          id="song-creator"
          value={song.creator || ''}
          onChange={(e) => onCreatorChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
