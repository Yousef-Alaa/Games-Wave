import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Switch, Typography, Col, InputNumber, Button, App } from 'antd';
import PagesHead from '../../componenets/PagesHead';

import { GiConfirmed } from 'react-icons/gi';
import { MdOutlineEdit } from 'react-icons/md';
import { SwatchesPicker } from 'react-color';
import { RiComputerLine } from 'react-icons/ri';
import Icon, { HighlightOutlined } from '@ant-design/icons'

import { changeTheme } from '../../redux/themeSlice'
import { updateUnits, reset } from '../../redux/unitsSlice'

import { ReactComponent as PS4Controller } from '../../assets/icons/ps4-controller.svg'
import { ReactComponent as PS5Controller } from '../../assets/icons/ps5-controller.svg'

let { Title } = Typography;

export default function Settings() {
    
    const dispatch = useDispatch();
    const { message: toast } = App.useApp();
    const unitsSettings = useSelector(state => state.units)
    const {colors, isDark, bgLinear} = useSelector(state => state.theme)
    const { isLoading, isError, isSuccess, message } = unitsSettings.request

    const [dark, setDark] = useState(isDark)
    const [linear, setLinear] = useState(bgLinear)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [color, setColor] = useState({ hex: colors.main })
    
    const [pcCountEditMode, setPcCountEditMode] = useState(false)
    const [pcPriceEditMode, setPcPriceEditMode] = useState(false)
    
    const [ps4CountEditMode, setPs4CountEditMode] = useState(false)
    const [ps4SingleEditMode, setPs4SingleEditMode] = useState(false)
    const [ps4MultiEditMode, setPs4MultiEditMode] = useState(false)
    
    const [ps5CountEditMode, setPs5CountEditMode] = useState(false)
    const [ps5SingleEditMode, setPs5SingleEditMode] = useState(false)
    const [ps5MultiEditMode, setPs5MultiEditMode] = useState(false)

    const [localPC, setLocalPC] = useState({ ...unitsSettings.pc })
    const [localPS4, setLocalPS4] = useState({ ...unitsSettings.ps4 })
    const [localPS5, setLocalPS5] = useState({ ...unitsSettings.ps5 })

    // Styles
    const titleStyle = {color: "#FFF", marginTop: 18, width: '100%', display: 'flex', alignItems: 'center', translate: -37, fontSize: 26 }
    const colsStyle = {display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 'bold'}
    const smallTitleStyle = {marginRight: 10}
    const formStyle = {
        padding: '10px 0 20px',
        borderBottom: `1px solid #FFF`,
        display: 'flex',
        flexFlow: "row wrap",
        justifyContent: 'space-between',
        paddingInline: 37,
        gap: 8
    }


    useEffect(() => {
        if (isError) toast.error(message)
        if (isSuccess) toast.success(message)
        if (isError || isSuccess) dispatch(reset())
    }, [isError, isSuccess, message])

    function handleSubmit(e) {
        e.preventDefault()

        let updatedColors = {
            ...colors,
            main: color.hex
        }

        if (color.rgb) updatedColors.rgbmain = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;

        dispatch(changeTheme({colors: updatedColors, isDark: dark, bgLinear: linear}))

        toast.success('Settings Applied')
    }

    function handleSave(e) {
        
        e.preventDefault()
        let data = { pc: localPC, ps4: localPS4, ps5: localPS5 }

        dispatch(updateUnits(data))
    }

    function handleKeyDown(e) {
        
        if (e.keyCode === 13) {
            e.preventDefault()       
        }
        
    }

    return (
    <>
        <PagesHead pageTitle='Settings' />
        <Layout className='setting-page' style={{background: 'transparent'}}>
            <form onSubmit={handleSubmit} style={{...formStyle, gap: 15}}>
                <Title level={3} style={titleStyle}><HighlightOutlined style={{marginRight: 7}} />Theme</Title>
                <Col style={{...colsStyle, position: 'relative'}}>
                    <span style={smallTitleStyle}>Theme Color:</span>
                    <span style={{
                        width: '22px',
                        aspectRatio: '1 / 1',
                        background: color.hex,
                        borderRadius: '4px',
                        cursor: "pointer"
                    }} onClick={() => setPickerOpen(true)}></span>
                    {
                    pickerOpen && <div style={{position: 'absolute',zIndex: 10, top: 'calc(100% + 10px)'}}>
                        <div onClick={() => setPickerOpen(false)} style={{
                            width: '100%',
                            height: '100%',
                            position: 'fixed',
                            inset: 0}}></div>
                        <SwatchesPicker onChangeComplete={values => {setColor(values); setPickerOpen(false)}} color={color}/>
                    </div>
                    }
                </Col>
                <Col style={colsStyle}>
                    <span style={smallTitleStyle}>Background Mode:</span>
                    <Switch
                            checked={linear}
                            onChange={value => setLinear(value)}
                            checkedChildren="Linear"
                            unCheckedChildren="Solid"
                            style={{width: 65}}
                        />
                </Col>
                <Col style={colsStyle}>
                    <span style={smallTitleStyle}>Theme Mode:</span>
                    <Switch
                            checked={dark}
                            onChange={value => setDark(value)}
                            checkedChildren="Dark"
                            unCheckedChildren="Light"
                            style={{width: 60}}
                        />
                </Col>
                <Button style={{margin: "10px auto 0", width: "100%"}} type='primary' htmlType="submit">Apply</Button>
            </form>
            <form onSubmit={handleSave} style={{...formStyle, marginBottom: 20}}>
                {/* PC */}
                <Title level={3} style={titleStyle}><RiComputerLine style={{marginRight: 7}} />PC</Title>
                <Col style={colsStyle}>
                    {pcCountEditMode ? 
                    <InputNumber
                        id='inp-pc-devices'
                        onKeyDown={handleKeyDown}
                        style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                        variant={false} 
                        addonAfter={<span
                            onClick={e => {
                                let count = parseInt( document.querySelector('#inp-pc-devices').value )
                                setLocalPC(data => ({...data, count }));
                                setPcCountEditMode(false)
                            }}
                        ><GiConfirmed /></span>}
                        defaultValue={localPC.count} /> :
                    <div className='setting-item'>
                        <span>{localPC.count} Devices</span>
                        <span>
                            <MdOutlineEdit onClick={_ => setPcCountEditMode(true)} />
                        </span>
                    </div>
                    }
                    
                </Col>
                <Col style={colsStyle}>
                    {pcPriceEditMode ? 
                        <InputNumber
                            id='inp-pc-price'
                            onKeyDown={handleKeyDown}
                            style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                            variant={false}
                            addonAfter={<span
                                onClick={e => {
                                    let price = parseInt( document.querySelector('#inp-pc-price').value )
                                    setPcPriceEditMode(false)
                                    setLocalPC(data => ({...data, price}));
                                }}
                            ><GiConfirmed /></span>}
                            defaultValue={localPC.price} /> :
                        <div className='setting-item'>
                            <span>Price: {localPC.price}$</span>
                            <span>
                                <MdOutlineEdit onClick={_ => setPcPriceEditMode(true)} />
                            </span>
                        </div>
                    }
                </Col>
                {/* PS4 */}
                <Title level={3} style={titleStyle}><Icon component={PS4Controller} style={{marginRight: 7}} />PS4</Title>
                <Col style={colsStyle}>
                {ps4CountEditMode ? 
                    <InputNumber
                        id='inp-ps4-devices'
                        onKeyDown={handleKeyDown}
                        style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                        variant={false}
                        addonAfter={<span
                            onClick={e => {
                                let count = parseInt( document.querySelector('#inp-ps4-devices').value )
                                setPs4CountEditMode(false)
                                setLocalPS4(data => ({...data, count }));
                            }}
                        ><GiConfirmed /></span>}
                        defaultValue={localPS4.count} /> :
                    <div className='setting-item'>
                        <span>{localPS4.count} Devices</span>
                        <span>
                            <MdOutlineEdit onClick={_ => setPs4CountEditMode(true)} />
                        </span>
                    </div>
                    }
                </Col>
                <Col style={colsStyle}>
                    {ps4SingleEditMode ? 
                        <InputNumber
                            id='inp-ps4-single'
                            onKeyDown={handleKeyDown}
                            style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                            variant={false}
                            addonAfter={<span 
                                onClick={e => {
                                    let singlePrice = parseInt( document.querySelector('#inp-ps4-single').value )
                                    setPs4SingleEditMode(false)
                                    setLocalPS4(data => ({...data, singlePrice }))
                                }}
                            ><GiConfirmed /></span>}
                            defaultValue={localPS4.singlePrice} /> :
                        <div className='setting-item'>
                            <span>Single Price: {localPS4.singlePrice}$</span>
                            <span>
                                <MdOutlineEdit onClick={_ => setPs4SingleEditMode(true)} />
                            </span>
                        </div>
                    }
                </Col>
                <Col style={colsStyle}>
                {ps4MultiEditMode ? 
                        <InputNumber
                            id='inp-ps4-multi'
                            onKeyDown={handleKeyDown}
                            style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                            variant={false}
                            addonAfter={<span
                                onClick={e => {
                                    let multiPrice = parseInt( document.querySelector('#inp-ps4-multi').value )
                                    setPs4MultiEditMode(false)
                                    setLocalPS4(data => ({...data, multiPrice}))
                                }}
                            ><GiConfirmed /></span>}
                            defaultValue={localPS4.multiPrice} /> :
                        <div className='setting-item'>
                            <span>Multi Price: {localPS4.multiPrice}$</span>
                            <span>
                                <MdOutlineEdit onClick={_ => setPs4MultiEditMode(true)} />
                            </span>
                        </div>
                    }
                </Col>
                {/* PS5 */}
                <Title level={3} style={titleStyle}><Icon component={PS5Controller} style={{marginRight: 7}} />PS5</Title>
                <Col style={colsStyle}>
                {ps5CountEditMode ? 
                    <InputNumber
                        id='inp-ps5-devices'
                        onKeyDown={handleKeyDown}
                        style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                        variant={false} 
                        addonAfter={<span
                            onClick={e => {
                                let count = parseInt( document.querySelector('#inp-ps5-devices').value )
                                setPs5CountEditMode(false)
                                setLocalPS5(data => ({...data, count}))
                            }}
                        ><GiConfirmed /></span>}
                        defaultValue={localPS5.count} /> :
                    <div className='setting-item'>
                        <span>{localPS5.count} Devices</span>
                        <span>
                            <MdOutlineEdit onClick={_ => setPs5CountEditMode(true)} />
                        </span>
                    </div>
                    }
                </Col>
                <Col style={colsStyle}>
                    {ps5SingleEditMode ? 
                        <InputNumber
                            id='inp-ps5-single'
                            onKeyDown={handleKeyDown}
                            style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                            variant={false}
                            addonAfter={<span
                                onClick={e => {
                                    let singlePrice = parseInt( document.querySelector('#inp-ps5-single').value )
                                    setPs5SingleEditMode(false)
                                    setLocalPS5(data => ({...data, singlePrice}))
                                }}
                            ><GiConfirmed /></span>}
                            defaultValue={localPS5.singlePrice} /> :
                        <div className='setting-item'>
                            <span>Single Price: {localPS5.singlePrice}$</span>
                            <span>
                                <MdOutlineEdit onClick={_ => setPs5SingleEditMode(true)} />
                            </span>
                        </div>
                    }
                </Col>
                <Col style={colsStyle}>
                {ps5MultiEditMode ? 
                        <InputNumber
                            id='inp-ps5-multi'
                            onKeyDown={handleKeyDown}
                            style={{border: isDark || bgLinear ? 'none' : '2px solid var(--main)', overflow: 'hidden', borderRadius: '6px'}}
                            variant={false}
                            addonAfter={<span
                                onClick={e => {
                                    let multiPrice = parseInt( document.querySelector('#inp-ps5-multi').value )
                                    setPs5MultiEditMode(false)
                                    setLocalPS5(data => ({...data, multiPrice}))
                                }}
                            ><GiConfirmed /></span>}
                            defaultValue={localPS5.multiPrice} /> :
                        <div className='setting-item'>
                            <span>Multi Price: {localPS5.multiPrice}$</span>
                            <span>
                                <MdOutlineEdit onClick={_ => setPs5MultiEditMode(true)} />
                            </span>
                        </div>
                    }
                </Col>
                <Button loading={isLoading} style={{margin: "20px auto 0", width: "100%"}} htmlType='submit' type="primary">Apply</Button>
            </form>
        </Layout>
    </>)
}