import { 
    EyeInvisibleOutlined,
    EyeTwoTone,
    UserOutlined,
    UploadOutlined,
    MailOutlined,
    InfoCircleOutlined,
    LockOutlined,
    SendOutlined
    } from '@ant-design/icons';
import { Button, Input, Upload, App } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { z } from 'zod';
import { register, reset } from '../../redux/auth/authSlice'
import PageHead from '../../componenets/PagesHead'

let schema = z.object({
    name: z.string(),
    username: z.string().min(5, {message: "Minimum length of username is 5"}),
    email: z.string().email({message: "Must Be Valid Email"}),
    password: z.string().min(10, {message: "Minimum length of password is 10"})
});

function SignUp() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { message: toast } = App.useApp();
    const [profilePhoto, setProfilePhoto] = useState({})
    const isSmallerThan450 = useMediaQuery({ query: '(max-width: 450px)' })
    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

    useEffect(() => {

        if (isError) {
            toast.error(message)
        }
    
        if (isSuccess) {
            toast.success(message)
        }
        
        if (user) {
            navigate(`/verify-email?allow=${Date.now() + 60*60*1000}`)
        }

        if (isError || isSuccess) {
            dispatch(reset())
        }
    
    }, [user, isError, isSuccess, message])

    async function handleSubmit(e) {

        e.preventDefault()
        
        const myData = {
            name: e.target.name.value,
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        }
        
        let testTheData = schema.safeParse(myData)

        if (!testTheData.success) {
            testTheData.error.issues.forEach(err => toast.error(err.message))
            return;
        }

        if (myData.password !== e.target.confirmPassword.value) {
            toast.error("Password Must Match");
            return;
        }
        
        let formData = new FormData()
        Object.keys(myData).forEach(key => formData.append(key, myData[key]))
        
        if (profilePhoto.name) {
            if (profilePhoto.size > .5 * 1024 * 1024) {
                toast.error("Max Size Of Profile Photo is 0.5MP");
                return;
            }
            formData.append('profilePhoto', profilePhoto)
        }
        
        dispatch(register(formData))
    }

    return (
    <>
        <PageHead pageTitle='Games-Wave' />
        <div className='form-control' style={{width: isSmallerThan450 ? '90%' : 370}}>
            <h1>SignUp</h1>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <Input name='name' prefix={<InfoCircleOutlined />} placeholder="Type Your Name" />
                <Input name='username' prefix={<UserOutlined />} placeholder="Type Your Username" />
                <Input name='email' type='email' prefix={<MailOutlined />} placeholder="Type Your Email" />
                <Input.Password
                    name='password' placeholder="Type Your Password" prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                <Input.Password
                    name='confirmPassword' placeholder="Confirm Password" prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                <Upload name='profilePhoto' maxCount={1} accept='image/*' beforeUpload={_ => false} onChange={info => setProfilePhoto(info.file)}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Button type='primary' htmlType='submit' loading={isLoading} icon={<SendOutlined />}>Create Account</Button>
            </form>
            <p>Already have account ? <Link to='/login'>LogIn</Link></p>
        </div>
    </>
    );
}

export default SignUp;