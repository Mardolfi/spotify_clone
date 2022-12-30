import styles from './Login.module.css'
import icon from '../../img/spotify1.png'

function Login() {
    return ( 
        <div className={styles.login_container}>
            <div className={styles.title}>
                <img src={icon} alt={'spotify icon'}/>
                <h1>Spotify</h1>
            </div>
            <div className={styles.login_content}>
                <h3>Para continuar logue-se com Spotify</h3>
                <a href='http://localhost:8888/login'>Login com Spotify</a>
            </div>
        </div>
    );
}

export default Login;