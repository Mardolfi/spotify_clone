import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { HiOutlineUser } from 'react-icons/hi'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import styles from './Search.module.css'
import Header from '../layout/Header';
import Footer from "../layout/Footer";
import CategoryCard from '../project/CategoryCard';
import { RiSearchLine } from 'react-icons/ri';
import SearchCard from '../project/SearchCard';
import loading from '../../img/loading.svg'

function Search() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState();
    const [name, setName] = useState();
    const [isHeaderActive, setIsHeaderActive] = useState(false);
    const [categoryPlayeds, setCategoryPlayeds] = useState();

    const [down, setDown] = useState(true)

    const [searchQuery, setSearchQuery] = useState();
    const [search, setSearch] = useState();

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
        const authorizationParams = getHashParams();

        fetch('https://api.spotify.com/v1/browse/categories?country=BR&limit=40', {
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

    function searchMusics(e) {

        setLoadingVisible(true);

        if (e.target.value === '') {
            setSearchQuery(false)
            setLoadingVisible(false);
            return;
        } else {
            setSearch(e.target.value)
        }

        const authorizationParams = getHashParams();

        fetch(`https://api.spotify.com/v1/search?q=${e.target.value}&type=track&limit=20`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authorizationParams.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setSearchQuery(data.tracks.items)
                setLoadingVisible(false)
            })
    }

    return (
        <>
            {isLogin &&
                <div className={styles.search_container}>
                    <div className={styles.search_content}>
                        <Header auth={getHashParams()}/>
                        <div className={styles.search}>
                            <div className={`${styles.search_header} ${isHeaderActive ? styles.activeHeader : ''}`}>
                                <div className={styles.header_content}>
                                    <div className={styles.history_pages}>
                                        <div className={styles.back_page}>
                                            <IoChevronBackOutline onClick={() => navigate(-1)} />
                                        </div>
                                        <div className={styles.next_page}>
                                            <IoChevronForwardOutline onClick={() => navigate(+1)} />
                                        </div>
                                    </div>
                                    <div className={styles.search_music}>
                                        <RiSearchLine />
                                        <input type={'text'} placeholder={'O que você quer ouvir?'} onChange={searchMusics} />
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
                            <div className={styles.search_page_musics} onScroll={headerActive}>
                                {searchQuery ?
                                    <>
                                        <div className={styles.search_title}>
                                            <h2>Resultados para <span>{search}</span></h2>
                                        </div>
                                        <div className={`${styles.search_musics} ${loadingVisible ? styles.loadingActive : ''}`}>
                                            {loadingVisible ? <img src={loading} /> : <>{searchQuery.map((music) => (
                                                <SearchCard music={music} handlePlay={playMusic} handlePause={pauseMusic} />
                                            ))}</>}
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={styles.category_title}>
                                            <h2>Navegar por todas as sessões</h2>
                                        </div>
                                        <div className={`${styles.category_musics} ${loadingVisible ? styles.loadingActive : ''}`}>
                                            {loadingVisible ? <img src={loading}/> : <>{categoryPlayeds?.map((music) => (
                                                <CategoryCard music={music} handlePlay={playMusic} handlePause={pauseMusic} />
                                            ))}</>}
                                        </div>
                                    </>}
                            </div>
                        </div>
                    </div>
                    <Footer auth={getHashParams()} />
                </div>
            }
        </>
    );
}

export default Search;