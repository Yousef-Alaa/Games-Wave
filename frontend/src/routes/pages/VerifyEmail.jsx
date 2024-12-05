import { useState, useEffect } from 'react';
import { SendOutlined } from '@ant-design/icons';
import { Button, Input, App } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { verifyEmail, reset } from '../../redux/auth/authSlice'
import PageHead from '../../componenets/PagesHead'

function VerifyEmail() {

    const [ searchParams ] = useSearchParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message: toast } = App.useApp();
    const [verifyCode, setVerifyCode] = useState('')
    const isSmallerThan450 = useMediaQuery({ query: '(max-width: 450px)' });
    const { isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

    useEffect(() => {
        let allow = searchParams.get('allow')
        if (!allow || parseInt(allow) - new Date() < 0) {
            navigate("/", { replace: true })
        }
    }, [])

    useEffect(() => {

        if (isError) {
            toast.error(message)
        }
    
        if (isSuccess) {
            toast.success(message)
            navigate('/profile', { replace: true })
        }
    
        if (isError || isSuccess) {
            dispatch(reset())
        }
        
    }, [isError, isSuccess, message])

    async function handleSubmit(e) {

        e.preventDefault()
        
        if (verifyCode === '') {
            toast.error("Please Fill All Fields")
            return;
        }
        
        dispatch(verifyEmail(verifyCode))
    }

    return (
    <>
        <PageHead pageTitle='Games-Wave' />
        <div className='form-control' style={{width: isSmallerThan450 ? '90%' : 370}}>
            <h1 style={{ fontSize: 28 }}>Verify Your Email</h1>
            <form onSubmit={handleSubmit}>
                <Input.OTP onChange={code => setVerifyCode(code)} />
                <p style={{
                    textAlign: 'left',
                    marginTop: 15,
                    fontSize: 12,
                    color: 'rgba(var(--rgbtext), .6)'
                }}>Enter The Code Was Sent To Your Email</p>
                <Button type='primary' htmlType='submit' loading={isLoading} icon={<SendOutlined />} style={{marginTop: 25}}>Verify</Button>
            </form>
        </div>
    </>
    );
}

export default VerifyEmail;