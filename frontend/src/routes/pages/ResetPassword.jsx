import { 
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    SendOutlined
    } from '@ant-design/icons';
import { Button, Input, App } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import PageHead from '../../componenets/PagesHead'
import axios from 'axios';

function ResetPassword() {

    
    const { token } = useParams();
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams()
    
    const { message: toast } = App.useApp();
    const [loading, setLoading] = useState('')
    const isSmallerThan450 = useMediaQuery({ query: '(max-width: 450px)' });

    useEffect(() => {
        let allow = searchParams.get('allow')
        if (!allow || parseInt(allow) - new Date() < 0) {
            navigate("/", { replace: true })
        }
    }, [])

    async function handleSubmit(e) {

        e.preventDefault()
        

        const password = e.target.password.value;
        const confirmPassword = e.target.confirmpassword.value;

        if (confirmPassword === '' || password === '') {
            toast.error("Please Fill All Fields")
            return;
        }
        
        if (confirmPassword !== password) {
            toast.error("Password Must Match")
            return;
        }
        
        try {
            const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";
            setLoading(true)
            let res = await axios.post(`${API_URL}/users/reset-password/${token}`, { password })
            setLoading(false)
            toast.success(res.data.message)
            navigate('/login', { replace: true })
        } catch(err) {
            setLoading(false)
            toast.error(err.response.data.message)
        }
    }

    return (
    <>
        <PageHead pageTitle='Games-Wave' />
        <div className='form-control' style={{width: isSmallerThan450 ? '90%' : 370}}>
            <h1>Reset Your Password</h1>
            <form onSubmit={handleSubmit}>
                <Input.Password
                    name='password' placeholder="Type Your Password" prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                <Input.Password
                    name='confirmpassword' placeholder="Confirm Password" prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                <Button type='primary' htmlType='submit' loading={loading} icon={<SendOutlined />}>Save</Button>
            </form>
        </div>
    </>
    );
}

export default ResetPassword;