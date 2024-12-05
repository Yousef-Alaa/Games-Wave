import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";

async function register(data) {

    let res = await axios.post(API_URL + '/users/register', data)

    if (res.data) Cookies.set('token', res.data.token, { expires: import.meta.env.MODE === 'development' ? 1 / 24 : 7 });

    return res.data
}

async function login(data) {

    let res = await axios.post(API_URL + '/users/login', data)

    if (res.data) Cookies.set('token', res.data.token, { expires: import.meta.env.MODE === 'development' ? 1 / 24 : 7 });

    return res.data
}

async function updateUser(data) {

    let token = Cookies.get('token')

    let res = await axios.put(API_URL + '/users', data, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    return res.data
}

async function verifyEmail(verifyCode) {

    let token = Cookies.get('token')

    let res = await axios.post(API_URL + '/users/verify-email', { verifyCode }, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    return res.data
}

async function deleteUser() {

    let token = Cookies.get('token')
    let res = await axios.delete(API_URL + '/users', {
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    Cookies.remove('token')

    return res.data
}

const authServices = { 
    register,
    login,
    updateUser,
    verifyEmail,
    deleteUser
}

export default authServices