import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { HiOutlineUser } from 'react-icons/hi'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import styles from './Home.module.css'
import MusicCard from "../project/MusicCard";
import PlaylistCard from "../project/PlaylistCard";
import CategoryCard from "../project/CategoryCard";

function Home() {
    const navigate = useNavigate();

    const [name, setName] = useState();
    const [isLogin, setIsLogin] = useState();
    const [down, setDown] = useState(true)

    const [recentlyPlayeds, setRecentlyPlayeds] = useState();
    const [featuredPlayeds, setFeaturedPlayeds] = useState();
    const [categoryPlayeds, setCategoryPlayeds] = useState();

    const [isHeaderActive, setIsHeaderActive] = useState(false);

    useEffect(() => {
        const authorizationParams = getHashParams();

        fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setRecentlyPlayeds(data.items))
    }, [])

    useEffect(() => {
        const authorizationParams = getHashParams();

        fetch('https://api.spotify.com/v1/browse/categories?country=BR&limit=5', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setCategoryPlayeds(data.categories.items)
            })
    }, [])

    useEffect(() => {
        const authorizationParams = getHashParams();

        fetch('https://api.spotify.com/v1/browse/featured-playlists?country=BR&limit=5', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setFeaturedPlayeds(data.playlists.items)
            })
    }, [])

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

    function playMusic( music ) {
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

        fetch('https://api.spotify.com/v1/me/player/pause' ,{
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

    function headerActive (e) {
        const boudaries = e.target.children[1].getBoundingClientRect()

        if(boudaries.top <= -0){
            setIsHeaderActive(true)
        } else {
            setIsHeaderActive(false)
        }
    }

    return (
        <>
            {isLogin &&
                <div className={styles.home_container}>
                    <div className={styles.home_content}>
                        <Header auth={getHashParams()}/>
                        <div className={styles.home}>
                            <div className={`${styles.home_header} ${isHeaderActive ? styles.activeHeader : ''}`}>
                                <div className={styles.history_pages}>
                                    <div className={styles.back_page}>
                                        <IoChevronBackOutline onClick={() => navigate(-1)} />
                                    </div>
                                    <div className={styles.next_page}>
                                        <IoChevronForwardOutline onClick={() => navigate(+1)} />
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
                            <div className={styles.home_musics} onScroll={headerActive}>
                                <div className={styles.recently_title}>
                                    <h2>Tocados recentemente</h2>
                                </div>
                                <div className={styles.recently_musics}>
                                    {recentlyPlayeds && recentlyPlayeds.map((music) => (
                                        <MusicCard music={music} key={music.track.id} handlePlay={playMusic} handlePause={pauseMusic}/>
                                    ))}
                                </div>
                                <div className={styles.featured_title}>
                                    <h2>Destaques</h2>
                                </div>
                                <div className={styles.featured_musics}>
                                    {featuredPlayeds && featuredPlayeds.map((music) => (
                                        <PlaylistCard music={music} key={music.id}/>
                                    ))}
                                </div>
                                <div className={styles.category_title}>
                                    <h2>Categorias</h2>
                                </div>
                                <div className={styles.category_musics}>
                                    {categoryPlayeds && categoryPlayeds.map((music) => (
                                        <CategoryCard music={music} key={music.id} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer auth={getHashParams()}/>
                </div>
            }
        </>
    );
}

export default Home;