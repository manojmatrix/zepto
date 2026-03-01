import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token) {
        // Not logged in? Send to login page
        return <Navigate to="/login" />;
    }

    if (user.role !== allowedRole) {
        // Wrong role? Send back to their own dashboard
        return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/seller-dashboard'} />;
    }

    return children; // If all good, show the page
};
export default ProtectedRoute;