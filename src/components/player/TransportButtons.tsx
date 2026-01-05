import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';
import styles from './TransportButtons.module.css';

/**
 * Transport control buttons: Play/Pause, Stop, Forward, Backward, Loop
 */
export function TransportButtons() {
  const isPlaying = useAppStore((state) => state.playback.isPlaying);
  const isLoop = useAppStore((state) => state.playback.isLoop);

  const handlePlayPause = () => {
    if (isPlaying) {
      controller.pause();
    } else {
      controller.play();
    }
  };

  const handleForward = () => {
    controller.forward();
  };

  const handleBackward = () => {
    controller.backward(false);
  };

  const handleToggleLoop = () => {
    controller.toggleLoop();
  };

  return (
    <>
      <i
        className={`${styles.play} fa ${isPlaying ? 'fa-pause' : 'fa-play'}`}
        onMouseDown={handlePlayPause}
      />
      <i
        className={`${styles.forward} fa fa-forward`}
        onMouseDown={handleForward}
      />
      <i
        className={`${styles.backward} fa fa-backward`}
        onMouseDown={handleBackward}
      />
      <i
        className={`${styles.loop} fa fa-repeat ${isLoop ? styles.controlOn : styles.controlOff}`}
        onMouseDown={handleToggleLoop}
      />
    </>
  );
}
