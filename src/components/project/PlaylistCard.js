import styles from './PlaylistCard.module.css'
import { HiMusicNote } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';

function PlaylistCard( { music } ) {
    const navigate = useNavigate();
    const location = useLocation();

    function seePlaylist() {
        navigate(`/playlist/${music.id}${location.hash}`)
    }

    return ( 
        <div className={styles.playlist_container} onClick={seePlaylist}>
            <div className={styles.playlist_img}>
                {music.images.length > 0 ? <img src={music.images[0].url}/> : <div className={styles.none_image}><HiMusicNote /></div>}
            </div>
            <div className={styles.playlist_title}>
                <h3>{music.name}</h3>
            </div>
            <div className={styles.playlist_author}>
                <p>{music.description || 'De ' + music.owner.display_name}</p>
            </div>
        </div>
    );
}

export default PlaylistCard;