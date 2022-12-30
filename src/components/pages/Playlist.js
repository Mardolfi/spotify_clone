import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { HiOutlineUser, HiMusicNote } from 'react-icons/hi'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import { BsClock, BsFillCircleFill } from 'react-icons/bs'
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import styles from './Playlist.module.css'
import MusicInfo from "../project/MusicInfo";
import { FaHashtag, FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import loading from '../../img/loading.svg'

function Playlist() {
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState();
    const [isLogin, setIsLogin] = useState();
    const [down, setDown] = useState(true)
    const [down2, setDown2] = useState(true)
    const [activePlay, setActivePlay] = useState();
    const [isHeaderActive, setIsHeaderActive] = useState(false);
    const [playlist, setPlaylist] = useState();
    const [tracks, setTracks] = useState();
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [myPlaylist, setMyPlaylist] = useState();

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

    function playMusic() {
        const authorizationParams = getHashParams();

        const musicPlay = {
            "context_uri": playlist.uri,
            "offset": {
                "position": 0
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
                setActivePlay(true)
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
                setActivePlay(false)
            })
    }

    function headerActive(e) {
        const boudaries = e.target.children[1].getBoundingClientRect()

        if (boudaries.top <= -0) {
            setIsHeaderActive(true)
        } else {
            setIsHeaderActive(false)
        }
    }

    useEffect(() => {
        setLoadingVisible(true)

        const authorizationParams = getHashParams();

        fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPlaylist(data)

                if (data.tracks.total == 0) {
                    setTracks(false)
                } else {
                    setTracks(true)
                }

                setLoadingVisible(false);

                if (data.owner.display_name === name) {
                    setMyPlaylist(true)
                } else {
                    setMyPlaylist(false)
                }
            })
    }, [id])

    return (
        <>
            {isLogin &&
                <div className={styles.home_container}>
                    <div className={styles.home_content}>
                        <Header auth={getHashParams()} />
                        <div className={styles.home}>
                            <div className={`${styles.home_header} ${isHeaderActive ? styles.activeHeader : ''}`}>
                                <div className={styles.history_pages}>
                                    <div className={styles.back_page}>
                                        <IoChevronBackOutline onClick={() => navigate(-1)} />
                                    </div>
                                    <div className={styles.next_page}>
                                        <IoChevronForwardOutline onClick={() => navigate(+1)} />
                                    </div>
                                    {isHeaderActive && <><div className={`${styles.play2} ${activePlay ? styles.active : ''}`}>
                                        {activePlay ? <FaPauseCircle onClick={pauseMusic} /> : <FaPlayCircle onClick={playMusic} />}
                                    </div><div className={styles.header_playlist_name}><h1>{playlist?.name}</h1></div></>}
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
                            {loadingVisible ? <div className={styles.loading}><img src={loading} /></div> :
                                <div className={styles.home_musics} onScroll={headerActive}>
                                    <div className={styles.playlist_info}>
                                        <div className={styles.playlist_image}>
                                            {playlist?.images?.length > 0 ? <img src={playlist?.images[0].url} /> : <div className={styles.none_image}><HiMusicNote /></div>}
                                        </div>
                                        <div className={styles.playlist_names}>
                                            <h4>PLAYLIST</h4>
                                            <h1>{playlist?.name}</h1>
                                            <p>{playlist?.description}</p>
                                            <div className={styles.playlist_author}>
                                                <p>{playlist?.owner?.display_name}</p>
                                                <BsFillCircleFill />
                                                <p>{playlist?.followers?.total} curtidas</p>
                                                <BsFillCircleFill />
                                                <p>{playlist?.tracks?.total} musicas</p>
                                            </div>
                                        </div>
                                    </div>
                                    {tracks ? <div className={styles.playlist_musics}>
                                        <div className={styles.action_control}>
                                            <div className={`${styles.play} ${activePlay ? styles.active : ''}`}>
                                                {activePlay ? <FaPauseCircle onClick={pauseMusic} /> : <FaPlayCircle onClick={playMusic} />}
                                            </div>
                                            <div className={`${styles.accout_info2}`} onClick={() => setDown2(!down2)}>
                                                <div className={styles.down2}>
                                                    <SlOptions />
                                                </div>
                                                {!down2 &&
                                                    <div className={styles.account_control2}>
                                                        {myPlaylist ? <>
                                                            <div>
                                                                <p>Editar detalhes</p>
                                                            </div>
                                                            <div>
                                                                <p>Apagar</p>
                                                            </div>
                                                        </> :
                                                            <>
                                                                <div>
                                                                    <p>Adicionar à fila</p>
                                                                </div>
                                                                <div>
                                                                    <p>Denunciar</p>
                                                                </div>
                                                            </>
                                                        }

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.tabel}>
                                            <FaHashtag />
                                            <p>TÍTULO</p>
                                            <p>ÁLBUM</p>
                                            <BsClock />
                                        </div>
                                        {playlist?.tracks?.items.map((music, index) => (
                                            <MusicInfo music={music} handlePlay={playMusic} handlePause={pauseMusic} index={index} />
                                        ))}
                                    </div>
                                        :
                                        <>
                                            <div className={`${styles.accout_info3}`} onClick={() => setDown2(!down2)}>
                                                <div className={styles.down3}>
                                                    <SlOptions />
                                                </div>
                                                {!down2 &&
                                                    <div className={styles.account_control3}>
                                                        <div>
                                                            <p>Editar detalhes</p>
                                                        </div>
                                                        <div>
                                                            <p>Apagar</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className={styles.none_tracks}>
                                                <HiMusicNote />
                                                <h1>Adicione músicas para sua playlist!</h1>
                                                <button onClick={() => navigate(`/search/${location.hash}`)}>Procurar músicas</button>
                                            </div>
                                        </>}
                                </div>
                            }
                        </div>
                    </div>
                    <Footer auth={getHashParams()} />
                </div>
            }
        </>
    );
}

export default Playlist;