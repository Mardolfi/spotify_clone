import { Link, useLocation, useMatch, useResolvedPath } from "react-router-dom";
import styles from './CustomLink.module.css'

function CustomLink(props) {
    const location = useLocation();
    const resolvedPath = useResolvedPath(props.to)
    const IsActive = useMatch({path:resolvedPath.pathname, end:true})

    return ( 
        <Link to={props.to + location.hash} className={IsActive ? styles.active : ''}>{props.children}</Link>
    );
}

export default CustomLink;