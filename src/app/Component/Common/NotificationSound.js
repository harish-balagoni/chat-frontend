import Sound from 'react-sound';
import Notification from '../../../assests/Notification.mp3';

const NotificationSound = (
  handleSongLoading,
  handleSongPlaying,
  handleSongFinishedPlaying
) => {

  return (
    <div>
      <Sound
        url={Notification}
        playStatus={Sound.status.PLAYING}  
        playFromPosition={300}
        onLoading={handleSongLoading}
        onPlaying={handleSongPlaying}
        onFinishedPlaying={handleSongFinishedPlaying}
      />
    </div>
  );
};
export default NotificationSound;