import React from 'react';
import { Typography, Row, Col } from 'antd';
import { useMediaQuery } from 'react-responsive'
import Shapes from '../assets/shapes.png';

let { Title } = Typography;

function PagesHead({ pageTitle }) {

    const isSmallerThan400 = useMediaQuery({ query: '(max-width: 400px)' })
    const customStyle = { fontSize: isSmallerThan400 ? 25 : 32, fontStyle: 'italic' }
    let titleStyle = { color: "#FFF", margin: 0, fontSize: isSmallerThan400 && 28 }
    
    if (pageTitle === 'Games-Wave') {
        titleStyle = {
            ...titleStyle,
            ...customStyle
        }
    }

    return (
        <Row justify='space-between' align='center' style={{marginBlock: `5px ${isSmallerThan400 ? 10 : 15}px`}}>
            <Col style={{display: 'flex', alignItems: 'center'}}><Title style={titleStyle}>{pageTitle}</Title></Col>
            <Col style={{display: 'flex', alignItems: 'center'}}><img width={isSmallerThan400 ? 120 : 150} style={{filter: `drop-shadow(2px 4px 5px #FFF)`}} src={Shapes} alt='Controls' /></Col>
        </Row>
    );
}

export default PagesHead;