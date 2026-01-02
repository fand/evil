import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';

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

  const handleStop = () => {
    controller.stop();
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
        id="control-play"
        className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`}
        onMouseDown={handlePlayPause}
      />
      <i
        id="control-forward"
        className="fa fa-forward"
        onMouseDown={handleForward}
      />
      <i
        id="control-backward"
        className="fa fa-backward"
        onMouseDown={handleBackward}
      />
      <i
        id="control-loop"
        className={`fa fa-repeat ${isLoop ? 'control-on' : 'control-off'}`}
        onMouseDown={handleToggleLoop}
      />
    </>
  );
}
