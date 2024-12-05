import axios from 'axios'
import { useState, useEffect } from 'react';
import { App, Layout, ConfigProvider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive'
import Cookies from 'js-cookie'
import TheRoutes from './routes';
import SideBar from './componenets/SideBar';
import Loading from './componenets/Loading';
import { setUser } from './redux/auth/authSlice'
import './App.scss';

const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";

function MyApp() {

    const [pageLoading, setPageLoading] = useState(true)
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { isDark, bgLinear, colors } = useSelector(state => state.theme)
    const isSmallerThan544 = useMediaQuery({ query: '(max-width: 544px)' })


    useEffect(() => {
        
        const token = Cookies.get('token');
        
        if (token) {
            axios.get(API_URL + '/users/getme', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                setPageLoading(false)
                dispatch(setUser(res.data.user))
            })
            .catch(err => setPageLoading(false))
        } else {
            setPageLoading(false)
        }

    }, [])

    useEffect(() => {
        document.documentElement.style.setProperty('--main', colors.main)
        document.documentElement.style.setProperty('--rgbmain', colors.rgbmain)
        document.documentElement.style.setProperty('--mainBg', colors.mainBg)
        document.querySelector('meta[name="theme-color"]').content = colors.main
    },[colors])

    function getLayoutBg() {
        if (isDark && bgLinear) return `linear-gradient(15deg, ${colors.main} 10%, black 100%)`
        if (!isDark && bgLinear) return `linear-gradient(20deg, ${colors.main} 10%, #E4E4E4 100%)`
        if (!isDark && !bgLinear) return 'var(--bgNotDarkNotLinear)'
        return colors.mainBg
    }

    if (pageLoading) return <Loading />

    return (
        <ConfigProvider theme={{ token: {colorPrimary: colors.main} }} >
            <App>
                <Layout style={{height: '100vh', flexDirection: 'row', background: getLayoutBg()}}>
                    {user && <SideBar />}
                    <Layout style={{background: 'transparent', backdropFilter: `blur(${isDark ? '3px' : '10px'})`, borderLeft: `${(isSmallerThan544 || !user) ? 0 : 2}px solid rgba(255, 255, 255, ${isDark ? 1 : 0.35})`, overflow: 'hidden scroll'}}>
                        <Layout.Content style={{padding: 10, color: "#FFF"}}>
                            <TheRoutes />
                        </Layout.Content>
                    </Layout>
                </Layout>
            </App>
        </ConfigProvider>
    );
};

export default MyApp;