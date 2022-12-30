import styles from './MusicCard.module.css'
import { useEffect, useState } from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

function MusicCard( { music, handlePlay, handlePause } ) {
    const navigate = useNavigate()
    const location = useLocation();

    const [activePlay, setActivePlay] = useState();

    function playMusic(){
        setActivePlay(true);
        handlePlay(music)
    }

    function pauseMusic(){
        setActivePlay(false);
        handlePause(music);
    }

    function seePlaylist() {
        console.log(music)
        navigate(`/album/${music.track.album.id}${location.hash}`)
    }

    return ( 
        <div className={styles.music_container} onClick={seePlaylist}>
            <div className={styles.music_img}>
                <img src={music.track.album.images[0].url}/>
            </div>
            <div className={styles.music_title}>
                <h3>{music.track.name}</h3>
            </div>
            <div className={styles.music_author}>
                <p>{music.track.artists[0].name}</p>
            </div>
            <div className={`${styles.play} ${activePlay ? styles.active : ''}`}>
                {activePlay ? <FaPauseCircle onClick={pauseMusic}/> : <FaPlayCircle onClick={playMusic}/>}
            </div>
        </div>
    );
}

export default MusicCard;