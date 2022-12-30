import styles from './MusicInfo.module.css'
import { useEffect, useState } from 'react';

function SingleInfo({ music, index, album }) {

    const [activePlay, setActivePlay] = useState();
    const [secondsDuration, setSecondsDuration] = useState();
    const [minutesDuration, setMinutesDuration] = useState();

    useEffect(() => {
        const minutesDurationData = Math.floor(music.duration_ms / 60000)
        const secondsDurationData = Math.floor(music.duration_ms % 60000)

        setMinutesDuration(minutesDurationData)

        if (String(secondsDurationData).length === 5) {
            setSecondsDuration(String(secondsDurationData).slice(0, 2))
        } else {
            setSecondsDuration(String(secondsDurationData).slice(0, 1))
        }
    }, [])

    console.log(album)

    return (
        <div className={styles.music_container}>
            <div className={styles.music_index}>
                <p>{index + 1}</p>
            </div>
            <div className={styles.music_img}>
                <img src={album.images[0].url} />
            </div>
            <div className={styles.music_title}>
                <h3>{music.name}</h3>
                <div className={styles.music_author}>
                    <p>{music.artists.map((artist) => <>{artist.name + ' '}</>)}</p>
                </div>
            </div>
            <div className={styles.album_name}>
                <p>{album.name}</p>
            </div>
            <div className={styles.mins}>
                <p>{minutesDuration}:{secondsDuration}</p>
            </div>
        </div>
    );
}

export default SingleInfo;