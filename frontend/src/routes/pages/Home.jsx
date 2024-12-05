import React from "react";
import Unit from '../../componenets/Unit';
import PagesHead from "../../componenets/PagesHead";
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
import { ReactComponent as NODATA } from '../../assets/no-devices.svg'
import { ReactComponent as Welcome } from '../../assets/welcome.svg'

function Home() {

    const { user } = useSelector(state => state.auth)
    const timeManager = useSelector(state => state.timeManager)

    const style = {
        paddingBottom: 15,
        display: 'grid',
        gap: 15,
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gridTemplateRows: `repeat(1, 1fr)`,
    }

    if (!user) return <>
        <PagesHead pageTitle='Games-Wave' />
        <div className="welcome">
            <div><Welcome /></div>
            <div>
                <Link to='/login'>Login</Link>
                <Link to='/signup'>SignUp</Link>
            </div>
        </div>

    </>;

    return (<>
        <PagesHead pageTitle='Home' />
        {
            timeManager.length === 0 ? <div className='no-data'><NODATA /><span className="text">Go To <Link to='/settings'>Settings</Link> Page</span></div> : 
            <div style={style}>
                {timeManager.map((item, ind) => <Unit key={ind} unitId={item.unitId} />)}
            </div>
        }
    </>);
}

export default Home;