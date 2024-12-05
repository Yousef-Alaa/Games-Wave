import { useEffect, useState } from 'react';
import { Modal, Row, Col, InputNumber, Input, App } from 'antd'
import { useGetAllItemsQuery, useEditItemMutation } from '../redux/merketApi'

function EditMarketItem({isEditModalOpen, setIsEditModalOpen, itemId, setItemId}) {

    const { message: toast } = App.useApp();

    const { data: { items: market } = { items: [] } } = useGetAllItemsQuery()
    const [editItem, {isSuccess: isEdited, error, isError: isEditError}] = useEditItemMutation()

    const myItem = itemId === '000000' ? {name: '', stowage: 0, price: 0} : market.filter(item => item.localId === itemId)[0]
    
    const [name, setName] = useState(myItem.name)
    const [price, setPrice] = useState(myItem.price)
    const [stowage, setStowage] = useState(myItem.stowage)

    useEffect(() => {
        setName(myItem.name)
        setPrice(myItem.price)
        setStowage(myItem.stowage)
    }, [myItem])

    useEffect(() => {
        if (isEdited) {
            setItemId('000000')
            toast.success('Changed Successfuly')
        }
    }, [isEdited])

    useEffect(() => {
        if (isEditError) {
            toast.error(error.data.message)
        }
    }, [isEditError])

    function handleOk() {
        
        if (name !== '' && price !== null && stowage !== null) {
            
            let item = { price, stowage, name }
            editItem({ id: myItem.id, item })
            
        } else {
            if (name === '') {
                toast.error('Name Is Required')
            } else if (stowage === null) {
                toast.error('Stowage Is Required')
            } else if (price === null) {
                toast.error('Price Is Required')
            }
        }
    };


    return itemId === '000000' ? <div style={{display: 'none'}}>Select One</div> : (
        <Modal title={`Editing item #${itemId}`} className='custom-modal' open={isEditModalOpen} onOk={handleOk} onCancel={() => {setIsEditModalOpen(false); setItemId('000000')}}>
            <Row>
                <Col span={24} style={{textAlign: 'right'}}>
                <img src={myItem.icon} width='40' height='40' alt='icon' />
                </Col>
                <Col span={24} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Name</label>
                    <Input placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
                </Col>
                <Col span={12} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Stowage Count</label>
                    <InputNumber placeholder="Count" onChange={value => setStowage(value)} value={stowage} />
                </Col>
                <Col span={12} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Price</label>
                    <InputNumber placeholder="Price" onChange={value => setPrice(value)} value={price} />
                </Col>
            </Row>
        </Modal>
    );
}

export default EditMarketItem;