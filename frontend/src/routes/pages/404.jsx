import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'
import { ReactComponent as SVG404 } from '../../assets/404.svg'

function Page404() {

    const isSmallerThan600 = useMediaQuery({ query: '(max-width: 600px)' });
    const isSmallerThan480 = useMediaQuery({ query: '(max-width: 480px)' });
    const isSmallerThan380 = useMediaQuery({ query: '(max-width: 380px)' });

    return (<div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center'
    }}>
        <SVG404 style={{ width: isSmallerThan600 ? "80%" : '70%', height: isSmallerThan380 ? '50vh' : isSmallerThan480 ? '60vh' : '70vh '}} />
        <p style={{ fontSize: 24, color: 'rgba(255, 255, 255, .7)' }}>Page Not Found</p>
        <Link to='/'>Go to Home</Link>
    </div>);
}

export default Page404;