import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CategoryCard.module.css'

function CategoryCard( { music} ) {
    const navigate = useNavigate();
    const location = useLocation();

    function seePlaylist() {
        navigate(`/categories/${music.id}${location.hash}`)
    }

    return ( 
        <div className={styles.category_container} onClick={seePlaylist}>
            <div className={styles.category_img}>
                <img src={music.icons[0].url}/>
            </div>
            <div className={styles.category_title}>
                <h3>{music.name}</h3>
            </div>
        </div>
    );
}

export default CategoryCard;