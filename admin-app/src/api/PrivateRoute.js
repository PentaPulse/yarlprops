//import* as  React from 'react';
import { useAuth } from './AuthContext';
import {LoginLayout} from '../components/Sign/LoginLayout';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <LoginLayout/>;
    }
    return children;
};

export default PrivateRoute;
