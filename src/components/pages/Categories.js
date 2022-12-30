import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { HiOutlineUser, HiMusicNote } from 'react-icons/hi'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import { BsClock, BsFillCircleFill } from 'react-icons/bs'
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import styles from './Categories.module.css'
import MusicInfo from "../project/MusicInfo";
import { FaHashtag, FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import loading from '../../img/loading.svg'
import PlaylistCard from "../project/PlaylistCard";

function Categories() {
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState();
    const [isLogin, setIsLogin] = useState();
    const [down, setDown] = useState(true)
    const [down2, setDown2] = useState(true)
    const [playlists, setPlaylists] = useState();
    const [isHeaderActive, setIsHeaderActive] = useState(false);
    const [category, setCategory] = useState();
    const [loadingVisible, setLoadingVisible] = useState(false);

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

    useEffect(() => {
        setLoadingVisible(true)

        const authorizationParams = getHashParams();

        fetch(`https://api.spotify.com/v1/browse/categories/${id}/playlists`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPlaylists(data.playlists.items)
                setLoadingVisible(false);
                console.log(data)
            })
    }, [id])

    useEffect(() => {
        setLoadingVisible(true)

        const authorizationParams = getHashParams();

        fetch(`https://api.spotify.com/v1/browse/categories/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setCategory(data)
                setLoadingVisible(false);
                console.log(data)
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
                                    {isHeaderActive && <><div className={styles.header_playlist_name}><h1>{category?.name}</h1></div></>}
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
                                        <div className={styles.playlist_names}>
                                            <h1>{category?.name}</h1>
                                        </div>
                                    </div>
                                    <div className={styles.playlist_musics}>
                                        {playlists?.map((music, index) => (
                                            <PlaylistCard music={music} index={index} />
                                        ))}
                                    </div>
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

export default Categories;