import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Modal, Row, Col, InputNumber, Input, Button, Upload, Select, App } from 'antd'
import { useAddItemMutation } from '../redux/merketApi'

function NewMarketItem({ isNewModalOpen, setIsNewModalOpen }) {

    const { message: toast } = App.useApp();
    const [addItem, {isSuccess: isAdded, error, isError: addedError}] = useAddItemMutation()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [stowage, setStowage] = useState(0)
    const [itemIcon, setItemIcon] = useState({})
    const [localIcon, setLocalIcon] = useState('nescafe.png')

    useEffect(() => {
        if (isAdded) {
            setName('')
            setPrice(0)
            setStowage(0)
            setItemIcon({})
            setIsNewModalOpen(false);
            setLocalIcon('nescafe.png')
            toast.success('Added Successfuly')
        }
    }, [isAdded])

    useEffect(() => {
        if (addedError) {
            toast.error(error.data.message)
        }
    }, [addedError])


    function handleOk() {

        if (name === '' || price === null || stowage === null) {
            toast.error('Please Fill All Fields')
            return;
        }

        const formData = new FormData()

        formData.append('name', name)
        formData.append('price', price)
        formData.append('stowage', stowage)
        formData.append('icon', Object.keys(itemIcon).length === 0 ? '/images/marketicons/' + localIcon : itemIcon)
        
        addItem(formData)

    };

    return (
        <Modal title='Add New Item' className='custom-modal' open={isNewModalOpen} onOk={handleOk} onCancel={() => setIsNewModalOpen(false)}>
            <Row>
                <Col span={24} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Name</label>
                    <Input placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
                </Col>
                <Col span={8}>
                    <label style={{display: 'block'}}>Icon</label> 
                    <Select
                        defaultValue="nescafe.png"
                        value={localIcon}
                        style={{width: 75 }}
                        onChange={val => setLocalIcon(val)}
                        options={[
                            {
                                value: 'coffee.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/coffee.png' alt='coffee' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'nescafe.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/nescafe.png' alt='nescafe' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'indomi.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/indomi.png' alt='indomi' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'mango-juice.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/mango-juice.png' alt='mango' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: '7up.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/7up.png' alt='7up' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'pepsi.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/pepsi.png' alt='pepsi' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'tea.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/tea.png' alt='tea' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'water.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/water.png' alt='water' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'apple.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/apple.png' alt='apple' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'mirnda-orange.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/mirnda-orange.png' alt='mirnda' width={30} height={30} />
                                    </div>
                            },
                            {
                                value: 'orange-juice.png',
                                label:<div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src='/images/marketicons/orange-juice.png' alt='orange' width={30} height={30} />
                                    </div>
                            },
                        ]}
                    />
                </Col>
                <Col span={8} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Stowage</label>
                    <InputNumber placeholder="Count" onChange={value => setStowage(value)} value={stowage} />
                </Col>
                <Col span={8} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Price</label>
                    <InputNumber placeholder="Price" onChange={value => setPrice(value)} value={price} />
                </Col>
                <Col span={24}>
                    <Upload 
                        maxCount={1} 
                        name='itemIcon' 
                        accept='image/*'
                        fileList={Object.keys(itemIcon).length === 0 ? [] : [itemIcon]}
                        beforeUpload={_ => false}
                        onChange={info => setItemIcon(info.file.status === 'removed' ? {} : info.file)}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        <label style={{ color: '#FFF', marginLeft: 7 }}>(Upload Your Own Icon)</label>
                    </Upload>
                </Col>
            </Row>
        </Modal>
    );
}

export default NewMarketItem;