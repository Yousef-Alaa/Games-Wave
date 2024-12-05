import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ Page }) {

    const { user } = useSelector(state => state.auth)

    if  (!user) return <Navigate to="/" replace={true} />

    return <Page />;
}

export default ProtectedRoute;