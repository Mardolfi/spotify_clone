import styles from './MusicInfo.module.css'
import { useEffect, useState } from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

function MusicInfo({ music, index }) {

    const navigate = useNavigate()
    const location = useLocation()

    const [activePlay, setActivePlay] = useState();
    const [secondsDuration, setSecondsDuration] = useState();
    const [minutesDuration, setMinutesDuration] = useState();

    useEffect(() => {
        const minutesDurationData = Math.floor(music.track.duration_ms / 60000)
        const secondsDurationData = Math.floor(music.track.duration_ms % 60000)

        setMinutesDuration(minutesDurationData)

        if (String(secondsDurationData).length === 5) {
            setSecondsDuration(String(secondsDurationData).slice(0, 2))
        } else {
            setSecondsDuration(String(secondsDurationData).slice(0, 1))
        }
    }, [])

    function seePlaylist() {
        navigate(`/album/${music.track.album.id}${location.hash}`)
    }

    return (
        <div className={styles.music_container}>
            <div className={styles.music_index}>
                <p>{index + 1}</p>
            </div>
            <div className={styles.music_img}>
                <img src={music.track.album.images[0].url} />
            </div>
            <div className={styles.music_title}>
                <h3 onClick={seePlaylist}>{music.track.name}</h3>
                <div className={styles.music_author}>
                    <p>{music.track.artists.map((artist) => <>{artist.name + ' '}</>)}</p>
                </div>
            </div>
            <div className={styles.album_name}>
                {/* <p>{music.track.album.name}</p> */}
            </div>
            <div className={styles.mins}>
                <p>{minutesDuration}:{secondsDuration}</p>
            </div>
        </div>
    );
}

export default MusicInfo;