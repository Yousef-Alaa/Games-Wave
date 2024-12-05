import { Routes, Route } from "react-router-dom";
import ProtectedRoute from '../componenets/ProtectedRoute'
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Market from './pages/Market';
import Settings from './pages/Settings';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Page404 from './pages/404';


export default function TheRoutes() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            <Route path="/profile" element={<ProtectedRoute Page={Profile} />} />
            <Route path="/market" element={<ProtectedRoute Page={Market} />} />
            <Route path="/settings" element={<ProtectedRoute Page={Settings} />} />
            <Route path="/verify-email" element={<ProtectedRoute Page={VerifyEmail} />} />
            
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}