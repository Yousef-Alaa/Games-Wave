import { useState } from 'react';
import { MdMode } from 'react-icons/md';
import { FaRegLightbulb } from 'react-icons/fa';
import { Col, Row, Button, Select, Layout, Modal, App } from 'antd';
import { DollarCircleOutlined, FieldTimeOutlined, HourglassOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import { addOrder, changeMode, endUnit, pauseUnit, resumeUnit, startUnit } from '../redux/timeManager';

import { ReactComponent as PCSVG} from '../assets/PC.svg';
import { ReactComponent as PS4} from '../assets/console-with-gamepad.svg';
import { ReactComponent as PS5} from '../assets/playstation-5.svg';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as NoData } from '../assets/no-market.svg'
import { useEditItemsMutation, useGetAllItemsQuery } from '../redux/merketApi';


function DrawerContent({ unitState, unitName, setOpen, durationInterval, setDurationInterval }) {

    
    const dispatch = useDispatch()
    const colors = useSelector(state => state.theme.colors);
    const unitsSettings = useSelector(state => state.units);
    
    const [isOpen, setIsOpen] = useState(false)
    const [isEndOpen, setIsEndOpen] = useState(false)
    
    const iconSize = 2
    const { unitType } = unitState
    const rowsStyle = {marginBottom: 7}
    const colsStyle = {fontSize: 16, fontWeight: 'bold'}

    function getOrdersTotal() {
        let { orders } = unitState;
        let total = orders.reduce((acc, item) => acc + item.price, 0)
        return total;
    }

    function getDuration() {
        let totalSeconds = unitState.duration;
        let hours = Math.floor( totalSeconds / (60 * 60) )
        let minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
        let seconds = ((totalSeconds % (60 * 60)) % 60)
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    function getTimeCost() {
        let timeByHour = (unitState.duration / 60) / 60;
        let cost = `${timeByHour * unitState.hourPrice}`;
        let i = cost.indexOf('.')
        return Number( cost.slice(0, i + 3) );
    }

    return (
        <Layout style={{background: 'transparent'}}>
            <Row style={rowsStyle}>
                <Col style={colsStyle} span={iconSize}>
                    <DollarCircleOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Hour Price: <span style={{color: colors.main}}>{unitState.hourPrice}$</span>
                </Col>
            </Row>
            <Row style={rowsStyle}>
                <Col style={colsStyle} span={iconSize}>
                <FieldTimeOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                Start Time: <span style={{color: '#FF6CA8'}}>{unitState.startTime}</span>
                </Col>
            </Row>
            <Row style={rowsStyle}>
                <Col style={{...colsStyle, display: 'flex', alignItems: 'center'}} span={iconSize}>
                    <FaRegLightbulb />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Status: <span style={{color: unitState.status === 0 ? '#ff6666' :
                        unitState.status === 1 ? '#FFCF4B' :
                        unitState.status === 2 ? '#40e2a0' : 'red'}}>{
                            unitState.status === 0 ? 'Not Work' :
                            unitState.status === 1 ? 'Paused' :
                            unitState.status === 2 ? 'Running...' : 'Unknown Status'
                        }</span>
                </Col>
            </Row>
            <Row style={rowsStyle}>
                <Col style={colsStyle} span={iconSize}>
                <HourglassOutlined /> 
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Duration: <span style={{color: '#9dcce0'}}>{getDuration()}</span>
                </Col>
            </Row>
            {
                unitState.mode !== 'pc' && <Row style={rowsStyle}>
                    <Col style={{...colsStyle, display: 'flex', alignItems: 'center'}} span={iconSize}>
                        <MdMode /> 
                    </Col>
                    <Col style={colsStyle} span={24 - iconSize}>
                        <Select 
                            size='small'
                            value={unitState.mode} 
                            options={[
                                {value: 'single', label: 'Single Player'},
                                {value: 'multi', label: 'Multi Player'}
                            ]} 
                            onChange={value => dispatch(changeMode({
                                    unitId: unitState.unitId,
                                    mode: value,
                                    price: value === 'single' ? unitsSettings[unitType].singlePrice : unitsSettings[unitType].multiPrice 
                                }))} 
                            />
                    </Col>
            </Row>
            }
            
            <Row style={{...rowsStyle, marginTop: 12, color: '#faad14'}}>
                <Col style={colsStyle} span={iconSize}>
                    <ShoppingCartOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Orders: {getOrdersTotal()}$
                </Col>
            </Row>
            <Row style={{...rowsStyle, color: '#2980b9'}}>
                <Col style={colsStyle} span={iconSize}>
                    <FieldTimeOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Time Cost: {getTimeCost()}$
                </Col>
            </Row>
            <Row style={{...rowsStyle, color: '#17BBB0'}}>
                <Col style={colsStyle} span={iconSize}>
                    <DollarCircleOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Total Cost: {getOrdersTotal() + getTimeCost()}$
                </Col>
            </Row>
            <Row style={{marginTop: 20}}>
                {
                    unitState.status === 0 ? <Button onClick={() => dispatch(startUnit(unitState.unitId)) } type="primary">Start</Button> :
                    unitState.status === 1 ? <>
                        <Button type="primary" style={{marginRight: 15}} onClick={() => dispatch(resumeUnit(unitState.unitId))}>Resume</Button>
                        <Button onClick={() => setIsEndOpen(true)} style={{background: 'transparent'}} danger>End</Button>
                        </> :
                    unitState.status === 2 ? <>
                    <Button onClick={() => {
                        dispatch(pauseUnit(unitState.unitId));
                        clearInterval(durationInterval);
                        setDurationInterval(-1)
                        }} style={{marginRight: 15}}>Stop</Button>
                    <Button  type="primary" onClick={() => setIsOpen(true)} style={{marginRight: 15}}>Order</Button>
                    <Button  onClick={() => setIsEndOpen(true)} style={{background: 'transparent'}} danger>End</Button></>
                    : "Unknown Status"
                }
            </Row>
            <MarketItems unitState={unitState} ordersTotal={getOrdersTotal()} isOpen={isOpen} setIsOpen={setIsOpen} />
            <UnitEnd 
                unitName={unitName} 
                unitState={unitState} 
                ordersTotal={getOrdersTotal()} 
                timeCost={getTimeCost()} 
                setParentOpen={setOpen} 
                isEndOpen={isEndOpen} 
                setIsEndOpen={setIsEndOpen} 
                durationInterval={durationInterval}
                setDurationInterval={setDurationInterval} 
                />
        </Layout>
    );
}

function MarketItems({ unitState, ordersTotal, isOpen, setIsOpen }) {

    const dispatch = useDispatch()
    const { data: { items: market } = { items: [] } } = useGetAllItemsQuery()
    
    function handleClick({ id, localId, name, price }) {
        dispatch(addOrder({ unitId: unitState.unitId, order: { id, localId, name, price }}))
    }

    return (
        <Modal
            title={market.length > 0 ? 'Choose From Market Items' : 'No Market Items Founded !!'}
            className='custom-modal custom-modal-footer'
            open={isOpen} onOk={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
            footer={[
                market.length > 0 && <span key="total" style={{fontSize: 16, fontWeight: 'bold'}}>Orders Total: {ordersTotal}$</span>,
                <Button key='ok'  type='primary' onClick={() => setIsOpen(false)}>Ok</Button>
            ]}
            >
            {market.length > 0 && <div className='menu-items'>
                {
                    market.map((item, i) => <div key={i} onClick={() => handleClick(item)}>
                        <img src={item.icon} width={50} height={50} alt={`market item ${i + 1}`} />
                        <span className='name'>{item.name}</span>
                        <span className='price'>{item.price}$</span>
                    </div>)
                }
            </div>}
            {
                market.length === 0 && <div style={{height: '50vh', textAlign: 'center'}}><NoData style={{maxHeight: '100%'}} /></div>
            }
        </Modal>
    )
}

function UnitEnd({ unitState, unitName, ordersTotal, timeCost, isEndOpen, setIsEndOpen, setParentOpen, durationInterval, setDurationInterval }) {

    const { unitType } = unitState

    const dispatch = useDispatch()
    const { message: toast } = App.useApp();
    const [editItems] = useEditItemsMutation()
    const { data: { items: market } = { items: [] } } = useGetAllItemsQuery()

    let title = unitName.split('').splice(unitName.indexOf('Drawer'), 7)
    let finalTitle = title.join("").slice(0, title.indexOf(' ') + 1) + '> #' + title.join("").slice(title.indexOf(' ') + 1)
    
    const iconSize = 1
    const rowsStyle = {marginBottom: 3}
    const colsStyle = {fontSize: 16, fontWeight: 'bold'}
    const unitImgStyle = {
        fill: 'rgba(255, 255, 255, .9)',
        filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, .8))',
        height: 65,
        position: 'relative',
        padding: unitType === 'ps4' ? '6px 6px 0' : ''
    }

    function handleClick() {
        setIsEndOpen(false)
        dispatch(endUnit(unitState.unitId))
        clearInterval(durationInterval)
        setDurationInterval(-1)
        setParentOpen(false)

        let localMarket = market.map(({ id, stowage }) => ({ id, stowage, visited: false }))
        unitState.orders.forEach(item => {
            let index = localMarket.findIndex(it => it.id == item.id)
            localMarket[index].stowage--;
            localMarket[index].visited = true;
        })

        let data = localMarket.filter(item => item.visited).map(({ id, stowage }) => ({ id, stowage }))

        editItems(data)
        toast.success('Closed Successful')
    }

    return (
        <Modal
            title='End Time'
            className='custom-modal endtime-modal'
            open={isEndOpen} onOk={() => setIsEndOpen(false)}
            onCancel={() => setIsEndOpen(false)}
            footer={[
                <Button key='ok' type='primary' onClick={handleClick}>End Now</Button>,
                <Button key='back' onClick={() => setIsEndOpen(false)}>Cancel</Button>
            ]}
            >
                <div className='head'>
                    <h3>{finalTitle}</h3>
                    {
                        unitType === 'pc' ? <PCSVG style={unitImgStyle} />
                        : unitType === 'ps4' ? <PS4 style={unitImgStyle} />
                        : unitType === 'ps5' ? <PS5 style={unitImgStyle} /> : null
                        
                    }
                </div>
                <Row style={{...rowsStyle, marginTop: 12, color: '#faad14'}}>
                    <Col style={colsStyle} xs={2} span={iconSize}>
                        <ShoppingCartOutlined />
                    </Col>
                    <Col style={colsStyle} xs={22} span={24 - iconSize}>
                        Orders: {ordersTotal}$
                    </Col>
                </Row>
                <Row style={{...rowsStyle, color: '#2980b9'}}>
                    <Col style={colsStyle} xs={2} span={iconSize}>
                        <FieldTimeOutlined />
                    </Col>
                    <Col style={colsStyle} xs={22} span={24 - iconSize}>
                        Time Cost: {timeCost}$
                    </Col>
                </Row>
                <Row style={{...rowsStyle, color: '#17BBB0'}}>
                    <Col style={colsStyle} xs={2} span={iconSize}>
                        <DollarCircleOutlined />
                    </Col>
                    <Col style={colsStyle} xs={22} span={24 - iconSize}>
                        Total Cost: {ordersTotal + timeCost}$
                    </Col>
                </Row>
        </Modal>
    )
}

export default DrawerContent;