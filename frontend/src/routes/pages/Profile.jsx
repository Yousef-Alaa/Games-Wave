import axios from 'axios';
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { MdOutlineEdit } from 'react-icons/md';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Upload, Modal, Row, Col, Input, App } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { updateUser, deleteUser, reset } from '../../redux/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom';

function Profile() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { message: toast } = App.useApp();
    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)
    
    const [verifyLoading, setVerifyLoading] = useState(false)
    
    // Control Inputs
    const [passwords, setPasswords] = useState({})
    const [updatedData, setUpdatedData] = useState({})
    const [userPassword, setUserPassword] = useState('')
    
    // Control Modals
    const [modalTitle, setModalTitle] = useState('') // Name OR Email
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
    
    const image = user?.profilePhoto ? user.profilePhoto : '/images/profile_default.jpg'

    useEffect(() => {

        if (isError) {
            toast.error(message)
        }
    
        if (isSuccess) {
            toast.success(message)
            setPasswords({})
            setUpdatedData({})
            setIsSaveModalOpen(false)
            setIsPasswordModalOpen(false)
        }
    
        if (isError || isSuccess) {
            dispatch(reset())
        }

    }, [user, isError, isSuccess, message])
    

    function handleCancel() {

        let data = {...updatedData}
        if (modalTitle === 'Name') {
            if (data.name) delete data.name;
        }
        else if (modalTitle === 'Email') {
            if (data.email) delete data.email;
        }
        setUpdatedData(data)
        setIsEditModalOpen(false)
    }
    
    function handleSave() {
        let data = {...updatedData};

        Object.keys(data).forEach(key => {
            if (data[key] === '') delete data[key]
        })

        if (data.profilePhoto) {
            if (data.profilePhoto.size > .5 * 1024 * 1024) {
                toast.error("Max Size Of Profile Photo is 0.5MP");
                return;
            }
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailPattern.test(data.email)) {
            toast.error("Invalid Email");
            return;
        }

        const formData = new FormData()
        Object.keys(data).forEach(key => formData.append(key, data[key]))
        if (!userPassword) {
            toast.error("Please Type Your Password")
            return;
        }
        formData.append('password', userPassword)
        dispatch(updateUser(formData))
    }

    function handleChangePassword() {
        
        let data = {...passwords};

        if (!passwords.password || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error("All Fields Is Required");
            return;
        }
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Confirm Password Must Match");
            return;
        }

        delete data.confirmPassword;

        dispatch(updateUser(data))
    }

    async function sendVerifyEmail() {
        try {
            setVerifyLoading(true)
            const token = Cookies.get('token')
            const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";
            const res = await axios.post(API_URL + '/users/send-verify-email', {}, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            
            setVerifyLoading(false)
            toast.success(res.data.message)
            navigate(`/verify-email?allow=${Date.now() + 60*60*1000}`)
        } catch(err) {
            setVerifyLoading(false)
            toast.error(err.message)
        }
    }
    
    return (
        <div className="profile-page">
            <div className='photo'>
                <img src={image} alt="profile" />
                <p>@{user.username}</p>
                <Upload 
                    maxCount={1} 
                    accept='image/*' 
                    name='profilePhoto' 
                    beforeUpload={_ => false} 
                    onChange={info => {
                        if (info.file.status === 'removed') 
                            setUpdatedData(state => {
                                let copy = { ...state }
                                delete copy.profilePhoto
                                return copy;
                            }) 
                        else setUpdatedData(state => ({...state, profilePhoto: info.file}))
                    }}
                    >
                    <button className='edit-btn'><MdOutlineEdit /> Edit Photo</button>
                </Upload>
            </div>
            <div className="info">
                <div>
                    <span>Name: </span>
                    <span>{updatedData.name || user.name}</span>
                    <span><MdOutlineEdit onClick={_ => {setModalTitle('Name');setIsEditModalOpen(true)}} /></span>
                </div>
                <div>
                    <span>Email: </span>
                    <span>{updatedData.email || user.email}</span>
                    <span><MdOutlineEdit onClick={_ => {setModalTitle('Email');setIsEditModalOpen(true)}} /></span>
                </div>
                <div>
                    <span>Email Verification: </span>
                    <span className='is-verified' style={{color: user.emailVerified ? "#4DB6AC" : "#EF5350"}}>{user.emailVerified ? "Verified" : "Not Verified"}</span>
                </div>
            </div>
            <div className='buttons'>
                {Object.keys(updatedData).length > 0 && <Button type='primary' onClick={_ => setIsSaveModalOpen(true)}>Save Changes</Button>}
                {!user.emailVerified && <Button loading={verifyLoading} onClick={sendVerifyEmail}>Verify Email</Button>}
                <Button onClick={_ => {setIsPasswordModalOpen(true)}}>Change Password</Button>
                <Popconfirm
                    title="Delete Your Account"
                    description="Are you sure you want to delete this account?"
                    onConfirm={_ => dispatch(deleteUser())}
                    okText="Yes"
                    okButtonProps={{ loading: isLoading }}
                    icon={<QuestionCircleOutlined style={{color: 'red'}} />}
                >
                    <Button type='primary' danger >Delete Account</Button>
                </Popconfirm>
            </div>
            <Modal title={`Change Your ${modalTitle}`} className='custom-modal' open={isEditModalOpen} onOk={_ => setIsEditModalOpen(false)} onCancel={handleCancel}>
                <Row>
                    {/* 2 Cases: Name, Email */}
                    <Col span={24} style={{marginBottom: 15}}>
                        {
                            modalTitle === "Name" ? <Input placeholder="Name" value={updatedData.name || user.name} onChange={e => setUpdatedData(state => ({...state, name: e.target.value}))} /> :
                            modalTitle === "Email" ? <Input placeholder="Email" value={updatedData.email || user.email} onChange={e => setUpdatedData(state => ({...state, email: e.target.value}))} /> : null
                        }
                    </Col>
                </Row>
            </Modal>
            <Modal title={`Change Your Password`} className='custom-modal' confirmLoading={isLoading} open={isPasswordModalOpen} onOk={handleChangePassword} onCancel={_ => {setPasswords({});setIsPasswordModalOpen(false)}}>
                <Row>
                    <Col span={24} style={{marginBottom: 15}}>
                        <Input type='password' placeholder="Old Password" style={{margin: '10px 0'}} value={passwords.password || ""} onChange={e => setPasswords(state => ({...state, password: e.target.value}))} />
                        <Input type='password' placeholder="New Password" style={{marginBottom: 10}} value={passwords.newPassword || ""} onChange={e => setPasswords(state => ({...state, newPassword: e.target.value}))} />
                        <Input type='password' placeholder="Confirm Password" value={passwords.confirmPassword || ""} onChange={e => setPasswords(state => ({...state, confirmPassword: e.target.value}))} />
                        <Link to='/reset-password' style={{ marginTop: 12, display: 'block' }}>Forgot Password ?</Link>
                    </Col>
                </Row>
            </Modal>
            <Modal title={`Save Your Changes`} className='custom-modal' confirmLoading={isLoading} open={isSaveModalOpen} onOk={handleSave} onCancel={_ => {setIsSaveModalOpen(false);setUserPassword('')}}>
                <Row>
                    <Col span={24} style={{marginBottom: 15}}>
                        <Input
                            type='password'
                            style={{margin: '10px 0'}} 
                            placeholder="Type Your Password" 
                            value={userPassword} 
                            onChange={e => setUserPassword(e.target.value)} 
                        />
                        <Link to='/reset-password' style={{ marginTop: 5, display: 'block' }}>Forgot Password ?</Link>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}

export default Profile;