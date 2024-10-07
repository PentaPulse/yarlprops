import { useTheme } from '@mui/material';
import * as React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const AlertService = React.createContext();

export const useAlerts = () => {
    return React.useContext(AlertService)
}

const AlertProvider = ({ children }) => {
    const theme = useTheme()

    const showAlerts = (message, type = 'info', position = 'top-right', autoClose = 5000) => {
        toast(message, {
            type,
            position,
            autoClose,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const showAlerts2 = (title, icon, timer = 3000, options = {}) => {
        Swal.fire({
            title: title,
            icon: icon,
            timer: timer,
            background: theme.palette.background.default,
            color: theme.palette.primary.main,
            ...options
        });
    };
    

    return (
        <AlertService.Provider value={{showAlerts,showAlerts2}}>
            {children}
            <ToastContainer
                newestOnTop
                theme={theme.palette.mode}
                limit={2}
            />
        </AlertService.Provider>
    )
}

export default AlertProvider;