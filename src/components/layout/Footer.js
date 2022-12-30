import styles from './Footer.module.css'
import { AiOutlineHeart, AiFillStepBackward, AiFillStepForward, AiFillHeart } from 'react-icons/ai'
import { SlLoop } from 'react-icons/sl'
import { FaRandom, FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { useEffect, useState } from 'react'

function Footer({ auth }) {

    const [activePlay, setActivePlay] = useState(false);
    const [randomPlay, setRandomPlay] = useState(false);
    const [loopPlay, setLoopPlay] = useState(false);
    const [liked, setLiked] = useState(false);
    const [muted, setMuted] = useState(false);
    const [music, setMusic] = useState();

    const [secondsDuration, setSecondsDuration] = useState();
    const [minutesDuration, setMinutesDuration] = useState();

    const [secondsCurrent, setSecondsCurrent] = useState();
    const [minutesCurrent, setMinutesCurrent] = useState();

    const [maxTime, setMaxTime] = useState();
    const [progressTime, setProgressTime] = useState();

    function changeVolume(volume) {
        fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    function nextMusic() {
        fetch(`	https://api.spotify.com/v1/me/player/next`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    function backMusic() {
        fetch(`	https://api.spotify.com/v1/me/player/previous`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    function playMusic() {
        const musicPlay = {
            "context_uri": music.context_uri,
            "offset": {
                "position": music.position,
            },
            "position_ms": 0
        }

        fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            },
            body: JSON.stringify(musicPlay),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setActivePlay(true);
            })
    }

    useEffect(() => {
        setInterval(() => {
            fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.access_token}`
                }
            })
                .then((res) => {
                    if (res.status !== 200) {
                        return false;
                    }

                    return res.json();
                })
                .then((data) => {
                    if (data.is_playing == true) {
                        setActivePlay(true)
                    } else {
                        setActivePlay(false)
                    }

                    const musicData = {
                        name: data?.item?.name,
                        img: data?.item?.album.images[0].url,
                        author: data?.item?.artists[0].name,
                        context_uri: data?.context?.uri,
                        position: data?.item?.track_number
                    }

                    if (!musicData.name) {
                        setMusic(false)
                    } else {
                        setMusic(musicData)
                    }

                    const minutesDurationData = Math.floor(data?.item?.duration_ms / 60000)
                    const secondsDurationData = Math.floor(data?.item?.duration_ms % 60000)

                    setMinutesDuration(minutesDurationData)

                    if (String(secondsDurationData).length === 5) {
                        setSecondsDuration(String(secondsDurationData).slice(0, 2))
                    } else {
                        setSecondsDuration(String(secondsDurationData).slice(0, 1))
                    }

                    const minutesCurrentData = Math.floor(data?.progress_ms / 60000)
                    const secondsCurrentData = Math.floor(data?.progress_ms % 60000)

                    setMinutesCurrent(minutesCurrentData)

                    if (String(secondsCurrentData).length === 5) {
                        setSecondsCurrent(String(secondsCurrentData).slice(0, 2))
                    } else {
                        setSecondsCurrent(String(secondsCurrentData).slice(0, 1))
                    }

                    setMaxTime(data?.item?.duration_ms)

                    setProgressTime(data?.progress_ms)

                })
                .catch((err) => console.log(err))
        }, 1000)
    }, [])

    function pauseMusic() {
        fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setActivePlay(false)
            })
    }

    function setShuffleMode() {
        fetch('https://api.spotify.com/v1/me/player/shuffle', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                setRandomPlay(!randomPlay)
            })
            .catch((err) => console.log(err))
    }

    function setRepeatMode() {
        fetch('https://api.spotify.com/v1/me/player/repeat', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                setLoopPlay(!loopPlay)
            })
            .catch((err) => console.log(err))
    }

    return (
        <>
            <div className={styles.footer_container}>
                {music &&
                    <>
                        <div className={styles.music_info}>
                            <div className={styles.music_img}>
                                <img src={music?.img} />
                            </div>
                            <div className={styles.music_info_names}>
                                <div className={styles.music_name}>
                                    <h4>{music?.name}</h4>
                                </div>
                                <div className={styles.music_author}>
                                    <p>{music?.author}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.like}>
                            {liked ? <AiFillHeart onClick={() => setLiked(false)} /> : <AiOutlineHeart onClick={() => setLiked(true)} />}
                        </div>
                        <div className={styles.action_control}>
                            <div className={styles.play_pause}>
                                <FaRandom onClick={setShuffleMode} className={randomPlay ? styles.active : ''} />
                                <AiFillStepBackward onClick={backMusic} />
                                {activePlay ? <FaPauseCircle onClick={pauseMusic} /> : <FaPlayCircle onClick={playMusic} />}
                                <AiFillStepForward onClick={nextMusic} />
                                <SlLoop onClick={setRepeatMode} className={loopPlay ? styles.active : ''} />
                            </div>
                            <div className={styles.music_bar}>
                                <p>{minutesCurrent}:{secondsCurrent}</p>
                                <input type={'range'} max={maxTime} value={progressTime} className={styles.bar} />
                                <p>{minutesDuration}:{secondsDuration}</p>
                            </div>
                        </div>
                        <div className={styles.volume}>
                            {muted ? <HiVolumeOff onClick={() => setMuted(false)} /> : <HiVolumeUp onClick={() => setMuted(true)} />}
                            <input type={'range'} max={100} defaultValue={100} className={styles.bar} onChange={(e) => changeVolume(e.target.value)} />
                        </div>
                    </>
                }
            </div>
        </>
    );
}

export default Footer;