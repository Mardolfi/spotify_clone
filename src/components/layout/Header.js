import styles from './Header.module.css'
import { AiOutlineHome } from 'react-icons/ai'
import { RiSearchLine } from 'react-icons/ri'
import { VscLibrary } from 'react-icons/vsc'
import { FaSpotify } from 'react-icons/fa'
import { MdAddBox } from 'react-icons/md'
import { BiHeartSquare } from 'react-icons/bi'
import CustomLink from '../project/CustomLink';
import { useEffect, useState } from 'react'

function Header({ auth }) {

    const [playlists, setPlaylists] = useState([]);
    const [userId, setUserId] = useState();

    useEffect(() => {
        fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            }
        })
            .then(res => res.json())
            .then((data) => {
                if (data.total == 0) {
                    setPlaylists(false)
                } else {
                    setPlaylists(data.items)
                }
            })
    }, [])

    useEffect(() => {
        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.access_token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setUserId(data.id);
            })
            .catch((err) => console.log(err))
    }, [])

    function createPlaylist() {
        let nameOfPlaylist = playlists[playlists.length - 1]?.name
        nameOfPlaylist = String(nameOfPlaylist).split('º')
        nameOfPlaylist = nameOfPlaylist[1].trim();

        const newPlaylist = {
            "name": `Minha playlist nº ${Number(nameOfPlaylist) + 1}`,
            "description": 'New playlist',
            "public": false,
        }

        console.log(newPlaylist)

        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.access_token}`
            },
            body: JSON.stringify(newPlaylist)
        })
        .then((res) => res.json())
        .then((data) => console.log(data))
    }

    return (
        <div className={styles.header_container}>
            <div className={styles.icon}>
                <CustomLink to={'/'}>
                    <FaSpotify />
                    <h2>Spotify</h2>
                </CustomLink>
            </div>
            <div className={styles.action_control}>
                <CustomLink to={'/'}>
                    <AiOutlineHome />
                    <p>Início</p>
                </CustomLink>
                <CustomLink to={'/search/'}>
                    <RiSearchLine />
                    <p>Buscar</p>
                </CustomLink>
                <CustomLink to={'/yourlibrary/'}>
                    <VscLibrary />
                    <p>Sua Biblioteca</p>
                </CustomLink>
            </div>
            <div className={styles.playlist_control}>
                <button onClick={createPlaylist}>
                    <MdAddBox />
                    <p>Criar playlist</p>
                </button>
                <div>
                    <BiHeartSquare />
                    <p>Músicas Curtidas</p>
                </div>
            </div>
            <div className={styles.playlists_name}>
                {playlists.length > 0 && playlists.map((playlist) => (
                    <div key={playlist.id}>
                        <CustomLink to={`playlist/${playlist.id}`}>
                            <p>{playlist.name}</p>
                        </CustomLink>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Header;