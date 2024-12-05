import { useEffect, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { Button, Table, App, Popconfirm } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import { useGetAllItemsQuery, useDeleteItemsMutation } from '../../redux/merketApi';

import Loading from '../../componenets/Loading'
import PagesHead from '../../componenets/PagesHead';
import NewMarketItem from '../../componenets/NewMarketItem';
import EditMarketItem from '../../componenets/EditMarketItem';
import { ReactComponent as NODATA } from '../../assets/no-market.svg'

const columns = [
    { title: '#ID', dataIndex: 'localId'},
    { title: 'Icon', dataIndex: 'iconAsImg' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price', sorter: (a, b) => a.price - b.price},
    { title: 'Stowage', dataIndex: 'stowage', sorter: (a, b) => a.stowage - b.stowage},
    { title: 'Actions', dataIndex: 'actions' }
];


export default function Market() {

    const { message: toast } = App.useApp();
    const [deleteItems, {isSuccess: isDeleted}] = useDeleteItemsMutation()
    const { data: { items: market } = { items: [] }, isLoading } = useGetAllItemsQuery()
    
    const [itemId, setItemId] = useState('000000')
    const [localMarket, setLocalMarket] = useState([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
    selectedRowKeys,
    onChange: newKeys => setSelectedRowKeys(newKeys),
    selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
            key: 'odd',
            text: 'Select Odd Row',
            onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                    if (index % 2 !== 0) {
                        return false;
                    }
                    return true;
                });
                setSelectedRowKeys(newSelectedRowKeys);
            },
        },
        {
            key: 'even',
            text: 'Select Even Row',
            onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                    if (index % 2 !== 0) {
                    return true;
                    }
                    return false;
                });
                setSelectedRowKeys(newSelectedRowKeys);
            },
        },
    ],
    };

    useEffect(() => {

        let getActions = item => 
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: '20px' }}>
                <MdOutlineEdit onClick={() => {setIsEditModalOpen(true); setItemId(item.localId)}} style={{cursor: "pointer", fontSize: 18}} />
                <Popconfirm
                    okText="Yes"
                    cancelText="No"
                    placement="topRight"
                    title='Confirm Deleting'
                    description={`Are you sure to delete Item ?`}
                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                    onConfirm={() => {
                        deleteItems([item.id])
                        setItemId('000000')
                    }}
                >
                    <DeleteOutlined style={{cursor: "pointer", fontSize: 18, color: '#ff4d4f'}} />
                </Popconfirm>
            </div>

        let data = market.map((item, ind) => {
            let i = ind + 1;
            return {
                ...item, 
                key: i,
                iconAsImg: <img src={item.icon} width='40' height='40' alt='icon' />,
                actions: getActions(item)
            }
        })

        setLocalMarket(data)

    }, [market])

    useEffect(() => {
        if (isDeleted) {
            setSelectedRowKeys([])
            setItemId('000000')
            toast.success('Deleted Successfuly');
        }
    }, [isDeleted])

    function handleDeleteItems() {
        
        let items = localMarket.filter(item => selectedRowKeys.includes(item.key)).map(item => item.id)
        if (items.length === 0) {
            toast.error('Please Select At Least One Item')
            return;
        }
        deleteItems(items)
    }

    if (isLoading) return <Loading />

    return (
    <div className='market'>
        <PagesHead pageTitle='Market' />
        {
            localMarket.length > 0 ?
            <Table rowSelection={rowSelection} columns={columns} dataSource={localMarket} /> :
            <div className='no-data no-data-market'><NODATA /></div>
        }
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingBottom: 40}}>
            <Button type='primary' onClick={() => setIsNewModalOpen(true)} style={{marginRight: 12}}>Add New Item</Button>
            {localMarket.length > 0 && <Button type='primary' onClick={handleDeleteItems} danger>Delete Selected Items</Button>}
        </div>
        
        <NewMarketItem isNewModalOpen={isNewModalOpen} setIsNewModalOpen={setIsNewModalOpen} />
        <EditMarketItem isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} itemId={itemId} setItemId={setItemId} />
    </div>)
}
