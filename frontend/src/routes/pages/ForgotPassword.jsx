import { UserOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, App } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import PageHead from '../../componenets/PagesHead'
import axios from 'axios';
import { useSelector } from 'react-redux';

function ForgotPassword() {

    const { message: toast } = App.useApp();

    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState('')
    const { user } = useSelector(state => state.auth)
    
    const isSmallerThan640 = useMediaQuery({ query: '(max-width: 640px)' });
    const isSmallerThan450 = useMediaQuery({ query: '(max-width: 450px)' });


    async function handleClick() {
        
        try {
            const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";
            setLoading(true)
            let res = await axios.post(API_URL + '/users/forgot-password', { username: user.username })
            setLoading(false)
            toast.success(res.data.message)
        } catch(err) {
            setLoading(false)
            toast.error(err.response.data.message)
        }
    }
    
    async function handleSubmit(e) {

        e.preventDefault()
        
        try {
            const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";
            setLoading(true)
            let res = await axios.post(API_URL + '/users/forgot-password', { username })
            setLoading(false)
            toast.success(res.data.message)
        } catch(err) {
            setLoading(false)
            toast.error(err.response.data.message)
        }
    }

    if (user) return (
        <>
            <PageHead pageTitle='Games-Wave' />
            <div className='form-control' style={{width: isSmallerThan640 ? '90%' : 370}}>
                <h1>Forgot Password</h1>
                <p style={{
                    color: 'rgba(var(--rgbtext), .6)',
                    textAlign: 'left',
                    fontSize: 15,
                    marginBottom: 13
                }}>We will send a reset link to your email <span style={{fontStyle: 'italic'}}>'{user.email}'</span> are you sure you want to continue ?</p>
                <Button type='primary' htmlType='submit' onClick={handleClick} loading={loading} icon={<SendOutlined />}>Submit</Button>
            </div>
        </>
        );

    return (
    <>
        <PageHead pageTitle='Games-Wave' />
        <div className='form-control' style={{width: isSmallerThan450 ? '90%' : 370}}>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <Input name='username' value={username} onChange={e => setUsername(e.target.value)} prefix={<UserOutlined />} placeholder="Type Your Username" />
                <Button type='primary' htmlType='submit' loading={loading} icon={<SendOutlined />}>Submit</Button>
            </form>
        </div>
    </>
    );
}

export default ForgotPassword;