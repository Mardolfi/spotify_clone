import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { HiMusicNote, HiOutlineUser } from 'react-icons/hi'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import styles from './YourLibrary.module.css'
import Header from '../layout/Header';
import Footer from "../layout/Footer";
import loading from '../../img/loading.svg'
import PlaylistCard from '../project/PlaylistCard'

function YourLibrary() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState();
    const [name, setName] = useState();
    const [isHeaderActive, setIsHeaderActive] = useState(false);

    const [down, setDown] = useState(true)

    const [loadingVisible, setLoadingVisible] = useState(false);

    const [playlists, setPlaylists] = useState();

    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    useEffect(() => {

        const authorizationParams = getHashParams();

        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => {
                if (res.status !== 200) {
                    navigate('/login');
                    setIsLogin(false);
                    return false;
                } else {
                    setIsLogin(true)
                }

                return res.json();
            })
            .then((data) => {
                setName(data.display_name);
            })
            .catch((err) => console.log(err))
    }, [])

    function headerActive(e) {
        const boudaries = e.target.children[1].getBoundingClientRect()

        if (boudaries.top <= -0) {
            setIsHeaderActive(true)
        } else {
            setIsHeaderActive(false)
        }
    }

    function playMusic(music) {
        const authorizationParams = getHashParams();

        const musicPlay = {
            "context_uri": music.context.uri,
            "offset": {
                "position": music.track.track_number
            },
            "position_ms": 0
        }

        fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            },
            body: JSON.stringify(musicPlay),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
    }

    function pauseMusic() {
        const authorizationParams = getHashParams();

        fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
    }

    useEffect(() => {
        setLoadingVisible(true)

        const authorizationParams = getHashParams();

        fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then(res => res.json())
            .then((data) => {
                setLoadingVisible(false)
                if (data.total == 0) {
                    setPlaylists(false)
                } else {
                    setPlaylists(data.items)
                }

                console.log(data)
            })
    }, [])

    return (
        <>
            {isLogin &&
                <div className={styles.yourlibrary_container}>
                    <div className={styles.yourlibrary_content}>
                        <Header auth={getHashParams()}/>
                        <div className={styles.yourlibrary}>
                            <div className={`${styles.yourlibrary_header} ${isHeaderActive ? styles.activeHeader : ''}`}>
                                <div className={styles.header_content}>
                                    <div className={styles.history_pages}>
                                        <div className={styles.back_page}>
                                            <IoChevronBackOutline onClick={() => navigate(-1)} />
                                        </div>
                                        <div className={styles.next_page}>
                                            <IoChevronForwardOutline onClick={() => navigate(+1)} />
                                        </div>
                                    </div>
                                    <div className={styles.playlists}>
                                        <h2>Playlists</h2>
                                    </div>
                                </div>
                                <div className={`${styles.accout_info} ${!down ? styles.active : ''}`} onClick={() => setDown(!down)}>
                                    <div className={styles.avatar}>
                                        <HiOutlineUser />
                                    </div>
                                    <div className={styles.user_name}>
                                        <p>{name}</p>
                                    </div>
                                    <div className={styles.down}>
                                        {down ? <AiFillCaretDown /> : <AiFillCaretUp />}
                                    </div>
                                    {!down &&
                                        <div className={styles.account_control}>
                                            <div>
                                                <p>Conta</p>
                                                <FiExternalLink />
                                            </div>
                                            <div>
                                                <p>Sair</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={styles.yourlibrary_musics}>
                                {loadingVisible ? <img src={loading} /> :
                                    <>
                                        {playlists ?
                                            <>
                                                <div className={styles.playlist_title}>
                                                    <h2>Playlists</h2>
                                                </div>
                                                <div className={styles.playlists_playlists}>
                                                    {playlists.map((playlist) => (
                                                        <PlaylistCard music={playlist} handlePlay={playMusic} handlePause={pauseMusic} />
                                                    ))}
                                                </div>
                                            </>
                                            :
                                            <div className={styles.none_playlist}>
                                                <HiMusicNote />
                                                <h1>Crie sua primeira playlist</h1>
                                                <p>É facil, vamos te ajudar</p>
                                                <button>Criar Playlist</button>
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <Footer auth={getHashParams()} />
                </div>
            }
        </>
    );
}

export default YourLibrary;