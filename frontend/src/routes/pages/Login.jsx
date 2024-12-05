import { 
    EyeInvisibleOutlined,
    EyeTwoTone,
    UserOutlined,
    LockOutlined,
    SendOutlined
    } from '@ant-design/icons';
import { Button, Input, App } from 'antd';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { login, reset } from '../../redux/auth/authSlice'
import PageHead from '../../componenets/PagesHead'

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { message: toast } = App.useApp();
    const isSmallerThan450 = useMediaQuery({ query: '(max-width: 450px)' });
    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

    useEffect(() => {

        if (isError) {
            toast.error(message)
        }
    
        if (isSuccess) {
            toast.success(message)
        }
        
        if (user) {
            navigate('/', { replace: true })
        }
    
        if (isError || isSuccess) {
            dispatch(reset())
        }

    }, [user, isError, isSuccess, message])

    async function handleSubmit(e) {

        e.preventDefault()
        
        const myData = {
            username: e.target.username.value,
            password: e.target.password.value,
        }

        if (myData.username === '' || myData.password === '') {
            toast.error("Please Fill All Fields")
            return;
        }
        
        dispatch(login(myData))
    }

    return (
    <>
        <PageHead pageTitle='Games-Wave' />
        <div className='form-control' style={{width: isSmallerThan450 ? '90%' : 370}}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input name='username' prefix={<UserOutlined />} placeholder="Type Your Username" />
                <Input.Password
                    name='password' placeholder="Type Your Password" prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                <Button type='primary' htmlType='submit' loading={isLoading} icon={<SendOutlined />}>Login</Button>
            </form>
            <Link to='/reset-password'>Forgot Password ?</Link>
            <p style={{textAlign: 'left'}}>Don't have account ? <Link to='/signup'> SignUp</Link></p>
        </div>
    </>
    );
}

export default Login;