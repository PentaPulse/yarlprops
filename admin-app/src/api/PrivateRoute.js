//import* as  React from 'react';
import { useAuth } from './AuthContext';
import AdminRegister from '../dashboards/Admin/LoginLayout';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <AdminRegister/>;
    }
    return children;
};

export default PrivateRoute;
