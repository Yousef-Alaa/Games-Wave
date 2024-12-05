import { useState } from 'react';
import {
    DoubleRightOutlined,
    DoubleLeftOutlined,
    HomeOutlined,
    ShopOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { BiLogOut } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive'
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/auth/authSlice'
import { ReactComponent as PlayStation} from '../assets/PlayStation.svg';
import { ReactComponent as PlayStationSmall} from '../assets/PlayStation-Small.svg';

const NavItems = [
    {
        key: '/',
        icon: <HomeOutlined />,
        label: "Home"
    },
    {
        key: '/profile',
        icon: <UserOutlined />,
        label: "Profile"
    },
    {
        key: '/settings',
        icon: <SettingOutlined />,
        label: "Settings"
    },
    {
        key: '/market',
        icon: <ShopOutlined />,
        label: "Market"
    },
    {
        key: '/about',
        icon: <InfoCircleOutlined />,
        label: "About"
    }

];

function SideBar() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { isDark } = useSelector(state => state.theme)

    const [collapsed, setCollapsed] = useState(false);
    const isSmallerThan544 = useMediaQuery({ query: '(max-width: 544px)' })
    const asideStyle = {
        backdropFilter: `blur(${isDark ? 0 : 3}px)`,
        paddingTop: 10, 
        width: collapsed ? 80 : 185,
        minWidth: collapsed ? 80 : 185,
        left: collapsed ? '-100%' : 0
    }

    return (
        <>
        <aside className={isSmallerThan544 ? 'sidebar-bottom' : ''} style={asideStyle}>
            <div className="logo">
                {collapsed ?
                    <PlayStationSmall style={{maxWidth: '100%', fill: '#FFF', height: 60, marginBottom: 8, filter: `drop-shadow(2px 4px 5px rgba(255, 255, 255, .7))`}} /> :
                    <PlayStation style={{maxWidth: '100%', fill: '#FFF', height: 60, marginBottom: 8, filter: `drop-shadow(2px 4px 5px rgba(255, 255, 255, .7))`}} />
                }
            </div>
            <ul style={{'--fontSize': collapsed ? 16 : 14}}>
                {NavItems.map((item, index) => <li 
                    key={index} 
                    style={{padding: collapsed ? '0 28px' : '0 16px 0 24px'}}
                    onClick={() => navigate(item.key)}
                    className={`nav-item ${item.key === location.pathname ? 'nav-item-active' : ''}`}
                    >

                    {item.icon}
                    <span className='text'>{item.label}</span>

                </li>)}
            </ul>

            <span className='trigger' style={{color: "#FFF"}}>
                <div className="icons" onClick={() => setCollapsed(!collapsed)} style={{paddingLeft: collapsed ? 21 : 25.5}}>
                    {collapsed ? 
                        <DoubleRightOutlined /> :
                        <>
                            <DoubleLeftOutlined />
                            <span style={{display: isSmallerThan544 ? 'none' : 'block', whiteSpace: 'nowrap', overflow: 'hidden'}}>&nbsp;&nbsp;Shrink</span>
                        </>
                    }
                </div>
                <div className="icons" onClick={_ => dispatch(logout())} style={{paddingLeft: collapsed ? 21 : 25.5}}>
                    <BiLogOut />
                    {!collapsed && <span style={{display: isSmallerThan544 ? 'none' : 'block', whiteSpace: 'nowrap', overflow: 'hidden'}}>&nbsp;&nbsp;Logout</span>}
                </div>
            </span>
        </aside>
        {isSmallerThan544 && <DoubleRightOutlined style={{
            display: 'block',
            position: 'fixed',
            background: 'var(--mainBg)',
            color: '#FFF',
            fontSize: 18,
            padding: 10,
            opacity: '.6',
            zIndex: 2,
            border: '1px solid #FFF',
            translate: '0 -50%',
            left: 0,
            top: 'calc(50% + 90px)',
            borderRadius: '0 8px 8px 0',
            boxShadow: "0 0 5px #FFF",
            cursor: "pointer"
        }}
        onClick={() => setCollapsed(false)} />}
    </>
    );
}

export default SideBar;