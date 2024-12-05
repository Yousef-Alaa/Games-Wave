import { Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

// Components
import DrawerContent from './DrawerContent.jsx';
import { ReactComponent as PCSVG} from '../assets/PC.svg';
import { ReactComponent as PS5} from '../assets/playstation-5.svg';
import { ReactComponent as PS4} from '../assets/console-with-gamepad.svg';

import UnitsStyles from './UnitsConfig.js';
import { incrementTime } from '../redux/timeManager.js';


export default function Unit({ unitId }) {

    const dispatch = useDispatch()
    const timeManager = useSelector(state => state.timeManager)
    const unitState = timeManager.find(item => item.unitId === unitId)

    const { unitNumber, unitType } = unitState; 
    const unitIndexStyle = UnitsStyles[unitType];    
    
    const [open, setOpen] = useState(false);
    const [durationInterval, setDurationInterval] = useState(-1);


    const unitImgStyle = {
        fill: 'rgba(255, 255, 255, .8)',
        filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, .8))',
        width: '100%',
        height: 115,
        position: 'relative',
        padding: unitType === 'ps4' ? '6px 6px 0' : ''
    }

    useEffect(() => {

        if (unitState.durationWork && durationInterval === -1) {

            let interval = setInterval(() => {
                dispatch(incrementTime(unitState.unitId))
            }, 1000)

            setDurationInterval(interval)
        }

    }, [unitState.durationWork])



    function getDuration() {
        let totalSeconds = unitState.duration;
        let hours = Math.floor( totalSeconds / (60 * 60) )
        let minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }



    return (
    <>
        <div className='item' style={{position: 'relative'}} onClick={() => setOpen(true)}>
            <div style={{ 
                cursor: "pointer",
                zIndex: 2,
                position: 'absolute',
                inset: 0
                }}></div>{/* This Div Is Overlay for prevent select images & text */}
            <span style={unitIndexStyle}>{unitNumber < 10 ? `0${unitNumber}` : unitNumber}</span>
            {
                unitType === 'pc' ? <PCSVG style={unitImgStyle} />
                : unitType === 'ps4' ? <PS4 style={unitImgStyle} />
                : unitType === 'ps5' ? <PS5 style={unitImgStyle} /> : null
                
            }
            <div style={{
                fontSize: 16, display: 'block', textAlign: 'center',
                color:  unitState.status === 0 ? '#ff6666' :
                        unitState.status === 1 ? 'yellow' :
                        unitState.status === 2 ? '#40e2a0' : '#DDD'
                    }}>{getDuration()}</div>
        </div>
        <Drawer
            open={open}
            closable={true}
            placement='right'
            onClose={() => setOpen(false)}
            key={`${unitType}-${unitNumber}`}
            title={`${unitType.toUpperCase()} Drawer ${unitNumber < 10 ? `0${unitNumber}` : unitNumber}`}
        >
            <DrawerContent 
                setOpen={setOpen} 
                unitState={unitState} 
                durationInterval={durationInterval}
                setDurationInterval={setDurationInterval}
                unitName={`${unitType.toUpperCase()} Drawer ${unitNumber < 10 ? `0${unitNumber}` : unitNumber}`} 
            />
        </Drawer>
    </>
    )
}
